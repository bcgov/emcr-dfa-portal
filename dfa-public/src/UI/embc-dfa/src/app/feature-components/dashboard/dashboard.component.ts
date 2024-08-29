import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TabModel } from 'src/app/core/model/tab.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ApplicationService as Service } from '../../core/api/services/application.service';
import { ProfileService } from 'src/app/core/api/services';
import { ContactService } from 'src/app/core/api/services';
import { tap } from 'rxjs/internal/operators/tap';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { first, mergeMap, Observable, Subject } from 'rxjs';
import { EligibilityService } from '../../core/api/services/eligibility.service';
import { DisasterEvent } from 'src/app/core/api/models';
import { LoginService } from '../../core/services/login.service';

//import { DfaApplicationMain } from 'src/app/core/api/models';

@Component({
  selector: 'app-dfa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentFlow: string;
  currentApplicationsCount = 0;
  pastApplicationsCount = 0;
  eventsCount = "0";
  isLoading = false;
  bgColor = 'transparent';
  intervalId;
  hasActiveEvents = false;

  sixtyOneDaysAgo: number = 0;
  tabs: DashTabModel[];
  openDisasterEvents: DisasterEvent[];
  businessName = "";
  noApplicationsText = 'No active applications, click the "Create a New Application" button to begin';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private appService: Service,
    private eligibilityService: EligibilityService,
    private loginService: LoginService,
    private contactService: ContactService,
    private appSessionService: AppSessionService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private eventService: EligibilityService,
  ) {
    this.sixtyOneDaysAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 61)).getTime()
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.isLoading = true;

    // 2024-07-22 EMCRI-440 waynezen; use new ContactService to get Business Name from Keycloak access token
    // console.debug('[DFA] dashboard loading');
    
    this.contactService.contactGetLoginInfo().subscribe(loginInfo => {
      if (loginInfo) {
        this.businessName = loginInfo?.bceid_business_name;
        this.dfaApplicationMainDataService.setBusiness(loginInfo?.bceid_business_name);
      }
    });

    this.eventService.eligibilityGetEvents().subscribe({
      next: (count: number) => {
        this.hasActiveEvents = count > 0;
      },
      error: (error) => {
        // console.debug('[DFA] dashboard error: ' + "eventService.eligibilityGetEvents"); 
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });


    //this.currentApplicationsCount = this.appSessionService.appNumber;
    this.currentApplicationsCount = 0;
    this.pastApplicationsCount = 0;
    this.eventsCount = "0";

    this.appSessionService.currentApplicationsCount.subscribe((n: number) => {
      this.currentApplicationsCount = n;
      this.tabs[0].count = n ? n.toString() : "0";
    });
    this.appSessionService.pastApplicationsCount.subscribe((n: number) => {
      this.pastApplicationsCount = n;
      this.tabs[1].count = n ? n.toString() : "0";
    });

    this.appService.applicationGetDfaApplications().subscribe({
      next: (lstData) => {
        if (lstData != null) {
          this.countAppData(lstData);
          this.tabs[0].count = this.currentApplicationsCount.toString();
          this.tabs[1].count = this.pastApplicationsCount.toString();
        }
      },
      error: (error) => {
      }
    });

    this.eligibilityService.eligibilityGetEvents().subscribe(eventsCount => {
      this.eventsCount = eventsCount.toString();
      this.tabs[2].count = eventsCount.toString();
    })

    this.tabs = [
      {
        label: 'Open Applications',
        route: 'current',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.currentApplicationsCount.toString()
      },
      {
        label: 'Closed Applications',
        route: 'past',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.pastApplicationsCount.toString()
      },
      {
        label: 'DFA Events',
        route: 'eventlist',
        activeImage: '/assets/images/curr-evac-active.svg',
        inactiveImage: '/assets/images/curr-evac.svg',
        count: this.eventsCount
      },
    ];

    this.isLoading = false;
  }

  countAppData(lstApp: Object): void {
    var res = JSON.parse(JSON.stringify(lstApp));
    let lstApplications = res;
    this.currentApplicationsCount = 0; this.pastApplicationsCount = 0;
    lstApplications.forEach(x => {
      if (
        (x.status.toLowerCase() === "dfa decision made"
        || x.status.toLowerCase() === "closed: inactive" || x.status.toLowerCase() === "closed: withdrawn")
        &&
        (x.dateFileClosed && (this.sixtyOneDaysAgo <= new Date(x.dateFileClosed).getTime()))
      ) {
          this.pastApplicationsCount++;
      } else this.currentApplicationsCount++;
    })
  }

  navigateToDFAApplicationCreate(): void {

    this.dfaApplicationMainDataService.setApplicationId(null);
    this.dfaApplicationMainDataService.setViewOrEdit('add');

    this.router.navigate(['/dfa-application-main']);
  }

}
export interface DashTabModel {
  label: string;
  route: string;
  activeImage?: string | null;
  inactiveImage?: string | null;
  count: string;
}


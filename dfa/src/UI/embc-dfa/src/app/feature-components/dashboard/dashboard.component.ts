import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabModel } from 'src/app/core/model/tab.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ApplicationService as Service } from '../../core/api/services/application.service';
import { ProfileService } from '../profile/profile.service';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { tap } from 'rxjs/internal/operators/tap';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { Observable, Subject } from 'rxjs';
import { EligibilityService } from '../../core/api/services/eligibility.service';
import { DisasterEvent } from 'src/app/core/api/models';
//import {
//  DfaAppapplication
//} from 'src/app/core/api/models';

@Component({
  selector: 'app-dfa-dashboard',
  standalone: false,
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private appService: Service,
    private eligibilityService: EligibilityService,
    private profService: ProfileService,
    private profileDataService: ProfileDataService,
    private appSessionService: AppSessionService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private eventService: EligibilityService,
  ) {
    this.sixtyOneDaysAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 61)).getTime()
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.profService.getProfile();
    this.eventService.eligibilityGetEvents().subscribe({
      next: (count: number) => {
        this.hasActiveEvents = count > 0;
      },
      error: (error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    //alert(this.appSessionService.appNumber);
    //this.currentApplicationsCount = this.appSessionService.appNumber;
    this.appSessionService.currentApplicationsCount.subscribe((n: number) => {
      this.currentApplicationsCount = n;
      this.tabs[0].count = n ? n.toString() : "0";
    });
    this.appSessionService.pastApplicationsCount.subscribe((n: number) => {
        this.pastApplicationsCount = n;
        this.tabs[2].count = n ? n.toString() : "0";
    });

    this.isLoading = true;

    this.appService.applicationGetDfaApplications().subscribe({
      next: (lstData) => {
        if (lstData != null) {
          this.countAppData(lstData);
          this.tabs[0].count =this.currentApplicationsCount.toString();
          this.tabs[2].count = this.pastApplicationsCount.toString();
        }
      },
      error: (error) => {
      }
    });

    this.eligibilityService.eligibilityGetEvents().subscribe(eventsCount => {
      this.eventsCount = eventsCount.toString();
      this.tabs[1].count = eventsCount.toString();
    })

    this.tabs = [
    {
      label: 'Current Applications',
      route: 'current',
      activeImage: '/assets/images/past-evac-active.svg',
      inactiveImage: '/assets/images/past-evac.svg',
      count: this.currentApplicationsCount.toString()
    },
    {
      label: 'DFA Events',
      route: 'eventlist',
      activeImage: '/assets/images/curr-evac-active.svg',
      inactiveImage: '/assets/images/curr-evac.svg',
      count: this.eventsCount
    },
    {
      label: 'Past Applications',
      route: 'past',
      activeImage: '/assets/images/past-evac-active.svg',
      inactiveImage: '/assets/images/past-evac.svg',
      count: this.pastApplicationsCount.toString()
    },
    {
      label: 'Profile',
      route: 'profile',
      activeImage: '/assets/images/profile-active.svg',
      inactiveImage: '/assets/images/profile.svg',
      count: ""
    }
  ];

  this.isLoading = false;
  }

  countAppData(lstApp: Object): void {

    let lstApplications = JSON.parse(JSON.stringify(lstApp)); 
  
    this.currentApplicationsCount = 0;
    this.pastApplicationsCount = 0;
  
    lstApplications.forEach(x => {
      //EMCRI-298: Make it past application after appeal stage closing
      if (x.dateAppealClosed &&
        (new Date(x.dateAppealClosed).getTime() <= this.sixtyOneDaysAgo)) {
        x.currentApplication = false;
      }
      else if (
        (x.status.toLowerCase() === "dfa decision made"
        || x.status.toLowerCase() === "closed: inactive" || x.status.toLowerCase() === "closed: withdrawn")
        &&
        (x.dateFileClosed && (new Date(x.dateFileClosed).getTime() <= this.sixtyOneDaysAgo))) {
          this.pastApplicationsCount++;
        } 
      else if (
        /* EMBCDFA-1327: Incomplete application with expired event */
        x.status.toLowerCase() === "closed: inactive" &&
        x.dateFileClosed == null &&
        x.primaryApplicantSignedDate == null)
      {
        this.pastApplicationsCount++;
      } else {
        this.currentApplicationsCount++;
      }
    });
  }

  navigateToDFAPrescreening(): void {
    this.dfaApplicationMainDataService.setViewOrEdit('add');
    var profileId = this.profileDataService.getProfileId();
    this.router.navigate(['/dfa-prescreening']);
  }

}
export interface DashTabModel {
  label: string;
  route: string;
  activeImage?: string | null;
  inactiveImage?: string | null;
  count: string;
}

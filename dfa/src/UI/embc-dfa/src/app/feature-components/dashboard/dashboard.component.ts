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
import { EligibilityService } from 'src/app/core/api/services';
import { DisasterEvent } from 'src/app/core/api/models';
//import {
//  DfaAppapplication
//} from 'src/app/core/api/models';

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
  ) {
    this.sixtyOneDaysAgo = new Date().getDate()-61;
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.profService.getProfile();
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
    var res = JSON.parse(JSON.stringify(lstApp));
    let lstApplications = res;
    this.currentApplicationsCount = 0; this.pastApplicationsCount = 0;
    lstApplications.forEach(x => {
      if ((x.applicationStatusPortal.toLowerCase() === "dfa decision made"
        || x.applicationStatusPortal.toLowerCase() === "closed: inactive" || x.applicationStatusPortal.toLowerCase() === "closed: withdrawn")
        && (x.dateFileClosed && (this.sixtyOneDaysAgo <= new Date(x.dateFileClosed).getDate()))) { // TODO: uncomment
          this.pastApplicationsCount++;
      } else this.currentApplicationsCount++;
    })
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

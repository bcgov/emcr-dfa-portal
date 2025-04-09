import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardComponent } from '../../../feature-components/dashboard/dashboard.component';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { CurrentApplication } from 'src/app/core/api/models';

@Component({
  selector: 'app-dfadashboard-application',
  standalone: false,
  templateUrl: './dfa-application.component.html',
  styleUrls: ['./dfa-application.component.scss']
})
export class DfaApplicationComponent implements OnInit {

  addNewItem(value: number) {
    this.appSessionService.currentApplicationsCount.emit(value);
  }

  items = [
    { label: "Draft Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Submitted Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Reviewing Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Creating Case File", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Checking Criteria", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Assessing Damage", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Reviewing Damage Report", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "DFA Making Decision", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "DFA Decision Made", isCompleted: false, currentStep: false, isFinalStep: true, isErrorInStatus: false },
  ];

  appealitems = [
    { label: "Draft Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Submitted Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Reviewing Application", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Creating Case File", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Checking Criteria", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Assessing Damage", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Reviewing Damage Report", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "DFA Making Decision", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "DFA Decision Made", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Appeal Received", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Appeal In Progress", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { label: "Appeal Closed", isCompleted: false, currentStep: false, isFinalStep: true, isErrorInStatus: false },
  ];

  lstApplications: ApplicationExtended[] = [];
  matchStatusFound = false;
  isLinear = true;
  current = 1;
  public appType: string;
  private sixtyOneDaysAgo: number;
  public isLoading: boolean = true;
  public color: string = "'#169BD5";

  constructor(
    private profileDataService: ProfileDataService,
    private appService: Service,
    private appSessionService: AppSessionService,
    private router: Router,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.appType = this.route.snapshot.data["apptype"];
    this.sixtyOneDaysAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 61)).getTime()
  }

  ngOnInit(): void {

    this.appService.applicationGetDfaApplications().subscribe({
      next: (lstData) => {
        if (lstData != null) {
          var lstDataModified = [];
          var lstDataUnModified = [];
          var initialList = lstData;
          lstDataUnModified.push(initialList);
          lstData.forEach(objApp => {
            var isFound = false;
            var jsonVal = JSON.stringify(this.items);

            if (objApp.status && objApp.status.toLowerCase().indexOf('appeal') > -1) {
              jsonVal = JSON.stringify(this.appealitems);
              objApp.hasAppealStages = true;
            }

            objApp.isErrorInStatus = false;
            objApp.statusBar = JSON.parse(jsonVal);
            objApp.statusBar.forEach(objStatItem => {
              /* EMBCDFA-1327: Technically, this is a draft application, but it's set to closed because it connected to an expired event,
                 so we need to manually set it to the Draft Application status on the status bar. */
              if (objApp.status != null && (
                    objStatItem.label.toLowerCase() == objApp.status.toLowerCase() || (
                      objStatItem.label.toLowerCase() === 'draft application' &&
                      objApp.status.toLowerCase() === 'closed: inactive' 
                    )
                  )) {
                objStatItem.currentStep = true;
                isFound = true
                this.matchStatusFound = true;
              }

              if (isFound == false) {
                objStatItem.isCompleted = true;
              }

              if (objStatItem.isFinalStep == true) {
                if (isFound == false) {
                  objApp.isErrorInStatus = true;
                }
                else if (objStatItem.label.toLowerCase() == objApp.status.toLowerCase()) {
                  objStatItem.isCompleted = true;
                }
              }

            });

            lstDataModified.push(objApp);
          })

          this.mapData(lstDataModified);
        }
            //this.mapData(lstData);
        this.isLoading = false;
      },
      error: (error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
        this.isLoading = false;
      }
    });

  }

  mapData(lstApp: Object): void {

    this.lstApplications = JSON.parse(JSON.stringify(lstApp));
        
    this.lstApplications.forEach(x => {
      //EMCRI-298: Make it past application after appeal stage closing
      if (x.dateAppealClosed &&
        (new Date(x.dateAppealClosed).getTime() <= this.sixtyOneDaysAgo)) {
        x.currentApplication = false;
      }
      else if (( x.status.toLowerCase() === "dfa decision made" || 
            x.status.toLowerCase() === "closed: inactive" || 
            x.status.toLowerCase() === "closed: withdrawn") &&
          (x.dateFileClosed && 
            (new Date(x.dateFileClosed).getTime() <= this.sixtyOneDaysAgo))) 
      {        
        x.currentApplication = false;
      } 
      /* EMBCDFA-1327: Incomplete application with expired event */
      else if (x.status.toLowerCase() === "closed: inactive" &&
                  x.dateFileClosed == null &&
                  x.primaryApplicantSignedDate == null)
      {
        x.currentApplication = false;
      } else {
        x.currentApplication = true;
      }
    })
    if (this.appType === "current") {
      this.lstApplications = this.lstApplications
         .filter(x => x.currentApplication === true);
      this.appSessionService.currentApplicationsCount?.emit(this.lstApplications.length);
    } else {
      this.lstApplications = this.lstApplications
        .filter(x => x.currentApplication === false);
      this.appSessionService.pastApplicationsCount?.emit(this.lstApplications.length);
    }
  }

  ViewApplication(applItem: ApplicationExtended): void {
    this.dfaApplicationMainDataService.setApplicationId(applItem.applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applItem.applicationId);

    if (applItem.primaryApplicantSignedDate == null && applItem.currentApplication != false) {
      this.dfaApplicationMainDataService.setViewOrEdit('update');
    }
    else if (applItem.currentApplication === true) {
      if (applItem.status.toLowerCase() === 'assessing damage' ||
        applItem.status.toLowerCase() === 'reviewing damage report' ||
        applItem.status.toLowerCase() === 'dfa making mecision' ||
        applItem.status.toLowerCase() === 'dfa decision made') {
        this.dfaApplicationMainDataService.setContactOnlyView('contactOnly');
        this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
      }
      else {
        this.dfaApplicationMainDataService.setViewOrEdit('view');
      }
    } else if (applItem.currentApplication === false) {
      this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-application-main/'+applItem.applicationId]);
  }

  EditApplication(applicationId: string, tabId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applicationId);
    this.dfaApplicationMainDataService.setViewOrEdit('edit');
    this.dfaApplicationMainDataService.setEditStep(tabId);
    this.router.navigate(['/dfa-application-main/'+applicationId]);
  }

}

export interface ApplicationExtended extends CurrentApplication {
  currentApplication: boolean;
}

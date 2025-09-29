import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardComponent } from '../../../feature-components/dashboard/dashboard.component';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { ProjectService } from '../../../core/api/services/project.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { CurrentApplication, CurrentProject, StatusBar } from 'src/app/core/api/models';
import { DFAProjectMainDataService } from '../../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAClaimMainDataService } from '../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { Decision } from 'src/app/models/decision.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

// Temporary extension until the OpenAPI spec includes appealStatusBar
// ####################################################################
interface CurrentProjectWithAppeals extends CurrentProject {
  appealStatusBar?: AppealStatusItem[]; // Replace with actual type if available
}

interface AppealStatusItem {
  status: string;
  statusColor?: string;
  currentStep?: boolean;
  stage?: string;
  isCompleted?: boolean;
  isFinalStep?: boolean;
}

interface StatusBarExtended extends StatusBar {
  stages?: string[]
}
// ####################################################################


@Component({
  selector: 'app-dfadashboard-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class DfaDashProjectComponent implements OnInit {

  DecisionEnum = Decision;
  applicationId: string;

  addNewItem(value: number) {
    this.appSessionService.currentProjectsCount.emit(value);
  }

  // TODO if we come back to timelines, it will be easier to refactor the timelines than to make global timeline changes
  // the existing timelines have static data, different schemas, non-normalized data, etc. We should get the steps from Dynamics
  // have a consistent schema, and a reusable angular component for the timelines that has the UI and business logic separated

  // project timeline items
  items = [
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Draft", stage: "", statusColor: "#639DD4", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Submitted", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Under Review", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Approval Pending", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Decision Made", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Closed", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: true, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },

  ];

  // project appeal timeline items
  appealItems = [
    // { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    // { status: "Draft", stage: "", statusColor: "#639DD4", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    // { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Submitted", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Under Review", stage: "",stages: ["Under Review", "Appeals Adjudicator Review", "Appeals Compliance Check"], statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Approval Pending", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Appeal Decision", stage: "", stages:['DFA Project Update', 'Appeal Decision', 'Decision'], statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Closed", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: true, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },

  ];
  lstProjects: ProjectExtended[] = [];
  lstFilteredProjects: ProjectExtended[] = [];
  matchStatusFound = false;
  appealMatchStatusFound = false;
  isLinear = true;
  current = 1;
  appId = null;
  public apptype: string;
  private OneDayAgo: number;
  public isLoading: boolean = true;
  public color: string = "'#169BD5";
  public searchTextInput: string = '';
  public stageSelected: string = '';
  public sortfieldSelected: string = '';
  public filterbydaysSelected: number;

  constructor(
    private profileDataService: ProfileDataService,
    private appService: Service,
    private projService: ProjectService,
    private appSessionService: AppSessionService,
    private router: Router,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dFAProjectMainDataService: DFAProjectMainDataService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.apptype = this.route.snapshot.data["apptype"];
    this.OneDayAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 1)).getTime()
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.applicationId = this.dFAProjectMainDataService.getApplicationId();

    this.projService.projectGetDfaProjects({ applicationId: this.applicationId }).subscribe({
      next: (lstData) => {
        if (lstData != null) {
          var lstDataModified = [];
          var lstDataUnModified = [];
          var initialList = lstData;
          lstDataUnModified.push(initialList);
          lstData.forEach(objApp => {
            let isFound = false;
            const jsonVal = JSON.stringify(this.items);
            objApp.isErrorInStatus = false;
            objApp.statusBar = JSON.parse(jsonVal);
            objApp.statusBar.forEach(objStatItem => {
              if (objApp.status != null && objStatItem.status.toLowerCase() == objApp.status.toLowerCase()) {
                objStatItem.currentStep = true;
                isFound = true;
                this.matchStatusFound = true;

                if(objApp.status == 'Decision Made' && this.hasSubmittedAppeal(objApp)){
                  objApp.stage+= ' (Appealed)';
                }

                if (objApp.stage) {
                  objStatItem.stage = objApp.stage;
                  this.dFAProjectMainDataService.setStage(objApp.stage);
                }

                if (objApp.projectDecision) {
                  this.dFAProjectMainDataService.setProjectDecision(objApp.projectDecision);
                }

                objApp.statusColor = objStatItem.statusColor;

                if (objApp.stage == 'Ineligible' || objApp.stage == 'Withdrawn') {
                  objApp.statusColor = '#E25E63';
                }

                if (objApp.status?.toLowerCase() == 'draft') {
                  objApp.statusColor = '#639DD4';
                }

                if (objApp.status?.toLowerCase().indexOf('decision made') > -1 && objApp.stage?.toLowerCase().indexOf('progress') > -1) {
                  objApp.statusColor = '#FDCB52';
                }
              }

              if (isFound == false) {
                objStatItem.isCompleted = true;
              }

              if (objStatItem.isFinalStep == true) {
                if (isFound == false) {
                  objApp.isErrorInStatus = true;
                }
                else if (objStatItem.status.toLowerCase() == objApp.status.toLowerCase()) {
                  objStatItem.isCompleted = true;
                }
              }

            });

            // This code needs to be updated once the Dynamics API sends the appealStatusBar in the response
            // #############################################################################################
            const objAppWithAppeals = objApp as CurrentProjectWithAppeals;
            // Initialize appealStatusBar if it's missing
            if (!Array.isArray(objAppWithAppeals.appealStatusBar)) {
              objAppWithAppeals.appealStatusBar = JSON.parse(JSON.stringify(this.appealItems));
            }

            isFound = false;
            objAppWithAppeals.appealStatusBar.forEach((objStatItem) => {
              const statusMatch =
                objApp.activeStage?.stage &&
                objStatItem.status?.toLowerCase() === objApp.activeStage.stage.toLowerCase()
                || (objStatItem as StatusBarExtended).stages?.some(stage => stage.toLowerCase() === objApp.activeStage?.stage?.toLowerCase());

              if (statusMatch) {
                if (!objApp.activeStage?.completedOn) {
                  objStatItem.currentStep = true;
                }
                isFound = true;
                this.matchStatusFound = true;

                if (objApp.activeStage.status) {
                  objStatItem.stage = objApp.activeStage.status;
                  //this.dFAProjectMainDataService.setStage(objApp.stage);
                }


                if (objApp.activeStage?.appealDecision) {
                  this.dFAProjectMainDataService.setProjectAppealDecision(objApp.activeStage?.appealDecision);
                }

                // Determine statusColor based on logic
                if (['Ineligible', 'Withdrawn'].includes(objApp.activeStage.stage || '')) {
                  objApp.statusColor = '#E25E63';
                } else if (
                  objApp.activeStage.status?.toLowerCase().includes('decision made') &&
                  objApp.activeStage.stage?.toLowerCase().includes('progress')
                ) {
                  objApp.statusColor = '#FDCB52';
                } else {
                  objApp.statusColor = objStatItem.statusColor;
                }
              }

              // Fallback if status not matched
              if (!isFound) {
                objStatItem.isCompleted = true;
              }

              // Final step validation
              if (objStatItem.isFinalStep) {
                if (!isFound) {
                  // NOTE commented out to avoid fixing a bug found, no side effects found except if the status was set incorrectly
                  //objApp.isErrorInStatus = true;
                } else if (statusMatch && objApp.activeStage?.completedOn) {
                  objStatItem.isCompleted = true;
                }
              }
            });
            // #############################################################################################

            lstDataModified.push(objApp);
          })
          
          this.mapData(lstDataModified);
        }
            //this.mapData(lstData);
        this.isLoading = false;
      },
      error: (error) => {
        //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        this.isLoading = false;
        this._snackBar.open(
          'Unable to Get Project List. Please try again later.',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    });
  }

  Toggle(applItem): void {
    if (applItem.isHidden) {
      applItem.isHidden = false;
    }
    else {
      applItem.isHidden = true;
    }
  }

  getItems(lst) {
    return lst.filter((item) => item.status !== '');
  }

  getStatusBarItems(lst) {
    return lst.filter((item) => item.status !== '');
  }

  mapData(lstApp: Object): void {
    var res = JSON.parse(JSON.stringify(lstApp));
    this.lstProjects = res;
    //dfa decision made

    this.lstProjects.forEach(x => {
      if (
        ( x.status.toLowerCase() === "closed" || x.status.toLowerCase() === "closed: withdrawn")
        &&
        (x.dateFileClosed && (this.OneDayAgo >= new Date(x.dateFileClosed).getTime()))
        )
      {
          x.openProject = false;
      } else x.openProject = true;
    })

    if (this.apptype === "open") {
      this.lstProjects = this.lstProjects
        .filter(x => x.openProject === true);
      this.appSessionService.currentProjectsCount?.emit(this.lstProjects.length);
    } else {
      this.lstProjects = this.lstProjects
        .filter(x => x.openProject === false);
      this.appSessionService.pastProjectsCount?.emit(this.lstProjects.length);
    }

    this.lstFilteredProjects = this.lstProjects;
  }

  ApplyFilter(type: number, searchText: string): void {
    var lstProjectsFilterting = this.lstProjects;

    if (searchText != null){
      this.searchTextInput = searchText;
    }

    if (this.stageSelected != '' && this.stageSelected != null) {

      if (this.stageSelected == 'All') {
        lstProjectsFilterting = lstProjectsFilterting;
      }
      else if (this.stageSelected == 'Approved') {
        lstProjectsFilterting = lstProjectsFilterting.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() == 'approved');
      } else if (this.stageSelected == 'Closed') {
        lstProjectsFilterting = lstProjectsFilterting.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() != 'approved');
      }
      else {
        lstProjectsFilterting = lstProjectsFilterting.filter(m => m.status.toLowerCase().indexOf(this.stageSelected.toLowerCase()) > -1);
      }
    }

    if (this.filterbydaysSelected && this.filterbydaysSelected != -1) {
      var backdate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * this.filterbydaysSelected));
      lstProjectsFilterting = lstProjectsFilterting.filter(m => (backdate <= new Date(m.createdDate)));
    }


    if (this.sortfieldSelected != '' && this.sortfieldSelected != null) {
      if (this.sortfieldSelected == 'projectname') {

        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (a.projectName.toLowerCase() > b.projectName.toLowerCase()) ? 1 : ((b.projectName.toLowerCase() > a.projectName.toLowerCase()) ? -1 : 0))
      } else if (this.sortfieldSelected == 'projectnumber') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (a.projectNumber.toLowerCase() > b.projectNumber.toLowerCase()) ? 1 : ((b.projectNumber.toLowerCase() > a.projectNumber.toLowerCase()) ? -1 : 0))
      } else if (this.sortfieldSelected == 'sitelocation') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (a.siteLocation.toLowerCase() > b.siteLocation.toLowerCase()) ? 1 : ((b.siteLocation.toLowerCase() > a.siteLocation.toLowerCase()) ? -1 : 0))
      } else if (this.sortfieldSelected == 'completiondate') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (new Date(a.estimatedCompletionDate) > new Date(b.estimatedCompletionDate)) ? 1 : (new Date(b.estimatedCompletionDate) > new Date(a.estimatedCompletionDate) ? -1 : 0))
      } else if (this.sortfieldSelected == '18monthdeadline') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (new Date(a.deadline18Month) > new Date(b.deadline18Month)) ? 1 : (new Date(b.deadline18Month) > new Date(a.deadline18Month) ? -1 : 0))
      }
    }

    if (this.searchTextInput != null) {
      lstProjectsFilterting = lstProjectsFilterting.filter(m => (m.projectName && m.projectName.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1)
        || (m.projectNumber && m.projectNumber.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1)
        || (m.siteLocation && m.siteLocation.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1));
    }

    this.lstFilteredProjects = lstProjectsFilterting;
  }

  ViewClaims(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);
    this.dfaClaimMainDataService.setProjectId(applItem.projectId);

    if (applItem.openProject === true) {
      this.dFAProjectMainDataService.setViewOrEdit('view');
    } else if (applItem.openProject === false) {
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-project/' + applItem.projectId + '/claims']);
  }

  ViewAmendment(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);

    if (applItem.openProject === true) {
      if (applItem.status.toLowerCase() == 'draft') {
        this.dFAProjectMainDataService.setViewOrEdit('updateproject');
      } else {
        this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
      }
    } else if (applItem.openProject === false) {
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-project-amendment/' + applItem.projectId]);
  }

  ViewAmendments(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);

    if (applItem.openProject === true) {
      if (applItem.status.toLowerCase() == 'draft') {
        this.dFAProjectMainDataService.setViewOrEdit('updateproject');
      } else {
        this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
      }
    } else if (applItem.openProject === false) {
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-project-amendments/' + applItem.projectId]);
  }

  ViewProject(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);
    //this.dFAProjectMainDataService.setApplicationId(applItem.applicationId);

    var urlPrj = "/dfa-project-main/";

    if (applItem.openProject === true) {
      if (applItem.status.toLowerCase() == 'draft') {
        urlPrj = "/dfa-project-main/";
        this.dFAProjectMainDataService.setViewOrEdit('updateproject');
      } else {
        urlPrj = "/dfa-project-view/";
        this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
      }
    } else if (applItem.openProject === false) {
      urlPrj = "/dfa-project-view/";
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate([urlPrj + applItem.projectId]);
  }

  canAppeal(project: CurrentProject): boolean {
    return project.projectDecision 
      && (
          (project.projectDecision.toLowerCase() === 'approved with exclusions')
          || (project.projectDecision.toLowerCase() === 'ineligible' && !!project.dateFileClosed)
        );
  }

  hasSubmittedAppeal(project: CurrentProject): boolean {
    return project.activeStage?.submissionDate != null;
  }

  appealHasRemainingDays(project: CurrentProject): boolean {
    return this.remainingDays(project) >= 0;
  }

  remainingDays(project: CurrentProject): number {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day 
    let endDateStr: string;
    
    if(project.projectDecision?.toLowerCase() === 'approved with exclusions'){
      endDateStr = project.projectApprovedDate;
    } else if(project.projectDecision?.toLowerCase() === 'ineligible'){
      endDateStr = project.dateFileClosed;
    }

    let endDate = new Date(endDateStr);

    console.log("End Date: ", project.projectNumber, endDate.toISOString());
    endDate.setDate(endDate.getDate() + 60);  // add 60 days
    return Math.round((endDate.getTime() - new Date().getTime()) / oneDay);
  }

  appealButtonTitle(project: CurrentProject): string {
    return this.remainingDays(project) < 0 ? 'The 60 day deadline has passed and eligibility of this project cannot be appealed.' : '';
  }

  appealButtonClass(project: CurrentProject): string {
    return this.appealHasRemainingDays(project) ? 'application-button' : 'disabled-button';
  }

  appealDecision(project: CurrentProject): void {
    var applealId = project.activeStage?.id?? 'new';
    this.router.navigate(['/application/' + this.applicationId + '/project/' + project.projectId + '/appeal/' + applealId]);
  }
}

export interface ProjectExtended extends CurrentProject {
  openProject: boolean;
}

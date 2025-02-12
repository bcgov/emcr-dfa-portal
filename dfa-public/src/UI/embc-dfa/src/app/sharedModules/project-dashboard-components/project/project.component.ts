import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardComponent } from '../../../feature-components/dashboard/dashboard.component';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { ProjectService } from '../../../core/api/services/project.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { CurrentApplication, CurrentProject } from 'src/app/core/api/models';
import { DFAProjectMainDataService } from '../../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAClaimMainDataService } from '../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { Decision } from 'src/app/models/decision.enum';

@Component({
  selector: 'app-dfadashboard-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class DfaDashProjectComponent implements OnInit {

  DecisionEnum = Decision;

  addNewItem(value: number) {
    this.appSessionService.currentProjectsCount.emit(value);
  }

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
  lstProjects: ProjectExtended[] = [];
  lstFilteredProjects: ProjectExtended[] = [];
  matchStatusFound = false;
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
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.apptype = this.route.snapshot.data["apptype"];
    this.OneDayAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 1)).getTime()
  }

  ngOnInit(): void {
    var applicationId = this.dFAProjectMainDataService.getApplicationId();

    this.projService.projectGetDfaProjects({ applicationId: applicationId }).subscribe({
      next: (lstData) => {
        if (lstData != null) {
          var lstDataModified = [];
          var lstDataUnModified = [];
          var initialList = lstData;
          lstDataUnModified.push(initialList);
          lstData.forEach(objApp => {
            var isFound = false;
            var jsonVal = JSON.stringify(this.items);
            objApp.isErrorInStatus = false;
            objApp.statusBar = JSON.parse(jsonVal);
            objApp.statusBar.forEach(objStatItem => {
              if (objApp.status != null && objStatItem.status.toLowerCase() == objApp.status.toLowerCase()) {
                objStatItem.currentStep = true;
                isFound = true;
                this.matchStatusFound = true;

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

                if (objApp.status.toLowerCase() == 'draft') {
                  objApp.statusColor = '#639DD4';
                }

                if (objApp.status.toLowerCase().indexOf('decision made') > -1 && objApp.stage.toLowerCase().indexOf('progress') > -1) {
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
    this.isLoading = false;
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
        (x.status.toLowerCase() === "decision made"
          || x.status.toLowerCase() === "closed" || x.status.toLowerCase() === "closed: withdrawn")
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

}

export interface ProjectExtended extends CurrentProject {
  openProject: boolean;
}

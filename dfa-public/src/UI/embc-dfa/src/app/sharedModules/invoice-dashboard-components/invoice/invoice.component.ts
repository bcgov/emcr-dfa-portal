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

@Component({
  selector: 'app-dfadashboard-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class DfaDashInvoiceComponent implements OnInit {

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
  private sixtyOneDaysAgo: number;
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
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.apptype = this.route.snapshot.data["apptype"];
    this.sixtyOneDaysAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 61)).getTime()
  }

  ngOnInit(): void {
    var applicationId = '0b9eec99-1a34-ef11-b850-00505683fbf4'; //this.dFAProjectMainDataService.getApplicationId();

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
                isFound = true
                this.matchStatusFound = true;

                if (objApp.stage) {
                  objStatItem.stage = objApp.stage;
                }

                objApp.statusColor = objStatItem.statusColor;

                if (objApp.stage == 'Ineligible' || objApp.stage == 'Withdrwan') {
                  objApp.statusColor = '#E25E63';
                }

                if (objApp.status.toLowerCase() == 'draft') {
                  objApp.statusColor = '#639DD4';
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
          || x.status.toLowerCase() === "closed: inactive" || x.status.toLowerCase() === "closed: withdrawn")
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
      if (this.sortfieldSelected == 'claimnumber') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (a.projectName > b.projectName) ? 1 : ((b.projectName > a.projectName) ? -1 : 0))
      } else if (this.sortfieldSelected == 'submitteddate') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (a.projectNumber > b.projectNumber) ? 1 : ((b.projectNumber > a.projectNumber) ? -1 : 0))
      } else if (this.sortfieldSelected == 'claimpaiddate') {
        lstProjectsFilterting = lstProjectsFilterting.sort((a, b) => (new Date(a.estimatedCompletionDate) > new Date(b.estimatedCompletionDate)) ? 1 : (new Date(b.estimatedCompletionDate) > new Date(a.estimatedCompletionDate) ? -1 : 0))
      }
    }
    
    if (this.searchTextInput != null) {
      lstProjectsFilterting = lstProjectsFilterting.filter(m => m.projectName.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1
        || m.projectNumber.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1
        || m.siteLocation.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1);
    }

    this.lstFilteredProjects = lstProjectsFilterting;
        
  }

  ViewClaims(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);

    if (applItem.openProject === true) {
      this.dFAProjectMainDataService.setViewOrEdit('view');
    } else if (applItem.openProject === false) {
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-project/' + applItem.projectId + '/claims']);
  }

  ViewProject(applItem: ProjectExtended): void {
    this.dFAProjectMainDataService.setProjectId(applItem.projectId);
    //this.dFAProjectMainDataService.setApplicationId(applItem.applicationId);
    
    //if (applItem.primaryApplicantSignedDate == null && applItem.currentApplication != false) {
    //  this.dfaApplicationMainDataService.setViewOrEdit('update');
    //}
    //else
    if (applItem.openProject === true) {
      if (applItem.status.toLowerCase() == 'draft') {
        this.dFAProjectMainDataService.setViewOrEdit('updateproject');
      } else {
        this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
      }
    } else if (applItem.openProject === false) {
      this.dFAProjectMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-project-view/'+applItem.projectId]);
  }

}

export interface ProjectExtended extends CurrentProject {
  openProject: boolean;
}

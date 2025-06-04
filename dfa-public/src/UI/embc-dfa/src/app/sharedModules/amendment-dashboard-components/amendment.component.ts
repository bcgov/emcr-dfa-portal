import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardComponent } from '../../feature-components/dashboard/dashboard.component';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../core/api/services/application.service';
import { ProjectService } from '../../core/api/services/project.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { CurrentApplication, CurrentProjectAmendment, CurrentProject } from 'src/app/core/api/models';
import { DFAProjectMainDataService } from '../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { Decision } from 'src/app/models/decision.enum';
import { DFAAmendmentMainDataService } from 'src/app/feature-components/dfa-amendment-main/dfa-amendment-main-data.service';

@Component({
  selector: 'app-dfadashboard-amendment',
  templateUrl: './amendment.component.html',
  styleUrls: ['./amendment.component.scss']
})

export class DfaDashAmendmentComponent implements OnInit {

  DecisionEnum = Decision;

  addNewItem(value: number) {
    this.appSessionService.currentProjectsCount.emit(value);
  }

  items = [
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Created", stage: "", statusColor: "#639DD4", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
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
  lstAmendments: AmendmentExtended[] = [];
  lstFilteredAmendments: AmendmentExtended[] = [];
  matchStatusFound = false;
  isLinear = true;
  current = 1;
  appId = null;
  public apptype: string;
  public isLoading: boolean = true;
  public color: string = "'#169BD5";
  public searchTextInput: string = '';
  public stageSelected: string = '';
  public sortfieldSelected: string = '';
  public filterbydaysSelected: number;
  OneDayAgo: number = 0;

  constructor(
    private profileDataService: ProfileDataService,
    private appService: Service,
    private projService: ProjectService,
    private appSessionService: AppSessionService,
    private router: Router,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dFAProjectMainDataService: DFAProjectMainDataService,
    private dfaAmendmentMainDataService: DFAAmendmentMainDataService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.apptype = this.route.snapshot.data["apptype"];
    this.OneDayAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 1)).getTime()
  }

  ngOnInit(): void {
    //var applicationId = '0b9eec99-1a34-ef11-b850-00505683fbf4'; //this.dFAProjectMainDataService.getApplicationId();
    let projectId = this.dFAProjectMainDataService.getProjectId();

    if (projectId) {
      this.dFAProjectMainDataService.setProjectId(projectId);
    }

    this.projService.projectGetDfaProjectAmendments({ projectId: projectId }).subscribe({
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
                  this.dfaAmendmentMainDataService.setStage(objApp.stage);
                }

                if (objApp.amendmentDecision) {
                  this.dfaAmendmentMainDataService.setAmendmentDecision(objApp.amendmentDecision);
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
    this.lstAmendments = res;
    //dfa decision made
    this.lstAmendments.forEach(x => {
      if (
        (x.status.toLowerCase() === "decision made"
          || x.status.toLowerCase() === "closed" || x.status.toLowerCase() === "closed: withdrawn")
        //&&
        //(x.date && (this.OneDayAgo >= new Date(x.dateFileClosed).getTime()))
        )
      {
        x.openAmendment = false;
      } else x.openAmendment = true;
      //x.openAmendment = true;
    })

    if (this.apptype === "open") {
      this.lstAmendments = this.lstAmendments
        .filter(x => x.openAmendment === true);
      this.appSessionService.currentProjectsCount?.emit(this.lstAmendments.length);
    } else {
      this.lstAmendments = this.lstAmendments
        .filter(x => x.openAmendment === false);
      this.appSessionService.pastProjectsCount?.emit(this.lstAmendments.length);
    }

    this.lstFilteredAmendments = this.lstAmendments;
  }

  ApplyFilter(type: number, searchText: string): void {
    var lstAmendmentsFiltering = this.lstAmendments;

    if (searchText != null){
      this.searchTextInput = searchText;
    }

    if (this.stageSelected != '' && this.stageSelected != null) {

      if (this.stageSelected == 'All') {
        lstAmendmentsFiltering = lstAmendmentsFiltering;
      }
      else if (this.stageSelected == 'Approved') {
        lstAmendmentsFiltering = lstAmendmentsFiltering.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() == 'approved');
      } else if (this.stageSelected == 'Closed') {
        lstAmendmentsFiltering = lstAmendmentsFiltering.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() != 'approved');
      }
      else {
        lstAmendmentsFiltering = lstAmendmentsFiltering.filter(m => m.status.toLowerCase().indexOf(this.stageSelected.toLowerCase()) > -1);
      }
    }

    if (this.filterbydaysSelected && this.filterbydaysSelected != -1) {
      var backdate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * this.filterbydaysSelected));
      lstAmendmentsFiltering = lstAmendmentsFiltering.filter(m => (backdate <= new Date(m.amendmentReceivedDate)));
    }

    if (this.sortfieldSelected != '' && this.sortfieldSelected != null) {
      if (this.sortfieldSelected == 'amendmentnumber') {
        lstAmendmentsFiltering = lstAmendmentsFiltering.sort((a, b) => (a.amendmentNumber > b.amendmentNumber) ? 1 : ((b.amendmentNumber > a.amendmentNumber) ? -1 : 0))
      } else if (this.sortfieldSelected == 'submitteddate') {
        lstAmendmentsFiltering = lstAmendmentsFiltering.sort((a, b) => (a.amendmentReceivedDate > b.amendmentReceivedDate) ? 1 : ((b.amendmentReceivedDate > a.amendmentReceivedDate) ? -1 : 0))
      } else if (this.sortfieldSelected == 'decisiondate') {
        lstAmendmentsFiltering = lstAmendmentsFiltering.sort((a, b) => (new Date(a.amendmentApprovedDate) > new Date(b.amendmentApprovedDate)) ? 1 : (new Date(b.amendmentApprovedDate) > new Date(a.amendmentApprovedDate) ? -1 : 0))
      }
    }

    if (this.searchTextInput != null) {
      lstAmendmentsFiltering = lstAmendmentsFiltering.filter(m => m.amendmentNumber.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1);
    }

    this.lstFilteredAmendments = lstAmendmentsFiltering;

  }

  ViewAmendment(applItem: AmendmentExtended): void {
    this.dfaAmendmentMainDataService.setProjectId(this.dFAProjectMainDataService.getProjectId());
    this.dfaAmendmentMainDataService.setAmendmentId(applItem.amendmentId);
    /* EMCRI-478: Set the Amendment Decision so it's available to the Amendment Details page. */
    this.dfaAmendmentMainDataService.setAmendmentDecision(applItem.amendmentDecision);

    if (applItem.openAmendment === true) {
      this.dfaAmendmentMainDataService.setViewOrEdit('view');
    } else if (applItem.openAmendment === false) {
      this.dfaAmendmentMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-amendment-main/' + applItem.amendmentId]);
  }

}

export interface AmendmentExtended extends CurrentProjectAmendment {
  openAmendment: boolean;
}

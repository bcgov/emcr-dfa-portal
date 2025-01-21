import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardComponent } from '../../../feature-components/dashboard/dashboard.component';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { ProjectService } from '../../../core/api/services/project.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { CurrentApplication, CurrentClaim, CurrentProject } from 'src/app/core/api/models';
import { DFAProjectMainDataService } from '../../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAClaimMainDataService } from '../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { ClaimService } from '../../../core/api/services';
import { Decision } from 'src/app/models/decision.enum';

@Component({
  selector: 'app-dfadashboard-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})

export class DfaDashClaimComponent implements OnInit {

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
  lstClaims: ClaimExtended[] = [];
  lstFilteredClaims: ClaimExtended[] = [];
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
    private claimService: ClaimService,
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
    //var applicationId = '0b9eec99-1a34-ef11-b850-00505683fbf4'; //this.dFAProjectMainDataService.getApplicationId();
    let projectId = this.dFAProjectMainDataService.getProjectId();

    if (projectId) {
      this.dfaClaimMainDataService.setProjectId(projectId);
    }

    this.claimService.claimGetDfaClaims({ projectId: projectId }).subscribe({
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
                  this.dfaClaimMainDataService.setStage(objApp.stage);
                }

                if (objApp.claimDecision) {
                  this.dfaClaimMainDataService.setClaimDecision(objApp.claimDecision);
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
    this.lstClaims = res;
    //dfa decision made
    this.lstClaims.forEach(x => {
      if (
        (x.status.toLowerCase() === "decision made"
          || x.status.toLowerCase() === "closed" || x.status.toLowerCase() === "closed: withdrawn")
        &&
        (x.dateFileClosed && (this.OneDayAgo >= new Date(x.dateFileClosed).getTime()))
        )
      {
        x.openClaim = false;
      } else x.openClaim = true;
      //x.openClaim = true;
    })
    
    if (this.apptype === "open") {
      this.lstClaims = this.lstClaims
        .filter(x => x.openClaim === true);
      this.appSessionService.currentProjectsCount?.emit(this.lstClaims.length);
    } else {
      this.lstClaims = this.lstClaims
        .filter(x => x.openClaim === false);
      this.appSessionService.pastProjectsCount?.emit(this.lstClaims.length);
    }

    this.lstFilteredClaims = this.lstClaims;
  }

  ApplyFilter(type: number, searchText: string): void {
    var lstClaimsFilterting = this.lstClaims;

    if (searchText != null){
      this.searchTextInput = searchText;
    }

    if (this.stageSelected != '' && this.stageSelected != null) {

      if (this.stageSelected == 'All') {
        lstClaimsFilterting = lstClaimsFilterting;
      }
      else if (this.stageSelected == 'Approved') {
        lstClaimsFilterting = lstClaimsFilterting.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() == 'approved');
      } else if (this.stageSelected == 'Closed') {
        lstClaimsFilterting = lstClaimsFilterting.filter(m => m.status.toLowerCase() == 'decision made' && m.stage.toLowerCase() != 'approved');
      }
      else {
        lstClaimsFilterting = lstClaimsFilterting.filter(m => m.status.toLowerCase().indexOf(this.stageSelected.toLowerCase()) > -1);
      }
    }

    if (this.filterbydaysSelected && this.filterbydaysSelected != -1) {
      var backdate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * this.filterbydaysSelected));
      lstClaimsFilterting = lstClaimsFilterting.filter(m => (backdate <= new Date(m.createdDate)));
    }

    if (this.sortfieldSelected != '' && this.sortfieldSelected != null) {
      if (this.sortfieldSelected == 'claimnumber') {
        lstClaimsFilterting = lstClaimsFilterting.sort((a, b) => (a.claimNumber > b.claimNumber) ? 1 : ((b.claimNumber > a.claimNumber) ? -1 : 0))
      } else if (this.sortfieldSelected == 'submitteddate') {
        lstClaimsFilterting = lstClaimsFilterting.sort((a, b) => (a.createdDate > b.createdDate) ? 1 : ((b.createdDate > a.createdDate) ? -1 : 0))
      } else if (this.sortfieldSelected == 'claimpaiddate') {
        lstClaimsFilterting = lstClaimsFilterting.sort((a, b) => (new Date(a.paidClaimDate) > new Date(b.paidClaimDate)) ? 1 : (new Date(b.paidClaimDate) > new Date(a.paidClaimDate) ? -1 : 0))
      }
    }
    
    if (this.searchTextInput != null) {
      lstClaimsFilterting = lstClaimsFilterting.filter(m => m.claimNumber.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1);
        //|| m.claimNumber.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1
        //|| m.siteLocation.toLowerCase().indexOf(this.searchTextInput.toLowerCase()) > -1);
    }

    this.lstFilteredClaims = lstClaimsFilterting;
        
  }

  ViewClaim(applItem: ClaimExtended): void {
    this.dfaClaimMainDataService.setProjectId(this.dFAProjectMainDataService.getProjectId());
    this.dfaClaimMainDataService.setClaimId(applItem.claimId);
    /* EMCRI-478: Set the Claim Decision so it's available to the Claim Details page. */
    this.dfaClaimMainDataService.setClaimDecision(applItem.claimDecision);

    if (applItem.openClaim === true) {
      this.dfaClaimMainDataService.setViewOrEdit('view');
    } else if (applItem.openClaim === false) {
      this.dfaClaimMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-claim-main/' + applItem.claimId]);
  }

  ResumeClaimSubmission(applItem: ClaimExtended): void {
    this.dfaClaimMainDataService.setProjectId(this.dFAProjectMainDataService.getProjectId());
    this.dfaClaimMainDataService.setClaimId(applItem.claimId);

    this.dfaClaimMainDataService.setViewOrEdit('addclaim');

    this.router.navigate(['/dfa-claim-main/' + applItem.claimId]);
  }
  

}

export interface ClaimExtended extends CurrentClaim {
  openClaim: boolean;
}

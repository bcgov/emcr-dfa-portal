import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, distinctUntilChanged, mapTo } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { AlertService } from 'src/app/core/services/alert.service';
//import { DFAProjectService } from './dfa-project.service';
import { ApplicantOption, CurrentApplication, FarmOption, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DashTabModel } from '../dashboard/dashboard.component';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';
//import { DFAProjectMappingService } from './dfa-project-mapping.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { ProjectService } from 'src/app/core/api/services';
import { ApplicationExtended } from '../../sharedModules/dashboard-components/dfa-application/dfa-application.component';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18
import moment from 'moment';
import { DFAClaimMainDataService } from '../dfa-claim-main/dfa-claim-main-data.service';
import { DFAConfirmClaimCreateDialogComponent } from '../../core/components/dialog-components/dfa-confirm-claim-create-dialog/dfa-confirm-claim-create-dialog.component';
import { DFAClaimMainService } from '../dfa-claim-main/dfa-claim-main.service';

@Component({
  selector: 'app-dfa-claim-dashboard',
  templateUrl: './dfa-claim-dashboard.component.html',
  styleUrls: ['./dfa-claim-dashboard.component.scss']
})
export class DFAClaimComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  tabs: DashTabModel[];
  currentProjectsCount = 0;
  closedProjectsCount = 0;
  isLoading = false;
  applicationNumber = '';
  appId = null;
  projId = null;
  caseNumber = '';
  causeOfDamage = '';
  dateOfDamageFrom = '';
  dateOfDamageTo = '';
  eligibleGST = false;

  projNumber = '';
  projName = '';
  siteLocation = '';
  deadline18Months = '';
  deadline18MonthsText = '';

  businessName = "";


  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private dfaClaimMainService: DFAClaimMainService,
    private appSessionService: AppSessionService,
    private projService: ProjectService,
    private applicationService: ApplicationService,
  ) {
    

  }

  ngOnInit(): void {
    this.businessName = this.dfaApplicationMainDataService.getBusiness();
    this.projId = this.route.snapshot.paramMap.get('id');
    this.applicationNumber = 'Application';
    this.appId = this.dfaApplicationMainDataService.getApplicationId();
    this.getApplicationDetials(this.appId);
    this.getProjectDetials(this.projId);
    this.dfaProjectMainDataService.setApplicationId(this.appId);
    this.dfaProjectMainDataService.setProjectId(this.projId);

    this.appSessionService.currentProjectsCount.subscribe((n: number) => {
      this.currentProjectsCount = n;
      this.tabs[0].count = n ? n.toString() : "0";
    });
    //this.appSessionService.currentProjectsCount.subscribe((n: number) => {
    //  this.closedProjectsCount = n;
    //  this.tabs[2].count = n ? n.toString() : "0";
    //});

    //this.projService.projectGetDfaProjects({ applicationId: this.appId }).subscribe({
    //  next: (lstData) => {
    //    if (lstData != null) {
    //      //this.countAppData(lstData);
    //      //this.tabs[0].count = this.currentProjectsCount.toString();
    //      //this.tabs[1].count = this.closedProjectsCount.toString();
    //    }
    //  },
    //  error: (error) => {
    //  }
    //});

    this.tabs = [
      {
        label: 'Open Claims',
        route: 'open',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.currentProjectsCount.toString()
      },
      {
        label: 'Closed Claims',
        route: 'close',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.closedProjectsCount.toString()
      }
    ];

  }

  navigateToDFAProjectCreate(): void {
    this.dfaProjectMainDataService.setProjectId(null);
    this.dfaProjectMainDataService.setViewOrEdit('addproject');
    this.router.navigate(['/dfa-project-main']);
  }

  navigateToDFAClaimCreate(): void {
    this.confirmCreateClaim();
    
  }

  confirmCreateClaim(): void {
    var contentDialog = globalConst.confirmCreateClaimBody;

    this.dialog
      .open(DFAConfirmClaimCreateDialogComponent, {
        data: {
          content: contentDialog
        },
        height: '320px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          //this.dfaApplicationMainMapping.mapDFAApplicationMain(application);
          //this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          this.dfaClaimMainDataService.setProjectId(this.projId);
          this.dfaClaimMainDataService.setApplicationId(this.appId);
          this.dfaClaimMainDataService.setClaimId(null);
          this.dfaClaimMainDataService.recoveryClaim = null;
          this.formCreationService.clearRecoveryClaimData();
          let objClaimDTO = this.dfaClaimMainDataService.createDFAClaimMainDTO();

          this.dfaClaimMainService.upsertClaim(objClaimDTO).subscribe(id => {
            if (id) {
              this.dfaClaimMainDataService.setEligibleGST(this.eligibleGST);
              this.dfaClaimMainDataService.setViewOrEdit('addclaim');

              this.dfaClaimMainDataService.setClaimId(id);
              this.router.navigate(['/dfa-claim-main/' + id]);
            }
          },
            error => {
              console.error(error);
              //document.location.href = 'https://dfa.gov.bc.ca/error.html';
            });
        }
      });
  }

  countAppData(lstApp: Object): void {
    var res = JSON.parse(JSON.stringify(lstApp));
    let lstProjects = res;
    this.currentProjectsCount = 0; this.closedProjectsCount = 0;
    lstProjects.forEach(x => {
      if (
        (x.status.toLowerCase() === "decision made"
          || x.status.toLowerCase() === "closed: inactive" || x.status.toLowerCase() === "closed: withdrawn")
        //&&
        //(x.dateFileClosed && (this.sixtyOneDaysAgo <= new Date(x.dateFileClosed).getTime()))
      ) {
        this.closedProjectsCount++;
      } else this.currentProjectsCount++;
    })
  }

  getApplicationDetials(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          if (dfaApplicationMain) {
            this.eligibleGST = dfaApplicationMain.eligibleGST;
            this.dfaClaimMainDataService.setEligibleGST(this.eligibleGST);
            this.dateOfDamageFrom = dfaApplicationMain.dateOfDamage;
            this.dateOfDamageTo = dfaApplicationMain.dateOfDamageTo;
            this.caseNumber = dfaApplicationMain.caseNumber ? dfaApplicationMain.caseNumber : "Not Generated";
            this.causeOfDamage = this.CombineCauseOfDamages(dfaApplicationMain);
          }

        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  diffMonths(d: string) {
    //var daysDiff = Math.ceil((Math.abs(date1 - d)) / (1000 * 60 * 60 * 24));

    //var years = Math.floor(daysDiff / 365.25);
    //var remainingDays = Math.floor(daysDiff - (years * 365.25));
    //var months = Math.floor((remainingDays / 365.25) * 12);
    //var days = Math.ceil(daysDiff - (years * 365.25 + (months / 12 * 365.25)));

    //return {
    //  daysAll: daysDiff,
    //  years: years,
    //  months: months,
    //  days: days
    //}
  }

  getProjectDetials(projectId: string) {
    if (projectId) {
      this.projService.projectGetProjectDetailsForClaim({ projectId: projectId }).subscribe({
        next: (dfaProject) => {
          if (dfaProject) {
            dfaProject.deadline18Month = '09/22/2024';

            let endDate = moment(new Date(dfaProject.deadline18Month)); // yyyy-MM-dd
            let startDate = moment(); // yyyy-MM-dd
            
            //let Years = newDate.diff(date, 'years');
            let months = endDate.diff(startDate, 'months');

            startDate = startDate.add(months, 'months');
            let days = endDate.diff(startDate, 'days');

            //let daysInMonth = new Date(dfaProject.deadline18Month).getDate();
            //let months = this.diffMonths(dfaProject.deadline18Month);
            this.projName = dfaProject.projectName;
            this.projNumber = dfaProject.projectNumber;
            this.deadline18Months = dfaProject.deadline18Month != 'Date Not Set' ? dfaProject.deadline18Month : "Date Not Set";
            this.deadline18MonthsText = dfaProject.deadline18Month != 'Date Not Set' ? "(" + months + " month(s) " + days + " day(s) remaining)" : "";
            this.siteLocation = dfaProject.siteLocation;
          }

        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  CombineCauseOfDamages(applItem: CurrentApplication): string {
    var causeofdamages = applItem.floodDamage == true ? "Flood, " : "";
    causeofdamages += applItem.landslideDamage == true ? "Landslide, " : "";
    causeofdamages += applItem.stormDamage == true ? "Storm, " : "";
    causeofdamages += applItem.wildfireDamage == true ? "Wildfire, " : "";
    causeofdamages += applItem.otherDamageText != null ? applItem.otherDamageText : "";
    causeofdamages = causeofdamages.trim();

    var lastChar = causeofdamages.slice(-1);
    if (lastChar == ',') {
      causeofdamages = causeofdamages.slice(0, -1);
    }

    return causeofdamages;
  }

  ViewApplication(appId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(appId);
    this.dfaApplicationMainDataService.setViewOrEdit('view');

    this.router.navigate(['/dfa-application-main/' + appId]);
  }

  ViewProject(projId: string): void {
    this.dfaProjectMainDataService.setProjectId(projId);
    this.dfaProjectMainDataService.setViewOrEdit('view');

    this.router.navigate(['/dfa-project-main/' + projId]);
  }

  BackToDashboard() {
    this.dfaApplicationMainDataService.setApplicationId(null);
    this.router.navigate(['/verified-registration/dashboard']);
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    
  }

}

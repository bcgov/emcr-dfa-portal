import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as globalConst from '../../core/services/globalConstants';
import { FormCreationService } from '../../core/services/formCreation.service';
//import { DFAProjectService } from './dfa-project.service';
import { CurrentApplication, ProjectStageOptionSet } from 'src/app/core/api/models';
import { ApplicationService} from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DashTabModel } from '../dashboard/dashboard.component';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAAmendmentMainDataService } from '../dfa-amendment-main/dfa-amendment-main-data.service';
import { DFAAmendmentMainService } from '../dfa-amendment-main/dfa-amendment-main.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { ProjectService } from 'src/app/core/api/services';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18
import moment from 'moment';
import { DFAConfirmAmendmentCreateDialogComponent } from '../../core/components/dialog-components/dfa-confirm-amendment-create-dialog/dfa-confirm-amendment-create-dialog.component';

@Component({
  selector: 'app-dfa-amendment-dashboard',
  templateUrl: './dfa-amendment-dashboard.component.html',
  styleUrls: ['./dfa-amendment-dashboard.component.scss']
})
export class DFAAmendmentComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  tabs: DashTabModel[];
  openAmendmentsCount = 0;
  closedAmendmentsCount = 0;
  isLoading = false;
  applicationNumber = '';
  appId = null;
  projId = null;
  caseNumber = '';
  causeOfDamage = '';
  dateOfDamageFrom = '';
  dateOfDamageTo = '';
  eligibleGST = false;
  OneDayAgo: number = 0;
  projNumber = '';
  projName = '';
  siteLocation = '';
  deadline18Months = '';
  deadline18MonthsText = '';
  projectType = '';
  projectApprovedDate = '';
  originalApprovedProjectCost = '';
  amendedApprovedProjectCost = '';
  businessName = "";
  showCreateButton = false;
  projectStatus: ProjectStageOptionSet;


  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaAmendmentMainDataService: DFAAmendmentMainDataService,
    private dfaAmendmentMainService: DFAAmendmentMainService,
    private appSessionService: AppSessionService,
    private projService: ProjectService,
    private applicationService: ApplicationService,
  ) {
    
    this.OneDayAgo = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 1)).getTime()
  }

  ngOnInit(): void {
    this.businessName = this.dfaApplicationMainDataService.getBusiness();
    this.projId = this.route.snapshot.paramMap.get('id');
    this.applicationNumber = 'Application';
    this.appId = this.dfaApplicationMainDataService.getApplicationId();
    this.getApplicationDetails(this.appId);
    this.getProjectDetails(this.projId);
    this.dfaProjectMainDataService.setApplicationId(this.appId);
    this.dfaProjectMainDataService.setProjectId(this.projId);

    this.appSessionService.openAmendmentsCount.subscribe((n: number) => {
      this.openAmendmentsCount = n;
      this.tabs[0].count = n ? n.toString() : "0";
    });
    this.appSessionService.closedAmendmentsCount.subscribe((n: number) => {
      this.closedAmendmentsCount = n;
      this.tabs[1].count = n ? n.toString() : "0";
    });

    this.projService.projectGetDfaProjectAmendments({ projectId: this.projId }).subscribe({
      next: (lstData) => {
        if (lstData != null) {
          this.countAppData(lstData);
          this.tabs[0].count = this.openAmendmentsCount.toString();
          this.tabs[1].count = this.closedAmendmentsCount.toString();
        }
      },
      error: (error) => {
      }
    });
    
    this.tabs = [
      {
        label: 'Open Amendments',
        route: 'open',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.openAmendmentsCount.toString()
      },
      {
        label: 'Closed Amendments',
        route: 'close',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.closedAmendmentsCount.toString()
      }
    ];

    if(this.openAmendmentsCount < 1 &&
      this.projectStatus == ProjectStageOptionSet.DecisionMade)
    {
      this.showCreateButton = true;
    }
  }

  navigateToDFAProjectCreate(): void {
    this.dfaProjectMainDataService.setProjectId(null);
    this.dfaProjectMainDataService.setViewOrEdit('addproject');
    this.router.navigate(['/dfa-project-main']);
  }

  navigateToDFAAmendmentCreate(): void {
    this.confirmCreateAmendment();
    
  }

  confirmCreateAmendment(): void {
    var contentDialog = globalConst.confirmCreateAmendmentBody;

    this.dialog
      .open(DFAConfirmAmendmentCreateDialogComponent, {
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
          
          this.dfaProjectMainDataService.setProjectId(this.projId);
          this.dfaProjectMainDataService.setApplicationId(this.appId);
          this.dfaProjectMainDataService.setAmendmentId(null);
          this.dfaAmendmentMainDataService.amendment = null;
          this.formCreationService.clearProjectAmendmentData();
          let objAmendmentDTO = this.dfaAmendmentMainDataService.createDFAAmendmentMainDTO();
          
          this.dfaAmendmentMainService.upsertAmendment(objAmendmentDTO).subscribe(id => {
            if (id) {
              this.dfaProjectMainDataService.setViewOrEdit('addamendment');

              this.dfaProjectMainDataService.setAmendmentId(id);
              this.router.navigate(['/dfa-amendment-main/' + id]);
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
    this.openAmendmentsCount = 0; this.closedAmendmentsCount = 0;
    lstProjects.forEach(x => {
      if (
        (x.status.toLowerCase() === "decision made"
          || x.status.toLowerCase() === "closed" || x.status.toLowerCase() === "closed: withdrawn")
        &&
        (x.dateFileClosed && (this.OneDayAgo >= new Date(x.dateFileClosed).getTime()))
      ) {
        this.closedAmendmentsCount++;
      } else this.openAmendmentsCount++;
    })
  }

  getApplicationDetails(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          if (dfaApplicationMain) {
            this.eligibleGST = dfaApplicationMain.eligibleGST;
            //this.dfaProjectMainDataService.setEligibleGST(this.eligibleGST);
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

  getProjectDetails(projectId: string) {
    if (projectId) {
      this.projService.projectGetProjectMain({ projectId: projectId }).subscribe({
        next: (dfaProject) => {
          if (dfaProject) {
            var project = dfaProject.project;
            //dfaProject.deadline18Month = '09/22/2024';

            let endDate = moment(new Date(project.project18MonthDeadline)); // yyyy-MM-dd
            let startDate = moment(); // yyyy-MM-dd
            
            //let Years = newDate.diff(date, 'years');
            let months = endDate.diff(startDate, 'months');

            startDate = startDate.add(months, 'months');
            let days = endDate.diff(startDate, 'days');

            //let daysInMonth = new Date(dfaProject.deadline18Month).getDate();
            //let months = this.diffMonths(dfaProject.deadline18Month);
            this.projName = project.projectName;
            this.projNumber = project.projectNumber;
            this.deadline18Months = project.project18MonthDeadline != 'Date Not Set' ? project.project18MonthDeadline : "Date Not Set";
            this.deadline18MonthsText = project.project18MonthDeadline != 'Date Not Set' ? "(" + months + " month(s) " + days + " day(s) remaining)" : "";
            this.siteLocation = project.siteLocation;
            this.projectType = project.projectType;
            this.projectApprovedDate = project.projectApprovedDate;
            this.originalApprovedProjectCost = project.approvedCost != null ? project.approvedCost.toString() : "0.00";
            this.amendedApprovedProjectCost = project.approvedAmendedProjectCost != null ? project.approvedAmendedProjectCost.toString() : "0.00";

            this.projectStatus = project.projectStatus
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

    this.router.navigate(['/dfa-project-view/' + projId]);
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

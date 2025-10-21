import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentApplication } from 'src/app/core/api/models';
import { ApplicationService, ProjectService } from 'src/app/core/api/services';
import { ApplicationStatus } from 'src/app/core/model/dfa-appeals-main.model';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAConfirmProjectCreateDialogComponent } from '../../core/components/dialog-components/dfa-confirm-project-create-dialog/dfa-confirm-project-create-dialog.component';
import { FormCreationService } from '../../core/services/formCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import { DashTabModel } from '../dashboard/dashboard.component';
import { DFAProjectMainService } from '../dfa-project-main/dfa-project-main.service';

@Component({
  selector: 'app-dfa-project-dashboard',
  standalone: false,
  templateUrl: './dfa-project-dashboard.component.html',
  styleUrls: ['./dfa-project-dashboard.component.scss']
})
export class DFAProjectComponent implements OnInit, AfterViewInit, AfterViewChecked {
  tabs: DashTabModel[];
  currentProjectsCount = 0;
  closedProjectsCount = 0;
  isLoading = false;
  applicationNumber = '';
  appId = null;
  application: CurrentApplication;
  caseNumber = '';
  causeOfDamage = '';
  dateOfDamageFrom = '';
  dateOfDamageTo = '';
  OneDayAgo: number = 0;

  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
    private appSessionService: AppSessionService,
    private projService: ProjectService,
    private applicationService: ApplicationService,
    private dfaProjectMainService: DFAProjectMainService,
    private _snackBar: MatSnackBar
  ) {
    this.OneDayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1).getTime();
  }

  ngOnInit(): void {
    this.appId = this.route.snapshot.paramMap.get('id');
    this.applicationNumber = 'Application';
    this.getApplicationDetials(this.appId);
    this.dfaProjectMainDataService.setApplicationId(this.appId);

    this.appSessionService.currentApplicationsCount.subscribe((n: number) => {
      this.currentProjectsCount = n;
      this.tabs[0].count = n ? n.toString() : '0';
    });
    this.appSessionService.pastApplicationsCount.subscribe((n: number) => {
      this.closedProjectsCount = n;
      this.tabs[2].count = n ? n.toString() : '0';
    });

    this.projService.projectGetDfaProjects({ applicationId: this.appId }).subscribe({
      next: (lstData) => {
        if (lstData != null) {
          this.countAppData(lstData);
          this.tabs[0].count = this.currentProjectsCount.toString();
          this.tabs[1].count = this.closedProjectsCount.toString();
        }
      },
      error: () => {}
    });

    this.tabs = [
      {
        label: 'Open Projects',
        route: 'open',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.currentProjectsCount.toString()
      },
      {
        label: 'Closed Projects',
        route: 'past',
        activeImage: '/assets/images/past-evac-active.svg',
        inactiveImage: '/assets/images/past-evac.svg',
        count: this.closedProjectsCount.toString()
      }
    ];
  }

   /**
    * Whether or not the user can create a new Project under this Application.
    *
    * @return {*}  {boolean}
    */
   canCreateProject(): boolean {
    if (!this.application) {
      return false;
    }

    return [ApplicationStatus.CaseCreated, ApplicationStatus.CaseInProgress].includes(
      this.application.status as ApplicationStatus
    );
  }

  /**
   * Create a new Project.
   */
  createProject(): void {
    var contentDialog = globalConst.confirmCreateProjectBody;

    this.dialog
      .open(DFAConfirmProjectCreateDialogComponent, {
        data: {
          content: contentDialog
        },
        height: '350px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.dfaProjectMainDataService.setApplicationId(this.appId);
          this.dfaProjectMainDataService.setProjectId(null);
          this.dfaProjectMainDataService.recoveryPlan = null;
          // this.dfaProjectMainDataService.recoveryPlan.projectStatus = ProjectStageOptionSet.DRAFT;
          let objClaimDTO = this.dfaProjectMainDataService.createDFAProjectMainDTO();

          this.dfaProjectMainService.upsertProject(objClaimDTO).subscribe(
            (id) => {
              if (id) {
                this.dfaProjectMainDataService.setProjectId(id);
                this.dfaProjectMainDataService.setViewOrEdit('addproject');
                this.router.navigate(['/dfa-project-main/' + id]);
              }
            },
            (error) => {
              console.error(error);
              //document.location.href = 'https://dfa.gov.bc.ca/error.html';
              this._snackBar.open(
                'Unable to Open DFAConfirmProjectCreateDialogComponent. Please try again later.',
                'Close',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                }
              );
            }
          );
        }
      });
  }

  countAppData(lstApp: Object): void {
    var res = JSON.parse(JSON.stringify(lstApp));
    let lstProjects = res;
    this.currentProjectsCount = 0;
    this.closedProjectsCount = 0;
    lstProjects.forEach((x) => {
      if (
        (x.status.toLowerCase() === 'closed' || x.status.toLowerCase() === 'closed: withdrawn') &&
        x.dateFileClosed &&
        this.OneDayAgo >= new Date(x.dateFileClosed).getTime()
      ) {
        this.closedProjectsCount++;
      } else this.currentProjectsCount++;
    });
  }

  getApplicationDetials(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          if (dfaApplicationMain) {
            this.application = dfaApplicationMain;
            this.dateOfDamageFrom = dfaApplicationMain.dateOfDamage;
            this.dateOfDamageTo = dfaApplicationMain.dateOfDamageTo;
            this.caseNumber = dfaApplicationMain.caseNumber ? dfaApplicationMain.caseNumber : 'Not Generated';
            this.causeOfDamage = this.CombineCauseOfDamages(dfaApplicationMain);
          }
        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
          this._snackBar.open('Unable to Get Application Details. Please try again later.', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  CombineCauseOfDamages(applItem: CurrentApplication): string {
    var causeofdamages = applItem.floodDamage == true ? 'Flood, ' : '';
    causeofdamages += applItem.landslideDamage == true ? 'Landslide, ' : '';
    causeofdamages += applItem.stormDamage == true ? 'Storm, ' : '';
    causeofdamages += applItem.wildfireDamage == true ? 'Wildfire, ' : '';
    causeofdamages += applItem.otherDamageText != null ? applItem.otherDamageText : '';
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

  BackToDashboard() {
    this.dfaApplicationMainDataService.setApplicationId(null);
    this.router.navigate(['/dfa-dashboard/current']);
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {}
}

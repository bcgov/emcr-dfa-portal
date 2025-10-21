import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentApplication, StatusBar } from 'src/app/core/api/models';
import { ApplicationStatus } from 'src/app/core/model/dfa-appeals-main.model';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';

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

  statusBarItems: StatusBar[] = [
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Draft',
      stage: '',
      statusColor: '#639DD4',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Submitted',
      stage: '',
      statusColor: '#FDCB52',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Reviewing Application',
      stage: '',
      statusColor: '#FDCB52',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Creating Case File',
      stage: '',
      statusColor: '#FDCB52',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Case Created',
      stage: '',
      statusColor: '#FDCB52',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Case In Progress',
      stage: '',
      statusColor: '#FDCB52',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    {
      status: 'Closed',
      stage: '',
      statusColor: '#62A370',
      isCompleted: false,
      currentStep: false,
      isFinalStep: true,
      isErrorInStatus: false
    },
    {
      status: '',
      stage: '',
      statusColor: '',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    }
  ];

  lstApplications: ApplicationExtended[] = [];
  matchStatusFound = false;
  isLinear = true;
  current = 1;
  public appType: string;
  private OneDayAgo: number;
  public isLoading: boolean = true;
  public color: string = "'#169BD5";

  constructor(
    private appService: Service,
    private appSessionService: AppSessionService,
    private router: Router,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.appType = this.route.snapshot.data['apptype'];
    this.OneDayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1).getTime();
  }

  ngOnInit(): void {
    this.appService.applicationGetDfaApplications().subscribe({
      next: (lstData) => {
        if (lstData != null) {
          const lstDataModified = [];
          const lstDataUnModified = [];
          const initialList = lstData;
          lstDataUnModified.push(initialList);
          lstData.forEach((objApp) => {
            let isFound = false;
            objApp.isErrorInStatus = false;
            // Deep copy via JSON.parse and JSON.stringify to avoid reference issues
            objApp.statusBar = JSON.parse(JSON.stringify(this.statusBarItems));
            objApp.statusBar.forEach((objStatItem) => {
              if (objApp.status != null && objStatItem.status.toLowerCase() == objApp.status.toLowerCase()) {
                objStatItem.currentStep = true;
                isFound = true;
                this.matchStatusFound = true;
                if (objApp.stage) {
                  objStatItem.stage = objApp.stage;
                }

                objApp.statusColor = objStatItem.statusColor;

                if (objApp.stage == 'Ineligible' || objApp.stage == 'Withdrwan') {
                  objApp.statusColor = '#E25E63';
                }

                if (objApp.status.toLowerCase().indexOf('draft') > -1) {
                  objApp.statusColor = '#639DD4';
                  objApp.status = 'Draft';
                }
              }

              if (isFound == false) {
                objStatItem.isCompleted = true;
              }

              if (objStatItem.isFinalStep == true) {
                if (isFound == false) {
                  objApp.isErrorInStatus = true;
                } else if (objStatItem.status.toLowerCase() == objApp.status.toLowerCase()) {
                  objStatItem.isCompleted = true;
                }
              }
            });

            lstDataModified.push(objApp);
          });

          this.mapData(lstDataModified);
        }
        // this.mapData(lstData);
        this.isLoading = false;
      },
      error: () => {
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
        this.isLoading = false;
        this._snackBar.open('Unable to Get DfaApplications. Please try again later.', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
    this.isLoading = false;
  }

  getItems(lst) {
    return lst.filter((item) => item.status !== '');
  }

  getStatusBarItems(lst) {
    return lst.filter((item) => item.status !== '');
  }

  mapData(lstApp: Object): void {
    const res = JSON.parse(JSON.stringify(lstApp));
    this.lstApplications = res;
    // dfa decision made
    this.lstApplications.forEach((x) => {
      if (
        (x.status.toLowerCase() === 'decision made' ||
          x.status.toLowerCase() === 'closed' ||
          x.status.toLowerCase() === 'closed: withdrawn') &&
        x.dateFileClosed &&
        this.OneDayAgo >= new Date(x.dateFileClosed).getTime()
      ) {
        x.currentApplication = false;
      } else x.currentApplication = true;
    });
    if (this.appType === 'current') {
      this.lstApplications = this.lstApplications.filter((x) => x.currentApplication === true);
      this.appSessionService.currentApplicationsCount?.emit(this.lstApplications.length);
    } else {
      this.lstApplications = this.lstApplications.filter((x) => x.currentApplication === false);
      this.appSessionService.pastApplicationsCount?.emit(this.lstApplications.length);
    }
  }

  CombineCauseOfDamages(applItem: ApplicationExtended): string {
    let causeofdamages = applItem.floodDamage == true ? 'Flood, ' : '';
    causeofdamages += applItem.landslideDamage == true ? 'Landslide, ' : '';
    causeofdamages += applItem.stormDamage == true ? 'Storm, ' : '';
    causeofdamages += applItem.wildfireDamage == true ? 'Wildfire, ' : '';
    causeofdamages += applItem.otherDamageText != null ? applItem.otherDamageText : '';
    causeofdamages = causeofdamages.trim();

    const lastChar = causeofdamages.slice(-1);
    if (lastChar == ',') {
      causeofdamages = causeofdamages.slice(0, -1);
    }

    return causeofdamages;
  }

  ViewApplication(applItem: ApplicationExtended): void {
    this.dfaApplicationMainDataService.setApplicationId(applItem.applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applItem.applicationId);

    if (applItem.currentApplication === true) {
      this.dfaApplicationMainDataService.setViewOrEdit('view');
    } else if (applItem.currentApplication === false) {
      this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-application-main/' + applItem.applicationId]);
  }

  CompleteApplication(applItem: ApplicationExtended): void {
    this.dfaApplicationMainDataService.setApplicationId(applItem.applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applItem.applicationId);

    this.dfaApplicationMainDataService.setViewOrEdit('edit');

    this.router.navigate(['/dfa-application-main/' + applItem.applicationId]);
  }

  /**
   * Whether or not the "Projects" page navigate button is visible.
   *
   * @param {ApplicationExtended} applItem
   * @return {*}  {boolean}
   */
  canViewProjects(applItem: ApplicationExtended): boolean {
    if (!applItem) {
      return false;
    }

    if (
      [ApplicationStatus.CaseCreated, ApplicationStatus.CaseInProgress, ApplicationStatus.Closed].includes(
        applItem.status as ApplicationStatus
      )
    ) {
      return true;
    }

    return false;
  }

  ViewProjects(applItem: ApplicationExtended): void {
    this.dfaApplicationMainDataService.setApplicationId(applItem.applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applItem.applicationId);

    if (applItem.currentApplication === true) {
      this.dfaApplicationMainDataService.setViewOrEdit('view');
    } else if (applItem.currentApplication === false) {
      this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-application/' + applItem.applicationId + '/projects']);
  }

  EditApplication(applicationId: string, tabId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applicationId);
    this.dfaApplicationMainDataService.setViewOrEdit('edit');
    this.dfaApplicationMainDataService.setEditStep(tabId);
    this.router.navigate(['/dfa-application-main/' + applicationId]);
  }
}

export interface ApplicationExtended extends CurrentApplication {
  currentApplication: boolean;
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseBpfVersionSet, CurrentApplication } from 'src/app/core/api/models';
import { CaseEligibility } from 'src/app/core/model/caseEligibilityEnum';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ApplicationService as Service } from '../../../core/api/services/application.service';
import { AppealConfirmationDialogComponent } from './appeal-confirmation-dialog/appeal-confirmation-dialog.component';
import { DocumentViewingDataService } from 'src/app/core/services/document-viewing-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// Temporary extension until the OpenAPI spec includes appealStatusBar
// ####################################################################
interface CurrentCaseWithAppeals extends CurrentApplication {
  appealEligibilityStatusBar?: AppealStatusItem[]; // Replace with actual type if available
  appealAmountStatusBar?: AppealStatusItem[];
  amountAppealPortalNote?: string;
  amountAppealStatusPortal?: string;
  amountAppealDecision?: string;
  eligibilityAppealPortalNote?: string;
  eligibilityAppealStatusPortal?: string;
  eligibilityAppealDecision?: string;
}

interface AppealStatusItem {
  label: string;
  statusColor?: string;
  currentStep?: boolean;
  stage?: string;
  isCompleted?: boolean;
  isFinalStep?: boolean;
  isDecision?: boolean;
}
// ####################################################################

@Component({
  selector: 'app-dfadashboard-application',
  standalone: false,
  templateUrl: './dfa-application.component.html',
  styleUrls: ['./dfa-application.component.scss']
})
export class DfaApplicationComponent implements OnInit {
  CaseElibilityEnum = CaseEligibility;
  CaseBpfVersionSet = CaseBpfVersionSet;

  addNewItem(value: number) {
    this.appSessionService.currentApplicationsCount.emit(value);
  }

  // NOTE if we ever consider refactoring the timelines, considering replacing the messy conditional logic with "state design pattern" or similar

  // New Application Time line for 4.0 Application
  newApplicationItems = [
    { label: '' },
    {
      label: 'Draft',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Submitted',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reviewing Application',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Checking Criteria',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Assessing Damage',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reviewing Damage Report',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Decision Made',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Case Closed',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },

  ];

  // application timeline items
  items = [
    { label: '' },
    {
      label: 'Draft Application',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Submitted Application',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reviewing Application',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Creating Case File',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Checking Criteria',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Assessing Damage',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reviewing Damage Report',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'DFA Making Decision',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'DFA Decision Made',
      isCompleted: false,
      currentStep: false,
      isFinalStep: true,
      isErrorInStatus: false
    },
    { label: '' }
  ];

  // eligibility appeal timeline items
  eligibilityAppealItems = [
    { label: '' },
    {
      label: 'Appeal Submitted',
      display: 'Appeal Submitted',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Appeal In Progress',
      display: 'Reviewing Appeal',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Appeal Decision',
      display: 'Appeal Decision',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isDecision: true
    },
    { label: '' },
    { label: '' },
    {
      label: 'Assigned To Evaluator',
      display: 'Assessing Damage',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Review Report',
      display: 'Reviewing Damage Report',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Creating Payment',
      display: 'Final Review',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Closed',
      display: 'Appeal Closed',
      isCompleted: false,
      currentStep: false,
      isFinalStep: true,
      isErrorInStatus: false
    },
    { label: '' }
  ];

  // amount appeal timeline items
  appealAmountItems = [
    { label: '' },
    {
      label: 'Appeal Submitted',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Appeal In Progress',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reassessing Damage',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Reviewing Appeal Report',
      isCompleted: false,
      currentStep: false,
      isFinalStep: false,
      isErrorInStatus: false
    },
    { label: '' },
    { label: '' },
    {
      label: 'Appeal Closed',
      isCompleted: false,
      currentStep: false,
      isFinalStep: true,
      isErrorInStatus: false
    },
    { label: '' }
  ];

  lstApplications: ApplicationExtended[] = [];
  matchStatusFound = false;
  isLinear = true;
  current = 1;
  public appType: string;
  private sixtyOneDaysAgo: number;
  public isLoading: boolean = true;
  public color: string = "'#169BD5";
  appealMatchStatusFound = false;
  private caseAmountAppealHasErrorInStatus = false;
  private caseEligibilityAppealHasErrorInStatus = false;

  constructor(
    private appService: Service,
    private appSessionService: AppSessionService,
    private router: Router,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dfaAppealDataService: DFAAppealDataService,
    private documentViewingDataService: DocumentViewingDataService,
    private _snackBar: MatSnackBar,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.appType = this.route.snapshot.data['apptype'];
    this.sixtyOneDaysAgo = new Date(
      new Date().getTime() - 1000 * 60 * 60 * 24 * 61
    ).getTime();
  }

  ngOnInit(): void {
    this.appService.applicationGetDfaApplications().subscribe({
      next: (lstData) => {
        if (lstData != null) {
          var lstDataModified = [];
          var lstDataUnModified = [];
          var initialList = lstData;
          lstDataUnModified.push(initialList);
          lstData.forEach((objApp, i) => {
            let isFound = true;
            var jsonVal = JSON.stringify(this.items);

            if (
              objApp.status &&
              objApp.status.toLowerCase().indexOf('appeal') > -1
            ) {
              jsonVal = JSON.stringify(this.items);
              objApp.hasAppealStages = true;
            }

            objApp.isErrorInStatus = false;
            objApp.statusBar = JSON.parse(jsonVal);
            objApp.statusBar.forEach((objStatItem) => {
              /* EMBCDFA-1327: Technically, this is a draft application, but it's set to closed because it connected to an expired event,
                 so we need to manually set it to the Draft Application status on the status bar. */
              if (
                objApp.status != null &&
                (objStatItem.label.toLowerCase() ==
                  objApp.status.toLowerCase() ||
                  (objStatItem.label.toLowerCase() === 'draft application' &&
                    objApp.status.toLowerCase() === 'closed: inactive'))
              ) {
                objStatItem.currentStep = true;
                isFound = true;
                this.matchStatusFound = true;
              }

              if (isFound == false) {
                objStatItem.isCompleted = true;
              }

              if (objStatItem.isFinalStep == true) {
                if (isFound == false) {
                  objApp.isErrorInStatus = true;
                } else if (
                  objStatItem.label.toLowerCase() == objApp.status.toLowerCase()
                ) {
                  objStatItem.isCompleted = true;
                }
              }
            });

            // Load new application timeline items
            if (objApp.getCaseBPFVersion === CaseBpfVersionSet.Four) {
              objApp.statusBar = JSON.parse(
                JSON.stringify(this.newApplicationItems)
              );
              objApp.statusBar.forEach((objStatItem) => {
                if (
                  objStatItem.label.toLowerCase() ===
                  objApp.status.toLowerCase()
                ) {
                  objStatItem.currentStep = true;
                  isFound = true;
                  this.matchStatusFound = true;
                }

                if (isFound == false) {
                  objStatItem.isCompleted = true;
                }

                if (objStatItem.isFinalStep == true) {
                  if (isFound == false) {
                    objApp.isErrorInStatus = true;
                  } else if (
                    objStatItem.label.toLowerCase() ==
                    objApp.status.toLowerCase()
                  ) {
                    objStatItem.isCompleted = true;
                  }
                }
              });
            }

            // Eligibility appeal steps
            const objAppWithAppeals = objApp as CurrentCaseWithAppeals;
            // Initialize appealStatusBar if it's missing
            if (!Array.isArray(objAppWithAppeals.appealEligibilityStatusBar)) {
              objAppWithAppeals.appealEligibilityStatusBar = JSON.parse(JSON.stringify(this.eligibilityAppealItems));
            }

            isFound = false;

            if (!objApp.eligibilityAppealPortalNote)
              objApp.eligibilityAppealPortalNote = "In Progress";


            if (objApp.caseEligibilityAppeal) objAppWithAppeals.appealEligibilityStatusBar.forEach((objStatItem) => {
              console.log("Error:", objApp.caseNumber, objApp.caseAmountAppeal)
              const statusMatch =
                objApp.caseEligibilityAppeal?.activeStage?.name &&
                objStatItem.label?.toLowerCase() === objApp.caseEligibilityAppeal.activeStage.name.toLowerCase();
              if (statusMatch) {
                if (!objApp.caseEligibilityAppeal?.completedOn) {
                  objStatItem.currentStep = true;
                }
                isFound = true;
                this.matchStatusFound = true;

                if (objApp.caseEligibilityAppeal?.activeStage?.name) {
                  objStatItem.stage = objApp.caseEligibilityAppeal.activeStage.name;
                }
              }

              // Fallback if status not matched
              if (!isFound) {
                objStatItem.isCompleted = true;
              } else {
                objStatItem.isDecision = false;
              }

              // Final step validation
               if (objStatItem.isFinalStep) {
                 if (!isFound) {
                   // NOTE commented out to avoid fixing a bug found, no side effects found except if the status was set incorrectly
                   this.caseEligibilityAppealHasErrorInStatus = true;
                 }
                 else if (statusMatch && objApp.caseEligibilityAppeal?.completedOn) {
                    objStatItem.isCompleted = true;
                 }
              }
            });

            // appeal amount timeline steps
            // Initialize appealStatusBar if it's missing
            if (!Array.isArray(objAppWithAppeals.appealAmountStatusBar)) {
              objAppWithAppeals.appealAmountStatusBar = JSON.parse(JSON.stringify(this.appealAmountItems));
            }

            isFound = false;

            if (!objApp.amountAppealPortalNote)
              objApp.amountAppealPortalNote = "In Progress";

            if (objApp.caseAmountAppeal) objAppWithAppeals.appealAmountStatusBar.forEach((objStatItem) => {
              const statusMatch =
                objApp.caseAmountAppeal?.activeStage?.name &&
                objStatItem.label?.toLowerCase() === objApp.caseAmountAppeal.activeStage.name.toLowerCase();

              if (statusMatch) {
                //if (!appealAmount?.casePaidAmountAppeal?.activeStage?.completedOn) {
                  objStatItem.currentStep = true;
                //}
                isFound = true;
                this.matchStatusFound = true;

                if (objApp.caseAmountAppeal?.activeStage?.name) {
                  objStatItem.stage = objApp.caseAmountAppeal.activeStage.name;

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
                   this.caseAmountAppealHasErrorInStatus = true;
                 }
                 else if (statusMatch && objApp.caseAmountAppeal?.completedOn) {
                    objStatItem.isCompleted = true;
                 }
               }
            });

            lstDataModified.push(objApp);
          });

          this.mapData(lstDataModified);
        }
        //this.mapData(lstData);
        this.isLoading = false;
      },
      error: (error) => {
       // document.location.href = 'https://dfa.gov.bc.ca/error.html';
        this.isLoading = false;
        this._snackBar.open(
          'Unable to get applications. Please try again later.',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    });
  }

  getItems(lst) {
    return lst.filter((item) => item.label !== '');
  }

  mapData(lstApp: Object): void {
    this.lstApplications = JSON.parse(JSON.stringify(lstApp));

    this.lstApplications.forEach((x) => {
      //EMCRI-298: Make it past application after appeal stage closing
      if (
        x.dateAppealClosed &&
        new Date(x.dateAppealClosed).getTime() <= this.sixtyOneDaysAgo
      ) {
        x.currentApplication = false;
      } else if (
        (x.status.toLowerCase() === 'dfa decision made' ||
          x.status.toLowerCase() === 'closed: inactive' ||
          x.status.toLowerCase() === 'closed: withdrawn') &&
        x.dateFileClosed &&
        new Date(x.dateFileClosed).getTime() <= this.sixtyOneDaysAgo
      ) {
        x.currentApplication = false;
      } else if (
      /* EMBCDFA-1327: Incomplete application with expired event */
        x.status.toLowerCase() === 'closed: inactive' &&
        x.dateFileClosed == null &&
        x.primaryApplicantSignedDate == null
      ) {
        x.currentApplication = false;
      } else {
        x.currentApplication = true;
      }
    });
    if (this.appType === 'current') {
      this.lstApplications = this.lstApplications.filter(
        (x) => x.currentApplication === true
      );
      this.appSessionService.currentApplicationsCount?.emit(
        this.lstApplications.length
      );
    } else {
      this.lstApplications = this.lstApplications.filter(
        (x) => x.currentApplication === false
      );
      this.appSessionService.pastApplicationsCount?.emit(
        this.lstApplications.length
      );
    }
  }

  ViewApplication(applItem: ApplicationExtended): void {
    this.dfaApplicationMainDataService.setApplicationId(applItem.applicationId);
    this.dfaApplicationStartDataService.setApplicationId(
      applItem.applicationId
    );

    if (
      applItem.primaryApplicantSignedDate == null &&
      applItem.currentApplication != false
    ) {
      this.dfaApplicationMainDataService.setViewOrEdit('update');
    } else if (applItem.currentApplication === true) {
      if (
        applItem.status.toLowerCase() === 'assessing damage' ||
        applItem.status.toLowerCase() === 'reviewing damage report' ||
        applItem.status.toLowerCase() === 'dfa making mecision' ||
        applItem.status.toLowerCase() === 'dfa decision made'
      ) {
        this.dfaApplicationMainDataService.setContactOnlyView('contactOnly');
        this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
      } else {
        this.dfaApplicationMainDataService.setViewOrEdit('view');
      }
    } else if (applItem.currentApplication === false) {
      this.dfaApplicationMainDataService.setViewOrEdit('viewOnly');
    }

    this.router.navigate(['/dfa-application-main/' + applItem.applicationId]);
  }

  EditApplication(applicationId: string, tabId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(applicationId);
    this.dfaApplicationStartDataService.setApplicationId(applicationId);
    this.dfaApplicationMainDataService.setViewOrEdit('edit');
    this.dfaApplicationMainDataService.setEditStep(tabId);
    this.router.navigate(['/dfa-application-main/' + applicationId]);
  }

  canAppeal(application: CurrentApplication): boolean {
    return (
      application.status &&
      (application.status.toLowerCase() === 'dfa decision made' ||
        application.status.toLowerCase() === 'closed: inactive' ||
        application.status.toLowerCase() === 'closed: withdrawn') &&
      this.remainingDays(application) > 0
    );
  }

  remainingDays(application: CurrentApplication): number {
    const dateFileClosed = new Date(application.dateFileClosed);
    const today = new Date();
    const appealPeriod = 60; // 60 days appeal period
    dateFileClosed.setDate(dateFileClosed.getDate() + appealPeriod);

    const diffTime = dateFileClosed.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  viewAppeals(applItem: ApplicationExtended, type: string): void {
    const caseId = applItem.caseId;

    if (!caseId || !type) {
      return;
    }

    this.dialog
      .open(AppealConfirmationDialogComponent, {
        data: {
          content: {
            ...applItem,
            caseId,
            type
          }
        },
        height: '600px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((appealId) => {
        if (!appealId) {
          return;
        }
        this.router.navigate([`/dfa-appeal/${appealId}/edit`], {
            queryParams: {
              applicationId: applItem.applicationId
            }
          });
      });
  }

  viewDocuments(applItem: any) {
    if (!applItem.caseId) {
      console.error('Cannot view documents: Case ID is missing');
      return;
    }

    // Store case details using DFA workspace service
    this.documentViewingDataService.setCaseDetails(applItem);

    this.router.navigate(['/case', applItem.caseId, 'documents']);
  }


  viewAppealAfterSubmission(applItem: ApplicationExtended, type: string): void {
    const caseId = applItem.caseId;
    let appealId;
    if (type == 'Eligibility') {
      appealId = applItem.caseEligibilityAppeal.caseAppealId;
    } else if (type == 'Amount') {
      appealId = applItem.caseAmountAppeal.caseAppealId;
    }
    if (!appealId || !caseId || !type) {
      console.error('Invalid appeal or case details:', { appealId, caseId, type });
      return;
    }

    this.dfaAppealDataService.setCaseDetails({...applItem, caseId, type });

    this.router.navigate([`/dfa-appeal/${appealId}/view`], {
      queryParams: {
        applicationId: applItem.applicationId
      }
    });
  }

  hasEligibilityAppeal(applItem: CurrentApplication): boolean {
    return !!applItem.caseEligibilityAppeal;
  }

  hasAmountAppeal(applItem: CurrentApplication): boolean {
    return !!applItem.caseAmountAppeal;
  }
}

export interface ApplicationExtended extends CurrentApplication {
  currentApplication: boolean;
}

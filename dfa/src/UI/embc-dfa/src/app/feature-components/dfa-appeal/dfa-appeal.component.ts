import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, Subscription, tap, of, forkJoin } from 'rxjs';
import { AppealModel, AppealUpdateRequest, DfaApplicationMain, SecondaryApplicant } from 'src/app/core/api/models';
import { AppealAttachmentService, ApplicationService } from 'src/app/core/api/services';
import { CancelConfirmationDialogComponent } from 'src/app/core/components/dialog-components/dfa-cancel-confirmation-dialog/dfa-cancel-confirmation-dialog.component';
import { AppealStatus, AppealType } from 'src/app/core/model/dfa-appeals-main.model';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAAppealDataService } from './dfa-appeal-data.service';
import { DfaAppealService } from './dfa-appeal.service';

@Component({
  selector: 'app-dfa-appeal',
  standalone: false,
  templateUrl: './dfa-appeal.component.html',
  styleUrls: ['./dfa-appeal.component.scss']
})
export class DfaAppealComponent implements OnInit {
  @ViewChild('dfaAppealStepper') dfaAppealStepper: MatStepper;
  steps: Array<ComponentMetaDataModel>;
  dfaAppealFolderPath = 'dfa-appeal-forms';
  isLoading = false;
  form: FormGroup;
  form$: Subscription;
  isSubmitted = false;
  isApplicantSigned: boolean = false;
  isSecondaryApplicantSigned: boolean = false;
  isSecondaryApplicant: boolean = false;
  secondaryApplicants: SecondaryApplicant[] = [];
  isSignaturesValid: boolean = false;
  appealId: string;
  appealType: string;
  isEditView: boolean;
  appealReasonForm$: Subscription;
  appealReasonForm: FormGroup;
  appealSupportingDocumentsForm: FormGroup;
  signAndSubmitForm: FormGroup;
  appealReasonValid: boolean = false;
  signAndSubmitValid: boolean = false;
  caseDetails: any;
  applicationId?: string;
  fullApplication: DfaApplicationMain | undefined;

  isInitDone = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private componentService: ComponentCreationService,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private dfaAppealDataService: DFAAppealDataService,
    private dfaAppealService: DfaAppealService,
    private applicationService: ApplicationService,
    private appealAttachmentService: AppealAttachmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.appealId = this.route.snapshot.paramMap.get('appealId');
    console.log('Url:', this.route);
    this.isEditView = this.router.url.includes('/edit');
    console.log("IsEdit", this.isEditView);
    this.applicationId = this.route.snapshot.queryParams.applicationId;

    if (!this.applicationId) {
      console.error('Application Id is required in queryParams');
      this.returnToDashboard();
      return;
    }

    if (!this.appealId) {
      console.error('Appeal Id is required');

      return;
    }

    // Clear old data and forms
    this.dfaAppealDataService.appealReason = null;
    this.dfaAppealDataService.signAndSubmit = null;
    this.dfaAppealDataService.appealSupportingDocuments = [];
    this.formCreationService.clearAppealReasonData();
    this.formCreationService.clearAppealSupportingDocumentsData();
    this.formCreationService.clearAppealSignAndSubmitData();

    // Clear persistent storage
    this.dfaAppealDataService.clearAppealData();

    // Create steps based on appeal type
    this.steps = this.componentService.createDFAAppealSteps(this.appealType);

   
    // @TODO: 
    // Step 1: Get appeal details from backend using appealId
    forkJoin([this.dfaAppealService.getAppealById(this.appealId), this.loadApplicationDetails()]).subscribe(([appeal, _]) => {
      console.log("Appeal:", appeal);

      // Map string to enum
      let appealTypeEnum: AppealType;
      switch (appeal.type?.toLowerCase()) {
        case 'amount':
          appealTypeEnum = AppealType.Amount;
          break;
        case 'eligibility':
          appealTypeEnum = AppealType.Eligibility;
          break;
        case 'other':
          appealTypeEnum = AppealType.Other;
          break;
        default:
          appealTypeEnum = AppealType.Other;
      }

      this.dfaAppealDataService.appealType = appealTypeEnum;

      this.loadCaseDetails(appeal).subscribe({
        next: () => {
          this.loadAppealDataIntoForms(appeal);

          this.isInitDone = true;
        },
      });

    })

    // step 3: Update template to handle both new and existing appeals

  }

  /**
   * Loads case details from the service
   *
   * TODO: Fetch case details using the application Id, rather than relying on the upstream pages to load it.
   * Otherwise, on page refresh, the case details will not be available, and will cause issues.
   */
  loadCaseDetails(appeal: any) {
    return this.applicationService.applicationGetCaseDetails({
      caseId: appeal.caseId
    }).pipe(tap({
      next: (caseDetails) => {
        console.log("caseDetails: ", caseDetails);
        this.dfaAppealDataService.setCaseDetails(caseDetails);
        this.caseDetails = caseDetails;
      }
    }));
  }

  loadApplicationDetails() {
    // Try to get full application from storage first
    this.fullApplication = this.dfaAppealDataService.getFullApplication();

    if (!this.fullApplication) {
      // Fetch full application details if not in storage
      return this.applicationService
        .applicationGetApplicationMain({
          applicationId: this.applicationId
        })
        .pipe(tap({
          next: (app) => {
            this.fullApplication = app;
            this.dfaAppealDataService.setFullApplication(app);
          },
          error: (error) => {
            console.error('Failed to fetch application details:', error);
            this.returnToDashboard();
          }
        }));
    }

    return of(this.fullApplication);
  }

  loadAppealDataIntoForms(appeal: AppealModel) {
    // Step 2: If appealId exists, load existing appeal data into forms

    this.formCreationService.getAppealReasonForm().subscribe(form => {
      if (form) {
        form.controls.reason.setValue(appeal.reason);

        if (!this.isEditView) form.disable();

        form.updateValueAndValidity();

        this.appealReasonForm = form;
      }
    });

    this.formCreationService.getAppealSignAndSubmitForm().subscribe(signAndSubmit => {
      if (signAndSubmit) {
        signAndSubmit.get('applicantSignature').patchValue({
          ...appeal
        });

        console.log(signAndSubmit.value);
        
        if (!this.isEditView) signAndSubmit.disable();

        signAndSubmit.updateValueAndValidity();

        this.signAndSubmitForm = signAndSubmit;
      }
    });

  }

  /**
   * Sets form data based on the component name (ie: the name of the step).
   *
   * @param {string} component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'appeal-reason':
        if (this.appealReasonForm) {
          this.dfaAppealDataService.appealReason = this.appealReasonForm.value.reason;
        }
        break;
      case 'supporting-documents':
        if (this.appealSupportingDocumentsForm) {
          this.dfaAppealDataService.setAppealSupportingDocuments(this.appealSupportingDocumentsForm.get('files').value);
        }
        break;
      case 'sign-and-submit':
        if (this.signAndSubmitForm) {
          this.dfaAppealDataService.signAndSubmit = this.signAndSubmitForm.getRawValue();
        }
        break;
      default:
        break;
    }
  }

  /**
   * Go back to previous step or dashboard
   *
   * @param {MatStepper} stepper
   * @param {number} lastStep
   * @return {*}  {void}
   */
  goBack(stepper: MatStepper, lastStep: number): void {
    if (lastStep === -1) {
      this.showCancelAppealDialog();
      return;
    }

    stepper.selectedIndex = lastStep;
  }

  /**
   * Custom next stepper function
   *
   * @param {MatStepper} stepper
   * @param {boolean} isLast
   * @param {string} component
   * @return {*}  {void}
   */
  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    this.setFormData(component);

    if (isLast && component === 'sign-and-submit') {
      this.dfaAppealStepper.selected.completed = true;
      this.submitAppeal();
      return;
    }

    switch (component) {
      case 'appeal-reason':
        if (this.form.valid) {
          stepper.selected.completed = true;
        } else {
          stepper.selected.completed = false;
        }
        break;
      case 'supporting-documents':
        stepper.selected.completed = true;
        break;
      case 'sign-and-submit':
        if (this.form.valid) {
          stepper.selected.completed = true;
        } else {
          stepper.selected.completed = false;
        }
        break;
      default:
        break;
    }

    stepper.next();
    this.form.markAllAsTouched();
  }

  /**
   * Checks if the user can go forward in the stepper.
   *
   * @param {string} component
   * @return {*}  {boolean}
   */
  canGoForward(component: string): boolean {
    if (component === 'appeal-reason') {
      return !this.appealReasonForm?.invalid;
    }

    if (component === 'supporting-documents') {
      return this.appealSupportingDocumentsForm?.valid;
    }

    if (component === 'sign-and-submit') {
      return this.appealReasonForm?.valid && this.form?.valid;
    }

    return true;
  }

  /**
   * Validates all forms
   *
   */
  validateForms(): void {
    this.formCreationService.getAppealReasonForm().subscribe((form) => {
      if (form) {

        form.updateValueAndValidity();
        this.appealReasonValid = form.valid;
        this.dfaAppealStepper.steps.get(0).completed = form.valid;
        this.setFormData('appeal-reason');
        this.cd.detectChanges();
      }
    });

    this.formCreationService.getAppealSupportingDocumentsForm().subscribe((form) => {
      if (form) {
        form.updateValueAndValidity();
        this.dfaAppealStepper.steps.get(1).completed = form.valid;
        this.setFormData('supporting-documents');
        this.cd.detectChanges();
      }
    });

    this.formCreationService.getAppealSignAndSubmitForm().subscribe((form) => {
      if (form) {
        form.updateValueAndValidity();
        this.signAndSubmitValid = form.valid;
        this.dfaAppealStepper.steps.get(2).completed = form.valid;
        this.setFormData('sign-and-submit');
        this.cd.detectChanges();
      }
    });
  }

  /**
   * Navigates to a specific step in the stepper.
   *
   * @param {number} stepIndex
   */
  navigateToStep(stepIndex: number) {
    this.dfaAppealStepper.selectedIndex = stepIndex;
  }

  /**
   * Loads form for every step based on index
   *
   * @param {number} index step index
   */
  currentStep(index: number): void {
    this.loadStepForm(index);
    this.cd.detectChanges();
  }

  /**
   * Triggered on the step change animation event
   *
   * @param {*} event animation event
   * @param {MatStepper} stepper stepper instance
   */
  stepChanged(event: any, stepper: MatStepper): void {
    // stepper.selected.interacted = false;

    this.validateForms();
  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param {number} index
   */
  loadStepForm(index: number): void {
    if (this.form$) {
      this.form$.unsubscribe();
    }

    switch (index) {
      case 0:
        this.form$ = this.formCreationService.getAppealReasonForm().subscribe((appealReasonForm) => {
          if (appealReasonForm) {
            this.form = appealReasonForm;
            this.appealReasonForm = appealReasonForm;
          }
        });
        break;
      case 1:
        this.form$ = this.formCreationService
          .getAppealSupportingDocumentsForm()
          .subscribe((appealSupportingDocumentsForm) => {
            if (appealSupportingDocumentsForm) {
              this.form = appealSupportingDocumentsForm;
              this.appealSupportingDocumentsForm = appealSupportingDocumentsForm;
            }
          });
        break;
      case 2:
        this.form$ = this.formCreationService.getAppealSignAndSubmitForm().subscribe((signAndSubmitForm) => {
          if (signAndSubmitForm) {
            this.form = signAndSubmitForm;
            this.signAndSubmitForm = signAndSubmitForm;
          }
        });
        break;
    }
  }

  /**
   * Submits the appeal and uploads/deletes supporting documents.
   *
   */
  submitAppeal(): void {
    this.isLoading = true;
    
    const appealUpdateRequest: AppealUpdateRequest = {
      id: this.appealId,
      caseId: this.caseDetails.caseId,
      type: this.dfaAppealDataService.appealType as any,
      status: AppealStatus.Received,
      reason: this.dfaAppealDataService.appealReason ?? '',
      signedName: (this.signAndSubmitForm.get('applicantSignature') as FormGroup).get('signedName').value, 
      dateSigned: (this.signAndSubmitForm.get('applicantSignature') as FormGroup).get('dateSigned').value,
      signature: (this.signAndSubmitForm.get('applicantSignature') as FormGroup).get('signature').value,
    }
   
    this.dfaAppealService.updateAppeal(appealUpdateRequest).subscribe({
      next: (isSuccess) => {

        this.snackBar.open(
          'Your appeal has successfully submitted',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        const supportingDocuments = this.dfaAppealDataService.appealSupportingDocuments || [];

        // Attach appealId to each document
        const supportingDocumentsToUpload = supportingDocuments.map((doc) => ({
          ...doc,
          appealId: this.appealId
        }));

        // Upload documents one at a time
        from(supportingDocumentsToUpload)
          .pipe(
            concatMap((supportingDocument) => {
              if (supportingDocument.deleteFlag) {
                // Delete the existing attachment if deleteFlag is true
                return this.appealAttachmentService.appealAttachmentDeleteAttachment({
                  documentUrlId: supportingDocument.id
                });
              }

              return this.appealAttachmentService.appealAttachmentUpsertAttachment({ body: supportingDocument });
            })
          )
          .subscribe({

            complete: () => {
              this.isLoading = false;
              this.cd.detectChanges();

              // Clear storage after successful submission
              this.dfaAppealDataService.clearAppealData();

              this.returnToDashboard();
            },
            error: (error) => {
              this.isLoading = false;
              this.cd.detectChanges();

              console.error('Failed to upload documents:', error);

              this.snackBar.open(
                'Failed to upload one or more documents. Please try again. If the error persists, please contact support.',
                'Close',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top'
                }
              );
            }
          });
      },
      error: (error) => {
        this.isLoading = false;
        this.cd.detectChanges();

        console.error('Failed to create appeal:', error);

        this.snackBar.open(
          'Failed to create the appeal. Please try again. If the error persists, please contact support.',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
      }
    });
  }

  /**
   * Shows the cancel appeal confirmation dialog
   *
   */
  showCancelAppealDialog(): void {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: {
        title: 'Cancel Appeal',
        subtitle: 'Are you sure you want to cancel your appeal?',
        text: "Appeals must be created and submitted in the same session.\nDrafts are not saved - any changes you've made will be lost.",
        cancelButton: 'No, go back',
        confirmButton: 'Yes, cancel appeal',
        showCloseIcon: true
      },
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cancelAppeal();
      }
    });
  }

  /**
   * Cancels the appeal and navigates back to dashboard
   *
   */
  cancelAppeal(): void {
    // Clear any form data
    this.dfaAppealDataService.appealReason = null;
    this.dfaAppealDataService.signAndSubmit = null;
    this.dfaAppealDataService.appealSupportingDocuments = [];
    this.formCreationService.clearAppealReasonData();
    this.formCreationService.clearAppealSupportingDocumentsData();
    this.formCreationService.clearAppealSignAndSubmitData();

    // Clear persistent storage
    this.dfaAppealDataService.clearAppealData();

    // Navigate back to dashboard
    this.returnToDashboard();
  }

  /**
   * Navigates back to the dashboard page.
   *
   */
  returnToDashboard(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }
}

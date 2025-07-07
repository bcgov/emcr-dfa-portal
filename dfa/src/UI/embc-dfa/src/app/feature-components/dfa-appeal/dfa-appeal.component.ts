import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, Subscription } from 'rxjs';
import { DfaApplicationMain, SecondaryApplicant } from 'src/app/core/api/models';
import { AppealAttachmentService, ApplicationService } from 'src/app/core/api/services';
import { AppealType } from 'src/app/core/model/dfa-appeals-main.model';
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
  caseId: string;
  appealType: string;
  appealReasonForm$: Subscription;
  appealReasonForm: FormGroup;
  appealSupportingDocumentsForm: FormGroup;
  signAndSubmitForm: FormGroup;
  appealReasonValid: boolean = false;
  signAndSubmitValid: boolean = false;
  caseDetails: any;
  fullApplication: DfaApplicationMain | undefined;
  fullApplication$: Subscription | undefined;

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
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get appeal type and case ID from route params
    this.route.params.subscribe((params) => {
      this.appealType = params['type'];
      this.caseId = params['caseId'];

      // Map string to enum
      let appealTypeEnum: AppealType;
      switch (this.appealType) {
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

      this.caseDetails = this.dfaAppealDataService.getCaseDetails();
      this.dfaAppealDataService.appealType = appealTypeEnum;

      // If no case details found, redirect to dashboard
      if (!this.caseDetails) {
        console.warn('No case details found, redirecting to dashboard');
        this.returnToDashboard();
        return;
      }

      // Validate case ID matches route parameter
      if (this.caseDetails.caseId !== this.caseId) {
        console.warn('Case ID mismatch, redirecting to dashboard');
        this.returnToDashboard();
        return;
      }

      // Try to get full application from storage first
      this.fullApplication = this.dfaAppealDataService.getFullApplication();

      if (!this.fullApplication && this.caseDetails?.applicationId) {
        // Fetch full application details if not in storage
        this.fullApplication$ = this.applicationService
          .applicationGetApplicationMain({
            applicationId: this.caseDetails.applicationId
          })
          .subscribe({
            next: (app) => {
              this.fullApplication = app;
              this.dfaAppealDataService.setFullApplication(app);
            },
            error: (error) => {
              console.error('Failed to fetch application details:', error);
              this.returnToDashboard();
            }
          });
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
    });
  }

  ngOnDestroy(): void {
    this.fullApplication$?.unsubscribe();
  }

  /**
   * Loads case details from the service
   *
   * TODO: Fetch case details using the application Id, rather than relying on the upstream pages to load it.
   * Otherwise, on page refresh, the case details will not be available, and will cause issues.
   */
  loadCaseDetails(): void {}

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
      this.returnToDashboard();
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
      return this.appealReasonForm?.valid;
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
    stepper.selected.interacted = false;

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
    const appeal = this.dfaAppealDataService.createAppealDTO();

    this.dfaAppealService.insertAppeal(appeal).subscribe({
      next: (appealId) => {
        const supportingDocuments = this.dfaAppealDataService.appealSupportingDocuments || [];

        // Attach appealId to each document
        const supportingDocumentsToUpload = supportingDocuments.map((doc) => ({
          ...doc,
          appealId: appealId
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

              this._snackBar.open(
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

        this._snackBar.open(
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
   * Navigates back to the dashboard page.
   *
   */
  returnToDashboard(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }
}

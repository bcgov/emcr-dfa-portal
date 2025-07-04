import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  DfaApplicationMain,
  SecondaryApplicant
} from 'src/app/core/api/models';
import { ApplicationService } from 'src/app/core/api/services';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAAppealDataService } from './dfa-appeal-data.service';
import { DfaAppealService } from './dfa-appeal.service';
import { AppealType } from 'src/app/core/model/dfa-appeals-main.model';
import { CancelConfirmationDialogComponent } from 'src/app/core/components/dialog-components/dfa-cancel-confirmation-dialog/dfa-cancel-confirmation-dialog.component';

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
  signAndSubmitForm: FormGroup;
  appealReasonValid: boolean = false;
  signAndSubmitValid: boolean = false;
  caseDetails: any;
  fullApplication: DfaApplicationMain | undefined;
  fullApplication$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private componentService: ComponentCreationService,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private dfaAppealDataService: DFAAppealDataService,
    private dfaAppealService: DfaAppealService,
    private applicationService: ApplicationService,
    public dialog: MatDialog
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

      // Fetch full application details using ApplicationService
      this.fullApplication$=this.applicationService.applicationGetApplicationMain({ applicationId: this.caseDetails?.applicationId })
        .subscribe(app => {
          this.fullApplication = app;
          this.dfaAppealDataService.setFullApplication(app);
        });

      // Clear old data and forms
      this.dfaAppealDataService.appealReason = null;
      this.dfaAppealDataService.signAndSubmit = null;
      this.formCreationService.clearAppealReasonData();
      this.formCreationService.clearAppealSignAndSubmitData();

      // Create steps based on appeal type
      this.steps = this.componentService.createDFAAppealSteps(this.appealType);
    });
  }

  ngOnDestroy(): void {
    this.fullApplication$.unsubscribe();
  }

  /**
   * Loads case details from the service
   */
  loadCaseDetails(): void {};

  setFormData(component: string): void {
    switch (component) {
      case 'appeal-reason':
        if (this.appealReasonForm) {
          this.dfaAppealDataService.appealReason = this.appealReasonForm.value.reason;
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
   */
  goBack(stepper: MatStepper, lastStep: number): void {
    if (lastStep === -2) {
      this.showCancelAppealDialog();
    } else {
      stepper.selectedIndex = lastStep;
    }
  }

  /**
   * Shows the cancel appeal confirmation dialog
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

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cancelAppeal();
      }
    });
  }

  /**
   * Cancels the appeal and navigates back to dashboard
   */
  private cancelAppeal(): void {
    // Clear any form data
    this.dfaAppealDataService.appealReason = null;
    this.dfaAppealDataService.signAndSubmit = null;
    this.formCreationService.clearAppealReasonData();
    this.formCreationService.clearAppealSignAndSubmitData();

    // Navigate back to dashboard
    this.returnToDashboard();
  }

  /**
   * Custom next stepper function
   */
  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (isLast && component === 'sign-and-submit') {
      this.dfaAppealStepper.selected.completed = true;
      this.submitAppeal();
    } else {
      this.setFormData(component);
      switch (component) {
        case 'appeal-reason':
          if (this.form.valid) stepper.selected.completed = true;
          else stepper.selected.completed = false;
          break;
        case 'sign-and-submit':
          if (this.form.valid) stepper.selected.completed = true;
          else stepper.selected.completed = false;
          break;
        default:
          break;
      }
      stepper.next();
      this.form.markAllAsTouched();
    }
  }

  /**
   * Validates all forms
   */
  validateForms(): void {
    this.formCreationService.getAppealReasonForm().subscribe((form) => {
      if (form) {
        form.updateValueAndValidity();
        this.appealReasonValid = form.valid;
        this.cd.detectChanges();
      }
    });

    this.formCreationService.getAppealSignAndSubmitForm().subscribe((form) => {
      if (form) {
        form.updateValueAndValidity();
        this.signAndSubmitValid = form.valid;
        this.cd.detectChanges();
      }
    });
  }

  navigateToStep(stepIndex: number) {
    this.dfaAppealStepper.selectedIndex = stepIndex;
  }

  /**
   * Loads form for every step based on index
   *
   * @param index step index
   */
  currentStep(index: number): void {
    this.loadStepForm(index);
    this.cd.detectChanges();
  }

  /**
   * Triggered on the step change animation event
   *
   * @param event animation event
   * @param stepper stepper instance
   */
  stepChanged(event: any, stepper: MatStepper): void {
    stepper.selected.interacted = false;

    this.validateForms();
    this.setCompletedSteps();
  }

  /**
   * Sets completed steps in the stepper
   */
  setCompletedSteps(): void {
    if (this.dfaAppealStepper) {
      this.dfaAppealStepper.steps.get(0).completed =
        this.appealReasonValid;
    }
  }

  /**
   * Loads appropriate forms based on the current step
   */
  loadStepForm(index: number): void {
    if (this.form$) {
      this.form$.unsubscribe();
    }

    switch (index) {
      case 0:
        this.form$ = this.formCreationService
          .getAppealReasonForm()
          .subscribe((appealReasonForm) => {
            if (appealReasonForm) {
              this.form = appealReasonForm;
              this.appealReasonForm = appealReasonForm;
            }
          });
        break;
      case 1:
        this.form$ = this.formCreationService
          .getAppealSignAndSubmitForm()
          .subscribe((signAndSubmitForm) => {
            if (signAndSubmitForm) {
              this.form = signAndSubmitForm;
              this.signAndSubmitForm = signAndSubmitForm;
            }
          });
        break;
    }
  }

  /**
   * Submits the appeal
   */
  submitAppeal(): void {
    this.isLoading = true;
    this.setFormData('sign-and-submit');

    let appeal = this.dfaAppealDataService.createAppealDTO();
    this.dfaAppealService.insertAppeal(appeal).subscribe({
      next: () => {
        this.isLoading = false;
        this.cd.detectChanges();
        this.returnToDashboard();
      },
      error: (error) => {
        this.isLoading = false;
        this.cd.detectChanges();
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  /**
   * Navigates back to dashboard
   */
  returnToDashboard(): void {
    this.router.navigate(['/verified-registration/dashboard']);
  }
}

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { ClaimStageOptionSet } from 'src/app/core/api/models';
import { AttachmentService } from 'src/app/core/api/services';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { AutoCallbackService } from 'src/app/core/services/autoCallback.service';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { Invoice } from '../../core/model/dfa-invoice.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import RecoveryPlanComponent from '../../sharedModules/forms/dfa-project-main-forms/recovery-plan/recovery-plan.component';
import { DFAClaimMainDataService } from './dfa-claim-main-data.service';
import { DFAClaimMainMappingService } from './dfa-claim-main-mapping.service';
import { DFAClaimMainService } from './dfa-claim-main.service';

@Component({
  selector: 'app-dfa-claim-main',
  standalone: false,
  templateUrl: './dfa-claim-main.component.html',
  styleUrls: ['./dfa-claim-main.component.scss']
})
export class DFAClaimMainComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dfaClaimMainStepper') dfaClaimMainStepper: MatStepper;
  @ViewChild(RecoveryPlanComponent) recPlan: RecoveryPlanComponent;
  @ViewChild('backtodash') backtodash: ElementRef;

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  dfaClaimMainFolderPath = 'dfa-claim-main-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'dfa-claim-main';
  dfaClaimMainHeading: string;
  parentPageName = 'dfa-claim-main';
  showLoader = false;
  isSubmitted = false;
  vieworedit: string;
  editstep: string;
  ninetyDayDeadline: string;
  daysToApply: number;
  showStepper: boolean = false;
  selectedStepIndex: number;
  prevStepIndex: number;
  invoiceSummaryDataSource = new MatTableDataSource<Invoice>();

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService,
    private dfaClaimMainMapping: DFAClaimMainMappingService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private dfaClaimMainService: DFAClaimMainService,
    private _snackBar: MatSnackBar,
    private autoCallbackService: AutoCallbackService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation !== null) {
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
    }
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    let claimId = this.dfaClaimMainDataService.getClaimId();

    if (claimId) {
      this.dfaClaimMainDataService.setClaimId(claimId);
      this.getFileUploadsForClaim(claimId);
    }
    this.formCreationService.clearRecoveryClaimData();
    this.formCreationService.clearClaimFileUploadsData();

    this.steps = this.componentService.createDFAClaimMainSteps();
    this.vieworedit = this.dfaClaimMainDataService.getViewOrEdit();
    this.editstep = this.dfaClaimMainDataService.getEditStep();

    this.dfaClaimMainHeading = 'Claim Details';

    const _invoiceFormArray = this.formCreationService.recoveryClaimForm.value.get('invoices');
    _invoiceFormArray.valueChanges.pipe(distinctUntilChanged()).subscribe((data: Invoice[]) => {
      this.invoiceSummaryDataSource.data = data;
    });

    // Automatically save the current data as a draft, if the user is idle for 60 seconds.
    // exclude view-only mode.
    if (this.vieworedit && this.vieworedit !== 'view' && this.vieworedit !== 'viewOnly') {
      this.autoCallbackService.start({
        callback: () => this.autoSaveDraft(),
        intervalSeconds: 60,
        whenIdle: true,
        squashErrors: true
      });
    }
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  navigateToStep(stepIndex: number) {
    this.dfaClaimMainStepper.selectedIndex = stepIndex;
  }

  /**
   * Loads form for every step based on index
   *
   * @param index step index
   */
  currentStep(index: number, stepper: MatStepper): void {
    this.prevStepIndex = index;
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
    // Save the current data as a draft on step change.
    this.autoCallbackService.trigger();

    stepper.selected.interacted = false;

    this.dfaClaimMainDataService.setCurrentStepSelected(event.selectedIndex);
  }

  /**
   * Custom back stepper function
   *
   * @param stepper stepper instance
   * @param lastStep stepIndex
   */
  goBack(stepper: MatStepper, lastStep): void {
    // Save the current data as a draft on step change.
    this.autoCallbackService.trigger();

    if (lastStep === 0) {
      stepper.previous();
    } else if (lastStep === -1) {
      this.showStep = !this.showStep;
    } else if (lastStep === -2) {
      this.returnToDashboard();
    }
  }

  /**
   * Custom next stepper function
   *
   * @param stepper stepper instance
   * @param isLast stepperIndex
   * @param component current component name
   */
  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    // Save the current data as a draft on step change.
    this.autoCallbackService.trigger();

    if (isLast && component === 'property-damage') {
      this.setFormData(component);
      this.dfaClaimMainStepper.selected.completed = true;

      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else if (component === 'recovery-claim') {
      this.setFormData(component);
      let claim = this.dfaClaimMainDataService.createDFAClaimMainDTO();
      this.dfaClaimMainMapping.mapDFAClaimMain(claim);

      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else {
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    }
  }

  /**
   * Return an observable which saves the current data as a draft.
   *
   * @private
   * @return {*}  {Observable<any>}
   */
  private saveDraft(): Observable<any> {
    this.setFormData(this.steps[this.dfaClaimMainStepper.selectedIndex]?.component.toString());
    this.dfaClaimMainDataService.recoveryClaim.claimStatus = ClaimStageOptionSet.DRAFT;
    let claim = this.dfaClaimMainDataService.createDFAClaimMainDTO();
    return this.dfaClaimMainService.upsertClaim(claim);
  }

  /**
   * Save current data as draft.
   */
  autoSaveDraft(): void {
    this.saveDraft().subscribe({
      next: () => {},
      error: () => {}
    });
  }

  /**
   * Save current data as draft and return user to dashboard page.
   */
  saveAsDraftAndNavigateToDashboard(): void {
    this.saveDraft().subscribe({
      next: () => {
        this.BackToDashboard();
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('Unable to Save as Draft. Please try again later.', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  requiredDocumentsSupplied(): boolean {
    let isInvoiceUploaded =
      this.formCreationService.fileUploadsClaimForm
        .getValue()
        .getRawValue()
        ?.fileUploads.filter((x) => x.requiredDocumentType === 'Invoices' && x.deleteFlag == false).length >= 1
        ? true
        : false;

    let isProofofPaymentUploaded =
      this.formCreationService.fileUploadsClaimForm
        .getValue()
        .getRawValue()
        ?.fileUploads.filter((x) => x.requiredDocumentType === 'ProofofPayment' && x.deleteFlag == false).length >= 1
        ? true
        : false;

    if (!isInvoiceUploaded || !isProofofPaymentUploaded) {
      return false;
    }

    return true;
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'recovery-claim':
        this.dfaClaimMainDataService.recoveryClaim.isThisFinalClaim =
          this.form.get('isThisFinalClaim').value == 'true'
            ? true
            : this.form.get('isThisFinalClaim').value == 'false'
              ? false
              : null;
        break;
      default:
        break;
    }
  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param index Step index
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService.getRecoveryClaimForm().subscribe((recoveryClaimForm) => {
          this.form = recoveryClaimForm;
        });

        break;
      case 2:
        this.form$ = this.formCreationService.getSupportingDocumentsForm().subscribe((supportingDocuments) => {
          this.form = supportingDocuments;
        });
        break;
    }
  }

  saveAndBackToDashboard() {
    this.returnToDashboard();
  }

  returnToDashboard() {
    //this.dfaProjectMainDataService.setApplicationId(null);
    this.router.navigate(['/verified-registration/dashboard']);
  }

  submitFile(): void {
    var contentDialog = globalConst.confirmSubmitClaimBody;
    var height = '260px';

    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: contentDialog,
          header: 'Submit Claim Confirmation'
        },
        height: height,
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          // Stop the auto save service to prevent draft saves during submission.
          this.autoCallbackService.stop();

          this.setFormData(this.steps[this.dfaClaimMainStepper.selectedIndex]?.component.toString());
          this.dfaClaimMainDataService.recoveryClaim.claimStatus = ClaimStageOptionSet.SUBMIT;

          let project = this.dfaClaimMainDataService.createDFAClaimMainDTO();

          this.dfaClaimMainService.upsertClaim(project).subscribe(
            (x) => {
              this.BackToDashboard();
            },
            (error) => {
              console.error(error);
              this._snackBar.open('Unable to Submit Claim. Please try again later.', 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            }
          );
        }
      });
  }

  public getFileUploadsForClaim(claimId: string) {
    this.fileUploadsService.attachmentGetClaimAttachments({ claimId: claimId }).subscribe({
      next: (attachments) => {
        // initialize list of file uploads
        this.formCreationService.fileUploadsClaimForm.value.get('fileUploads').setValue(attachments);
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('Unable to Get File Uploads. Please try again later.', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  BackToDashboard(): void {
    var projId = this.dfaClaimMainDataService.getProjectId();
    this.router.navigate(['/dfa-project/' + projId + '/claims']);
  }

  ngOnDestroy(): void {
    this.autoCallbackService.stop();
  }
}

export class ValidateProjectMandatoryFields {
  static isRequired(control: AbstractControl): ValidatorFn {
    return (_controls: AbstractControl) => {
      if (control.invalid == true) {
        control.setErrors({ isRequired: true });
        return { isRequired: true };
      } else {
        return null;
      }
    };
  }
}

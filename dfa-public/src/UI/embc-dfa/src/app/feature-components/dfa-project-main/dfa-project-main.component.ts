import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProjectStageOptionSet } from 'src/app/core/api/models';
import { AttachmentService } from 'src/app/core/api/services';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { AutoCallbackService } from 'src/app/core/services/autoCallback.service';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import RecoveryPlanComponent from '../../sharedModules/forms/dfa-project-main-forms/recovery-plan/recovery-plan.component';
import { DFAProjectMainDataService } from './dfa-project-main-data.service';
import { DFAProjectMainMappingService } from './dfa-project-main-mapping.service';
import { DFAProjectMainService } from './dfa-project-main.service';

@Component({
  selector: 'app-dfa-project-main',
  standalone: false,
  templateUrl: './dfa-project-main.component.html',
  styleUrls: ['./dfa-project-main.component.scss']
})
export class DFAProjectMainComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dfaProjectMainStepper') dfaProjectMainStepper: MatStepper;
  @ViewChild(RecoveryPlanComponent) recPlan: RecoveryPlanComponent;
  @ViewChild('backtodash') backtodash: ElementRef;

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  dfaProjectMainFolderPath = 'dfa-project-main-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'dfa-project-main';
  dfaProjectMainHeading: string;
  parentPageName = 'dfa-project-main';
  showLoader = false;
  isSubmitted = false;
  vieworedit: string;
  editstep: string;
  ninetyDayDeadline: string;
  daysToApply: number;
  showStepper: boolean = false;
  selectedStepIndex: number;
  prevStepIndex: number;

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaProjectMainService: DFAProjectMainService,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService,
    private dfaProjectMainMapping: DFAProjectMainMappingService,
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
    let projectId = this.dfaProjectMainDataService.getProjectId();

    if (projectId) {
      this.dfaProjectMainDataService.setProjectId(projectId);
      this.getFileUploadsForProject(projectId);
    }
    this.formCreationService.clearRecoveryPlanData();
    this.formCreationService.clearFileUploadsData();

    this.steps = this.componentService.createDFAProjectMainSteps();
    this.vieworedit = this.dfaProjectMainDataService.getViewOrEdit();
    this.editstep = this.dfaProjectMainDataService.getEditStep();

    this.dfaProjectMainHeading = 'Project Details';

    // Automatically save the current data as a draft, if the user is idle for 60 seconds.
    this.autoCallbackService.start({
      callback: () => this.autoSaveDraft(),
      intervalSeconds: 60,
      whenIdle: true,
      squashErrors: true
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  navigateToStep(stepIndex: number) {
    this.dfaProjectMainStepper.selectedIndex = stepIndex;
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

    if (event.previouslySelectedIndex == 0) {
      this.setFormData('recovery-plan');
    }

    this.dfaProjectMainDataService.setCurrentStepSelected(event.selectedIndex);
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
      this.dfaProjectMainStepper.selected.completed = true;

      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else if (component === 'recovery-plan') {
      if (this.form.get('projectNumber').invalid == true && this.form.get('projectName').invalid == true) {
        this.form.addValidators([ValidateProjectMandatoryFields.isRequired(this.form.get('projectNumber'))]);
        this.form.get('projectNumber').markAsTouched();
        this.form.get('projectNumber').updateValueAndValidity();

        document.getElementById('backtodash').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        this.form.get('projectNumber').setErrors(null);
        this.form.get('projectNumber').markAsTouched();
        this.form.get('projectNumber').updateValueAndValidity();
        this.setFormData(component);
        let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
        this.dfaProjectMainMapping.mapDFAProjectMain(project);
      }

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
    this.setFormData(this.steps[this.dfaProjectMainStepper.selectedIndex]?.component.toString());
    this.dfaProjectMainDataService.recoveryPlan.projectStatus = ProjectStageOptionSet.Draft;
    let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
    return this.dfaProjectMainService.upsertProject(project);
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
    let isPreEventUploaded =
      this.formCreationService.fileUploadsForm
        .getValue()
        .getRawValue()
        ?.fileUploads.filter((x) => x.requiredDocumentType === 'PreEvent' && x.deleteFlag == false).length >= 1
        ? true
        : false;
    let isPostEventUploaded =
      this.formCreationService.fileUploadsForm
        .getValue()
        .getRawValue()
        ?.fileUploads.filter((x) => x.requiredDocumentType === 'PostEvent' && x.deleteFlag == false).length >= 1
        ? true
        : false;

    if (isPreEventUploaded == true && isPostEventUploaded) return true;
    else return false;
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'recovery-plan':
        this.dfaProjectMainDataService.recoveryPlan.projectApprovedDate = this.form.get('projectApprovedDate').value;
        this.dfaProjectMainDataService.recoveryPlan.project18MonthDeadline =
          this.form.get('project18MonthDeadline').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedCost = !this.form.get('approvedCost').value
          ? null
          : this.form.get('approvedCost').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedAmendedProjectCost = !this.form.get(
          'approvedAmendedProjectCost'
        ).value
          ? null
          : this.form.get('approvedAmendedProjectCost').value;
        this.dfaProjectMainDataService.recoveryPlan.claimTotal = !this.form.get('claimTotal').value
          ? null
          : this.form.get('claimTotal').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedTotal = !this.form.get('approvedTotal').value
          ? null
          : this.form.get('approvedTotal').value;
        this.dfaProjectMainDataService.recoveryPlan.paidProjectAmount = !this.form.get('paidProjectAmount').value
          ? null
          : this.form.get('paidProjectAmount').value;
        this.dfaProjectMainDataService.recoveryPlan.emcrapprovalcomments = this.form.get('emcrapprovalcomments').value;
        this.dfaProjectMainDataService.recoveryPlan.projectName = this.form.get('projectName').value;
        this.dfaProjectMainDataService.recoveryPlan.projectNumber = this.form.get('projectNumber').value;
        this.dfaProjectMainDataService.recoveryPlan.projectStatus = this.form.get('projectStatus').value;
        this.dfaProjectMainDataService.recoveryPlan.isdamagedDateSameAsApplication =
          this.form.get('isdamagedDateSameAsApplication').value == 'true'
            ? true
            : this.form.get('isdamagedDateSameAsApplication').value == 'false'
              ? false
              : null;
        this.dfaProjectMainDataService.recoveryPlan.sitelocationdamageFromDate =
          this.form.get('sitelocationdamageFromDate').value;
        this.dfaProjectMainDataService.recoveryPlan.sitelocationdamageToDate =
          this.form.get('sitelocationdamageToDate').value;
        this.dfaProjectMainDataService.recoveryPlan.differentDamageDatesReason =
          this.form.get('differentDamageDatesReason').value;
        this.dfaProjectMainDataService.recoveryPlan.siteLocation = this.form.get('siteLocation').value;
        this.dfaProjectMainDataService.recoveryPlan.infraDamageDetails = this.form.get('infraDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.causeofDamageDetails = this.form.get('causeofDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.describeDamageDetails =
          this.form.get('describeDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.describeDamagedInfrastructure = this.form.get(
          'describeDamagedInfrastructure'
        ).value;
        this.dfaProjectMainDataService.recoveryPlan.repairWorkDetails = this.form.get('repairWorkDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.repairDamagedInfrastructure =
          this.form.get('repairDamagedInfrastructure').value;
        this.dfaProjectMainDataService.recoveryPlan.estimatedCompletionDate =
          this.form.get('estimatedCompletionDate').value;
        this.dfaProjectMainDataService.recoveryPlan.estimateCostIncludingTax = !this.form.get(
          'estimateCostIncludingTax'
        ).value
          ? null
          : this.form.get('estimateCostIncludingTax').value;
        this.dfaProjectMainDataService.recoveryPlan.createdDate = this.form.get('createdDate').value;
        this.dfaProjectMainDataService.recoveryPlan.submittedDate = this.form.get('submittedDate').value;
        this.dfaProjectMainDataService.recoveryPlan.advancedPaymentsMade = !this.form.get('advancedPaymentsMade').value
          ? null
          : this.form.get('advancedPaymentsMade').value;
        this.dfaProjectMainDataService.recoveryPlan.advancedPaymentsBalance = !this.form.get('advancedPaymentsBalance')
          .value
          ? null
          : this.form.get('advancedPaymentsBalance').value;
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
        this.form$ = this.formCreationService.getRecoveryPlanForm().subscribe((recoveryPlanForm) => {
          this.form = recoveryPlanForm;
        });

        break;
      case 1:
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
    this.router.navigate(['/verified-registration/dashboard']);
  }

  submitFile(): void {
    var contentDialog = globalConst.confirmSubmitProjectBody;
    var height = '350px';
    if (this.dfaProjectMainDataService.getApplicationId()) {
      contentDialog = globalConst.confirmSubmitProjectBody;
      height = '250px';
    }

    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: contentDialog,
          header: 'Submit Project Confirmation'
        },
        height: height,
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.setFormData(this.steps[this.dfaProjectMainStepper.selectedIndex]?.component.toString());
          this.dfaProjectMainDataService.recoveryPlan.projectStatus = ProjectStageOptionSet.Submitted;

          let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();

          this.dfaProjectMainService.upsertProject(project).subscribe(
            (x) => {
              this.BackToDashboard();
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
  }

  public getFileUploadsForProject(projectId: string) {
    this.fileUploadsService.attachmentGetProjectAttachments({ projectId: projectId }).subscribe({
      next: (attachments) => {
        // initialize list of file uploads
        this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(attachments);
      },
      error: (error) => {
        console.error(error);
        this._snackBar.open('Unable to Get File Attachments. Please try again later.', 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  BackToDashboard(): void {
    var appId = this.dfaProjectMainDataService.getApplicationId();
    this.router.navigate(['/dfa-application/' + appId + '/projects']);
  }

  notifyAddressChange(): void {
    this.dialog
      .open(AddressChangeComponent, {
        data: {
          content: globalConst.notifyBCSCAddressChangeBody
        },
        height: '300px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe();
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

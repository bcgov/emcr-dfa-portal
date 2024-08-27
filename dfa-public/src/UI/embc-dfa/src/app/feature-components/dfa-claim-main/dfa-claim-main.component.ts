import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, distinctUntilChanged, mapTo } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ApplicantOption, ClaimStageOptionSet, FarmOption, ProjectStageOptionSet, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAClaimMainMappingService } from './dfa-claim-main-mapping.service';
import RecoveryPlanComponent from '../../sharedModules/forms/dfa-project-main-forms/recovery-plan/recovery-plan.component';
import { DFAClaimMainDataService } from './dfa-claim-main-data.service';
import { DFAClaimMainService } from './dfa-claim-main.service';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from '../../core/model/dfa-invoice.model';

@Component({
  selector: 'app-dfa-claim-main',
  templateUrl: './dfa-claim-main.component.html',
  styleUrls: ['./dfa-claim-main.component.scss']
})
export class DFAClaimMainComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
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
    private alertService: AlertService,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService,
    private dfaClaimMainMapping: DFAClaimMainMappingService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private dfaClaimMainService: DFAClaimMainService,
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
    
    //this.showStepper = true;
    this.dfaClaimMainHeading = 'Claim Details'

    const _invoiceFormArray = this.formCreationService.recoveryClaimForm.value.get('invoices');
    _invoiceFormArray.valueChanges
      .pipe(
        mapTo(_invoiceFormArray.getRawValue())
      ).subscribe(data => this.invoiceSummaryDataSource.data = _invoiceFormArray.getRawValue());

  }



  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    //this.recPlan.setFocus();
    //debugger
    //this.projectName.nativeElement.focus();
    //this.formCreationService.recoveryPlanForm.value.markAsUntouched();

    //this.dfaProjectMainStepper.steps.forEach((step, idx) => {
    //  //if (idx == 1 && this.formCreationService.recoveryPlanForm.value.get('projectNumber').invalid) {
    //  //  step.editable = false;
    //  //}
      
    //  step.select = () => {
    //    this.selectedStepIndex = idx;
        
    //    switch (idx) {
    //      case 1:
    //        this.setFormData('recovery-plan')
    //        break;
    //    }
    //  };
    //});
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
    stepper.selected.interacted = false;
    
    if (event.previouslySelectedIndex == 0) {
      //this.setFormData('recovery-claim');
    }

    this.dfaClaimMainDataService.setCurrentStepSelected(event.selectedIndex);
    /*stepper.steps.toArray()[1].editable = false;*/
    //if ((this.form.get('projectNumber').invalid == true || this.form.get('projectName').invalid == true)) {
    //  stepper.steps.toArray()[1].editable = false;
    //  this.cd.detectChanges();
    //}
    //else {

    //}
  }

  /**
   * Custom back stepper function
   *
   * @param stepper stepper instance
   * @param lastStep stepIndex
   */
  goBack(stepper: MatStepper, lastStep): void {
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
    
    if (isLast && component === 'property-damage') {
      this.setFormData(component);
      this.dfaClaimMainStepper.selected.completed = true;
      //this.submitFile();
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
    }
    else {
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    }
  }

  saveAsDraft(): void {
    this.setFormData(this.steps[this.dfaClaimMainStepper.selectedIndex]?.component.toString());
    this.dfaClaimMainDataService.recoveryClaim.claimStatus = ClaimStageOptionSet.DRAFT;
    let claim = this.dfaClaimMainDataService.createDFAClaimMainDTO();

    this.dfaClaimMainService.upsertClaim(claim).subscribe(x => {
        this.BackToDashboard();
    },
      error => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      });
  }

  requiredDocumentsSupplied(): boolean {
    let isInvoiceUploaded = this.formCreationService.fileUploadsClaimForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "Invoices" && x.deleteFlag == false).length >= 1 ? true : false;
    let isGeneralLedgerUploaded = this.formCreationService.fileUploadsClaimForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "GeneralLedger" && x.deleteFlag == false).length >= 1 ? true : false;
    let isProofofPaymentUploaded = this.formCreationService.fileUploadsClaimForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "ProofofPayment" && x.deleteFlag == false).length >= 1 ? true : false;
   
    if (isInvoiceUploaded == true
      && isGeneralLedgerUploaded
      && isProofofPaymentUploaded ) return true;
    else return false;
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    
    switch (component) {
      case 'recovery-claim':
        this.dfaClaimMainDataService.recoveryClaim.isThisFinalClaim = this.form.get('isThisFinalClaim').value == 'true' ? true : (this.form.get('isThisFinalClaim').value == 'false' ? false : null);
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
        this.form$ = this.formCreationService
          .getRecoveryClaimForm()
          .subscribe((recoveryClaimForm) => {
            this.form = recoveryClaimForm;
          });

        break;
      case 2:
        this.form$ = this.formCreationService
          .getSupportingDocumentsForm()
          .subscribe((supportingDocuments) => {
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
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          //this.dfaApplicationMainMapping.mapDFAApplicationMain(application);
          this.setFormData(this.steps[this.dfaClaimMainStepper.selectedIndex]?.component.toString());
          this.dfaClaimMainDataService.recoveryClaim.claimStatus = ClaimStageOptionSet.SUBMIT;

          let project = this.dfaClaimMainDataService.createDFAClaimMainDTO();

          this.dfaClaimMainService.upsertClaim(project).subscribe(x => {
            this.BackToDashboard();
          },
            error => {
              console.error(error);
              document.location.href = 'https://dfa.gov.bc.ca/error.html';
            });
          
          //this.dfaProjectMainService.upsertApplication(application).subscribe(x => {
          //  this.isSubmitted = !this.isSubmitted;
          //  this.alertService.clearAlert();
          //  this.dfaProjectMainDataService.isSubmitted = true;
          //  this.dfaProjectMainDataService.setViewOrEdit('view');
          //  this.vieworedit = 'view';
          //  this.returnToDashboard();
          //},
          //error => {
          //  console.error(error);
          //  //document.location.href = 'https://dfa.gov.bc.ca/error.html';
          //});
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
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  BackToDashboard(): void {
    var projId = this.dfaClaimMainDataService.getProjectId();
    this.router.navigate(['/dfa-project/' + projId + '/claims']);
  }
  
}

export class ValidateProjectMandatoryFields {
  static isRequired(control: AbstractControl): ValidatorFn {

    return (controls: AbstractControl) => {
      //const control = controls.get(controlName);

      if (control.invalid == true) { 
        control.setErrors({ isRequired: true });
        return { isRequired: true };
      }
      else {
        return null;
      }
    };
  }
}

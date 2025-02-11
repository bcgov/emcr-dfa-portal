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
import { DFAProjectMainDataService } from './dfa-project-main-data.service';
import { DFAProjectMainService } from './dfa-project-main.service';
import { ApplicantOption, FarmOption, ProjectStageOptionSet, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAProjectMainMappingService } from './dfa-project-main-mapping.service';
import RecoveryPlanComponent from '../../sharedModules/forms/dfa-project-main-forms/recovery-plan/recovery-plan.component';

@Component({
  selector: 'app-dfa-project-main',
  templateUrl: './dfa-project-main.component.html',
  styleUrls: ['./dfa-project-main.component.scss']
})
export class DFAProjectMainComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
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
    private alertService: AlertService,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaProjectMainService: DFAProjectMainService,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService,
    private dfaProjectMainMapping: DFAProjectMainMappingService,
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
    //this.formCreationService.clearOtherContactsData();

    this.steps = this.componentService.createDFAProjectMainSteps();
    this.vieworedit = this.dfaProjectMainDataService.getViewOrEdit();
    this.editstep = this.dfaProjectMainDataService.getEditStep();
    
    //this.showStepper = true;
    this.dfaProjectMainHeading = 'Project Details'

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
    stepper.selected.interacted = false;
    
    if (event.previouslySelectedIndex == 0) {
      this.setFormData('recovery-plan');
    }

    this.dfaProjectMainDataService.setCurrentStepSelected(event.selectedIndex);
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
      this.dfaProjectMainStepper.selected.completed = true;
      //this.submitFile();
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else if (component === 'recovery-plan') {
      if (this.form.get('projectNumber').invalid == true && this.form.get('projectName').invalid == true) {

        this.form.addValidators([ValidateProjectMandatoryFields.isRequired(this.form.get('projectNumber'))]);
        this.form.get('projectNumber').markAsTouched();
        this.form.get('projectNumber').updateValueAndValidity();

        //this.form.addValidators([ValidateProjectMandatoryFields.isRequired(this.form.get('projectName'))]);
        //this.form.get('projectName').markAsTouched();
        //this.form.get('projectName').updateValueAndValidity();
        document.getElementById("backtodash").scrollIntoView({ behavior: 'smooth', block: 'center' });

      } else {
        this.form.get('projectNumber').setErrors(null);
        this.form.get('projectNumber').markAsTouched();
        this.form.get('projectNumber').updateValueAndValidity();
        this.setFormData(component);
        let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
        this.dfaProjectMainMapping.mapDFAProjectMain(project);
        //this.form$.unsubscribe();
        //stepper.next();
        //this.form.markAllAsTouched();
        //this.dfaProjectMainService.upsertProject(project).subscribe(x => {

        //  // determine if step is complete
        //  //switch (component) {
        //  //  case 'property-damage':
        //  //    if (this.form.valid) stepper.selected.completed = true;
        //  //    else stepper.selected.completed = false;
        //  //    break;
        //  //  case 'review':
        //  //    stepper.selected.completed = true;
        //  //    break;
        //  //  default:
        //  //    break;
        //  //}
        //  this.form$.unsubscribe();
        //  stepper.next();
        //  this.form.markAllAsTouched();
        //},
        //  error => {
        //    console.error(error);
        //    document.location.href = 'https://dfa.gov.bc.ca/error.html';
        //  });
      }

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
    this.setFormData(this.steps[this.dfaProjectMainStepper.selectedIndex]?.component.toString());
    this.dfaProjectMainDataService.recoveryPlan.projectStatus = ProjectStageOptionSet.DRAFT;
    let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
    this.dfaProjectMainService.upsertProject(project).subscribe(x => {
        this.BackToDashboard();
    },
      error => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      });
  }

  requiredDocumentsSupplied(): boolean {
    let isPreEventUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "PreEvent" && x.deleteFlag == false).length >= 1 ? true : false;
    let isPostEventUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "PostEvent" && x.deleteFlag == false).length >= 1 ? true : false;
   
    if (isPreEventUploaded == true
      && isPostEventUploaded) return true;
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
        this.dfaProjectMainDataService.recoveryPlan.project18MonthDeadline = this.form.get('project18MonthDeadline').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedCost = !this.form.get('approvedCost').value ? null : this.form.get('approvedCost').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedAmendedProjectCost = !this.form.get('approvedAmendedProjectCost').value ? null : this.form.get('approvedAmendedProjectCost').value;
        this.dfaProjectMainDataService.recoveryPlan.claimTotal = !this.form.get('claimTotal').value ? null : this.form.get('claimTotal').value;
        this.dfaProjectMainDataService.recoveryPlan.approvedTotal = !this.form.get('approvedTotal').value ? null : this.form.get('approvedTotal').value;
        this.dfaProjectMainDataService.recoveryPlan.paidProjectAmount = !this.form.get('paidProjectAmount').value ? null : this.form.get('paidProjectAmount').value;
        this.dfaProjectMainDataService.recoveryPlan.emcrapprovalcomments = this.form.get('emcrapprovalcomments').value;
        this.dfaProjectMainDataService.recoveryPlan.projectName = this.form.get('projectName').value;
        this.dfaProjectMainDataService.recoveryPlan.projectNumber = this.form.get('projectNumber').value;
        this.dfaProjectMainDataService.recoveryPlan.projectStatus = this.form.get('projectStatus').value;
        this.dfaProjectMainDataService.recoveryPlan.isdamagedDateSameAsApplication = this.form.get('isdamagedDateSameAsApplication').value == 'true' ? true : (this.form.get('isdamagedDateSameAsApplication').value == 'false' ? false : null);
        this.dfaProjectMainDataService.recoveryPlan.sitelocationdamageFromDate = this.form.get('sitelocationdamageFromDate').value;
        this.dfaProjectMainDataService.recoveryPlan.sitelocationdamageToDate = this.form.get('sitelocationdamageToDate').value;
        this.dfaProjectMainDataService.recoveryPlan.differentDamageDatesReason = this.form.get('differentDamageDatesReason').value;
        this.dfaProjectMainDataService.recoveryPlan.siteLocation = this.form.get('siteLocation').value;
        this.dfaProjectMainDataService.recoveryPlan.infraDamageDetails = this.form.get('infraDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.causeofDamageDetails = this.form.get('causeofDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.describeDamageDetails = this.form.get('describeDamageDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.describeDamagedInfrastructure = this.form.get('describeDamagedInfrastructure').value;
        this.dfaProjectMainDataService.recoveryPlan.repairWorkDetails = this.form.get('repairWorkDetails').value;
        this.dfaProjectMainDataService.recoveryPlan.repairDamagedInfrastructure = this.form.get('repairDamagedInfrastructure').value;
        this.dfaProjectMainDataService.recoveryPlan.estimatedCompletionDate = this.form.get('estimatedCompletionDate').value;
        this.dfaProjectMainDataService.recoveryPlan.estimateCostIncludingTax = !this.form.get('estimateCostIncludingTax').value ? null : this.form.get('estimateCostIncludingTax').value;

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
          .getRecoveryPlanForm()
          .subscribe((recoveryPlanForm) => {
            this.form = recoveryPlanForm;
          });

        break;
      case 1:
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
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          //this.dfaApplicationMainMapping.mapDFAApplicationMain(application);
          this.setFormData(this.steps[this.dfaProjectMainStepper.selectedIndex]?.component.toString());
          this.dfaProjectMainDataService.recoveryPlan.projectStatus = ProjectStageOptionSet.SUBMIT;

          let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();

          this.dfaProjectMainService.upsertProject(project).subscribe(x => {
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

  public getFileUploadsForProject(projectId: string) {

    this.fileUploadsService.attachmentGetProjectAttachments({ projectId: projectId }).subscribe({
      next: (attachments) => {
        // initialize list of file uploads
        this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(attachments);
        
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
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
      .subscribe((result) => {
        //if (result === 'confirm') {

        //}
      });
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

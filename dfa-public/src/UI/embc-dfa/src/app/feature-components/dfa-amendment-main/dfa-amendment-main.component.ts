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
import { ApplicantOption, FarmOption, ProjectStageOptionSet, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAAmendmentMainMappingService } from './dfa-amendment-main-mapping.service';
import RecoveryPlanComponent from '../../sharedModules/forms/dfa-project-main-forms/recovery-plan/recovery-plan.component';
import { DFAAmendmentMainDataService } from './dfa-amendment-main-data.service';
import { DFAAmendmentMainService } from './dfa-amendment-main.service';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from '../../core/model/dfa-invoice.model';

@Component({
  selector: 'app-dfa-amendment-main',
  standalone: false,
  templateUrl: './dfa-amendment-main.component.html',
  styleUrls: ['./dfa-amendment-main.component.scss']
})
export class DFAAmendmentMainComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('dfaAmendmentMainStepper') dfaAmendmentMainStepper: MatStepper;
  @ViewChild(RecoveryPlanComponent) recPlan: RecoveryPlanComponent;
  @ViewChild('backtodash') backtodash: ElementRef;

  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  dfaAmendmentMainFolderPath = 'dfa-amendment-main-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'dfa-amendment-main';
  dfaAmendmentMainHeading: string;
  parentPageName = 'dfa-amendment-main';
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
    private dfaAmendmentMainMapping: DFAAmendmentMainMappingService,
    private dfaAmendmentMainDataService: DFAAmendmentMainDataService,
    private dfaAmendmentMainService: DFAAmendmentMainService,
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
    let amendmentId = this.dfaAmendmentMainDataService.getAmendmentId();
    
    if (amendmentId) {
      this.dfaAmendmentMainDataService.setAmendmentId(amendmentId);
      this.getFileUploadsForAmendment(amendmentId);
    }
    this.formCreationService.clearProjectAmendmentData();
    this.formCreationService.clearFileUploadsData();

    this.steps = this.componentService.createDFAAmendmentMainSteps();
    this.vieworedit = this.dfaAmendmentMainDataService.getViewOrEdit();
    this.editstep = this.dfaAmendmentMainDataService.getEditStep();
    
    //this.showStepper = true;
    this.dfaAmendmentMainHeading = 'Amendment Details'

  }

  ngAfterViewInit(): void {
    
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  navigateToStep(stepIndex: number) {
    this.dfaAmendmentMainStepper.selectedIndex = stepIndex;
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
      //this.setFormData('recovery-amendment');
    }

    this.dfaAmendmentMainDataService.setCurrentStepSelected(event.selectedIndex);
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
      this.dfaAmendmentMainStepper.selected.completed = true;
      //this.submitFile();
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else if (component === 'recovery-amendment') {
      let amendment = this.dfaAmendmentMainDataService.createDFAAmendmentMainDTO();
      this.dfaAmendmentMainMapping.mapDFAAmendmentMain(amendment);

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
    let amendment = this.dfaAmendmentMainDataService.createDFAAmendmentMainDTO();

    this.dfaAmendmentMainService.upsertAmendment(amendment).subscribe(x => {
        this.BackToDashboard();
    },
      error => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      });
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
          .getProjectAmendmentForm()
          .subscribe((recoveryAmendmentForm) => {
            this.form = recoveryAmendmentForm;
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
    var contentDialog = globalConst.confirmSubmitAmendmentBody;
    var height = '260px';

    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: contentDialog,
          header: 'Submit Amendment Confirmation' 
        },
        height: height,
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          let project = this.dfaAmendmentMainDataService.createDFAAmendmentMainDTO();

          this.dfaAmendmentMainService.upsertAmendment(project).subscribe(x => {
            this.BackToDashboard();
          },
            error => {
              console.error(error);
              document.location.href = 'https://dfa.gov.bc.ca/error.html';
            });
        }
      });
  }

  public getFileUploadsForAmendment(projectId: string) {

    this.fileUploadsService.attachmentGetAmendmentAttachments({ projectId: projectId }).subscribe({
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
    var projId = this.dfaAmendmentMainDataService.getProjectId();
    this.router.navigate(['/dfa-project-amendments/' + projId]);
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

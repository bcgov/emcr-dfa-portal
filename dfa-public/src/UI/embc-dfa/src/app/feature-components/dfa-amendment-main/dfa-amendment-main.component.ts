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
import { ApplicationService, AttachmentService, ProjectService } from 'src/app/core/api/services';
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
import { ComponentWrapperComponent } from 'src/app/sharedModules/components/component-wrapper/component-wrapper.component';
import { DFAProjectMainDataService } from '../dfa-project-main/dfa-project-main-data.service';

@Component({
  selector: 'app-dfa-amendment-main',
  standalone: false,
  templateUrl: './dfa-amendment-main.component.html',
  styleUrls: ['./dfa-amendment-main.component.scss']
})
export class DFAAmendmentMainComponent
  implements OnInit, AfterViewChecked
{
  dfaAmendmentMainFolderPath = 'dfa-amendment-main-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  currentFlow: string;
  type = 'dfa-amendment-main';
  dfaAmendmentMainHeading: string;
  parentPageName = 'dfa-amendment-dashboard';
  showLoader = false;
  isSubmitted = false;
  vieworedit: string;
  editstep: string;
  ninetyDayDeadline: string;
  daysToApply: number;
  invoiceSummaryDataSource = new MatTableDataSource<Invoice>();
  dfaAmendmentForm: UntypedFormGroup;
  dfaAmendmentForm$: Subscription;


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
    private projectService: ProjectService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
  ) {
    const navigation = this.router.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.loadStepForm();
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    let amendmentId = this.dfaAmendmentMainDataService.getAmendmentId();
    let projectId = this.dfaProjectMainDataService.getProjectId();
    
    if (amendmentId) {
      this.dfaAmendmentMainDataService.setAmendmentId(amendmentId);
      this.dfaAmendmentMainDataService.setProjectId(projectId);
      this.getFileUploadsForAmendment(projectId);
    }
    this.formCreationService.clearProjectAmendmentData();
    this.formCreationService.clearFileUploadsData();

    this.vieworedit = this.dfaAmendmentMainDataService.getViewOrEdit();
    this.editstep = this.dfaAmendmentMainDataService.getEditStep();
    
    //this.showStepper = true;
    this.dfaAmendmentMainHeading = 'Amendment Details'

  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param index Step index
   */
  loadStepForm(): void {
    this.form$ = this.formCreationService
      .getProjectAmendmentForm()
      .subscribe((dfaAmendment) => {
        this.form = dfaAmendment;
      });
  }

  ngAfterViewInit(): void {
    
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(): void {
    this.dfaAmendmentMainDataService.amendment = {
      amendmentNumber: this.form.get('amendmentNumber').value,
      amendmentReceivedDate: this.form.get('amendmentReceivedDate').value,
      amendmentReason: this.form.get('amendmentReason').value,
      amendmentApprovedDate: this.form.get('amendmentApprovedDate').value,
      emcrDecisionComments: this.form.get('emcrDecisionComments').value,
      requestforProjectDeadlineExtention: this.form.get('requestforProjectDeadlineExtention').value,
      amendedProjectDeadlineDate: this.form.get('amendedProjectDeadlineDate').value,
      deadlineExtensionApproved: this.form.get('deadlineExtensionApproved').value,
      amended18MonthDeadline: this.form.get('amended18MonthDeadline').value,
      requestforAdditionalProjectCost: this.form.get('requestforAdditionalProjectCost').value,
      estimatedAdditionalProjectCost: this.form.get('estimatedAdditionalProjectCost').value,
      additionalProjectCostDecision: this.form.get('additionalProjectCostDecision').value,
      approvedAdditionalProjectCost: this.form.get('approvedAdditionalProjectCost').value,
      amendmentId: this.form.get('amendmentId').value,
      amendmentDecision: this.form.get('amendmentDecision').value
    }

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

          if (this.form.valid) {
            this.setFormData();
          }

          let objAmendmentDTO = this.dfaAmendmentMainDataService.createDFAAmendmentMainDTO();
          this.dfaAmendmentMainService.upsertProjectAmendment(objAmendmentDTO).subscribe(x => {
            this.BackToDashboard();
          },
            error => {
              console.error(error);
              //document.location.href = 'https://dfa.gov.bc.ca/error.html';
            });
        }
      });
  }

  public getFileUploadsForAmendment(projectId: string) {

    this.fileUploadsService.attachmentGetAmendmentAttachments({ projectId: projectId }).subscribe({
      next: (attachments) => {
        // initialize list of file uploads
        this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').setValue(attachments);

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

import { Component, OnInit, Inject, OnDestroy, Injector, NgModule } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Router } from '@angular/router';
import { mapTo, Subscription } from 'rxjs';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ApplicantOption, InsuranceOption, Profile, CurrentProjectAmendment, ProjectStatusBar, CurrentApplication } from 'src/app/core/api/models';
import { DFAEligibilityDialogComponent } from 'src/app/core/components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { ApplicationService, AttachmentService, AmendmentAttachmentService, EligibilityService, ProfileService, ProjectAmendmentService, ProjectService } from 'src/app/core/api/services';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginService } from 'src/app/core/services/login.service';
import { DFAProjectAmendmentDataService } from 'src/app/feature-components/dfa-project-amendment/dfa-project-amendment-data.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';
import { Decision } from 'src/app/models/decision.enum';
import { DFAGeneralInfoDialogComponent } from 'src/app/core/components/dialog-components/dfa-general-info-dialog/dfa-general-info-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CoreModule } from 'src/app/core/core.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { ReviewProjectModule } from 'src/app/feature-components/review-project/review-project.module';
import { ComponentWrapperModule } from 'src/app/sharedModules/components/component-wrapper/component-wrapper.module';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import moment from 'moment';
import { DFAAmendmentMainDataService } from 'src/app/feature-components/dfa-amendment-main/dfa-amendment-main-data.service';
import { DFAAmendmentMainMappingService } from 'src/app/feature-components/dfa-amendment-main/dfa-amendment-main-mapping.service';
import { FileUploadAmendment } from 'src/app/core/model/dfa-amendment-main.model';
import { AmendmentFileUpload } from 'src/app/core/api/models';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { DFAFileDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';

@Component({
  selector: 'amendment',
  standalone: false,
  templateUrl: './amendment.component.html',
  styleUrls: ['./amendment.component.scss']
})
export default class AmendmentComponent implements OnInit, OnDestroy {
  amendmentForm: UntypedFormGroup;
  amendmentForm$: Subscription;
  fileUploadForm: UntypedFormGroup;
  fileUploadForm$: Subscription;
  formBuilder: UntypedFormBuilder;
  formCreationService: FormCreationService;
  radioApplicantOptions = ApplicantOption;
  radioInsuranceOptions = InsuranceOption;
  showOtherDocuments: boolean = false;
  private _profile: Profile;
  vieworedit: string = "";
  isReadOnly: boolean = false;
  isValidAddressAndDate: boolean = false;
  public isLoggedIn: boolean = false;
  isLoading = false;

  applicationNumber = '';
  appId = null;
  projectId = null;
  caseNumber = '';
  causeOfDamage = '';
  dateOfDamageFrom = '';
  dateOfDamageTo = '';
  OneDayAgo: number = 0;
  injector: Injector;
  serviceInjector: Injector;
  projectAmendment: CurrentProjectAmendment;
  statusBar?: null | Array<ProjectStatusBar>;
  isErrorInStatus?: null | boolean;
  projectName = '';
  DecisionEnum = Decision;

  originalApprovedProjectCost: string;
  deadline18Months: string;

  showSupportingFileForm: boolean = false;
  supportingFilesDataSource = new MatTableDataSource();
  documentSummaryColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate', 'icons']
  amendmentDocumentSummaryDataSource = new MatTableDataSource();
  isDisabled: string = 'false';
  isformUploaddisabled: string = 'false';
  allowedFileTypes = [
    'application/pdf',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  stage: string;
  status: string;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dialog: MatDialog,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    public dfaAmendmentMainDataService: DFAAmendmentMainDataService,
    private applicationService: ApplicationService,
    private projectService: ProjectService,
    private projectAmendmentService: ProjectAmendmentService,
    private router: Router,
    private dfaAmendmentMainMapping: DFAAmendmentMainMappingService,
    private attachmentsService: AttachmentService,
    private amendmentAttachmentService: AmendmentAttachmentService,
    private profileService: ProfileService,
    private eligibilityService: EligibilityService,
    private amendmentDataService: DFAProjectAmendmentDataService,
    private oidcSecurityService: OidcSecurityService,
    private loginService: LoginService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.isReadOnly = (dfaAmendmentMainDataService.getViewOrEdit() === 'view'
      || dfaAmendmentMainDataService.getViewOrEdit() === 'edit'
      || dfaAmendmentMainDataService.getViewOrEdit() === 'viewOnly');
    this.setViewOrEditControls();

    this.dfaAmendmentMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
        || vieworedit === 'edit'
        || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })
    this.vieworedit = dfaAmendmentMainDataService.getViewOrEdit();

    this.fileUploadForm$ = this.formCreationService
      .getAmendmentFileUploadsForm()
      .subscribe((fileUploads) => {
        this.fileUploadForm = fileUploads;
      });

    //this.fileUploadForm.addValidators([this.validateFormRequiredDocumentTypes]);

    // subscribe to changes for document summary
    const _documentSummaryFormArray = this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads');
    _documentSummaryFormArray.valueChanges
      .pipe(
        mapTo(_documentSummaryFormArray.getRawValue())
    ).subscribe(
      _data =>  {
        this.amendmentDocumentSummaryDataSource.data = _documentSummaryFormArray.getRawValue()?.filter(x => x.deleteFlag == false)
    });

    if (this.dfaAmendmentMainDataService.getViewOrEdit() == 'viewOnly') {
      //this.fileUploadForm.disable();
    }
  }

  public get profile(): Profile {
    return this._profile;
  }
  public set profile(value: Profile) {
    this._profile = value;
  }

  setViewOrEditControls() {
    if (!this.amendmentForm) return;
    if (this.isReadOnly) {
      this.amendmentForm.controls.amendmentNumber.disable();
      this.amendmentForm.controls.amendmentReceivedDate.disable();
      this.amendmentForm.controls.amendmentReason.disable();
      this.amendmentForm.controls.amendmentApprovedDate.disable();
      this.amendmentForm.controls.emcrDecisionComments.disable();
      this.amendmentForm.controls.requestforProjectDeadlineExtention.disable();
      this.amendmentForm.controls.amendedProjectDeadlineDate.disable();
      this.amendmentForm.controls.deadlineExtensionApproved.disable();
      this.amendmentForm.controls.amended18MonthDeadline.disable();
      this.amendmentForm.controls.requestforAdditionalProjectCost.disable();
      this.amendmentForm.controls.estimatedAdditionalProjectCost.disable();
      this.amendmentForm.controls.additionalProjectCostDecision.disable();
      this.amendmentForm.controls.approvedAdditionalProjectCost.disable();
      this.amendmentForm.controls.amendmentDecision.disable();
    } else {
      this.amendmentForm.controls.amendmentNumber.enable();
      this.amendmentForm.controls.amendmentReceivedDate.enable();
      this.amendmentForm.controls.amendmentReason.enable();
      this.amendmentForm.controls.amendmentApprovedDate.enable();
      this.amendmentForm.controls.emcrDecisionComments.enable();
      this.amendmentForm.controls.requestforProjectDeadlineExtention.enable();
      this.amendmentForm.controls.amendedProjectDeadlineDate.enable();
      this.amendmentForm.controls.deadlineExtensionApproved.enable();
      this.amendmentForm.controls.amended18MonthDeadline.enable();
      this.amendmentForm.controls.requestforAdditionalProjectCost.enable();
      this.amendmentForm.controls.estimatedAdditionalProjectCost.enable();
      this.amendmentForm.controls.additionalProjectCostDecision.enable();
      this.amendmentForm.controls.approvedAdditionalProjectCost.enable();
      this.amendmentForm.controls.amendmentDecision.enable();
    }
  }

  ngOnInit(): void {
    this.amendmentForm$ = this.formCreationService
      .getProjectAmendmentForm()
      .subscribe((amendment) => {
        this.amendmentForm = amendment;
        this.setViewOrEditControls();
      });

    this.appId = this.dfaProjectMainDataService.getApplicationId(); //this.route.snapshot.paramMap.get('id');
    this.projectId = this.dfaProjectMainDataService.getProjectId();
    this.applicationNumber = 'Application';
    this.getApplicationDetails(this.appId);
    this.getRecoveryPlan(this.projectId);
    this.getAmendmentDetails(this.projectId);

    this.dfaProjectMainDataService.setApplicationId(this.appId);

    if(!this.amendmentForm.value.amendmentReceivedDate){
      this.amendmentForm.controls.amendmentReceivedDate.setValue(new Date());
    }
  }

  disableFormfields(): void {
    this.amendmentForm.controls.amendmentNumber.disable();
    this.amendmentForm.controls.amendmentReceivedDate.disable();
    this.amendmentForm.controls.amendmentReason.disable();
    this.amendmentForm.controls.amendmentApprovedDate.disable();
    this.amendmentForm.controls.emcrDecisionComments.disable();
    this.amendmentForm.controls.requestforProjectDeadlineExtention.disable();
    this.amendmentForm.controls.amendedProjectDeadlineDate.disable();
    this.amendmentForm.controls.deadlineExtensionApproved.disable();
    this.amendmentForm.controls.amended18MonthDeadline.disable();
    this.amendmentForm.controls.requestforAdditionalProjectCost.disable();
    this.amendmentForm.controls.estimatedAdditionalProjectCost.disable();
    this.amendmentForm.controls.additionalProjectCostDecision.disable();
    this.amendmentForm.controls.approvedAdditionalProjectCost.disable();
    this.amendmentForm.controls.amendmentDecision.disable();
  }

  getApplicationDetails(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          if (dfaApplicationMain) {
            this.dateOfDamageFrom = dfaApplicationMain.dateOfDamage;
            this.dateOfDamageTo = dfaApplicationMain.dateOfDamageTo;
            this.caseNumber = dfaApplicationMain.caseNumber ? dfaApplicationMain.caseNumber : "Not Generated";
          }

        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  ConfirmAndGoBack(textContent): string {

    var resultContent = '';

    const content = { text: textContent, cancelButton: 'Close', title: 'Project Amendment' };

    this.dialog
      .open(DFAGeneralInfoDialogComponent, {
        data: {
          content: content
        },
        height: '280px',
        width: '530px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate(['dfa-application/' + this.appId + '/projects']);
      });

    return resultContent;
  }

  getRecoveryPlan(projectId: string) {
    if (projectId) {
      this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
        next: (dfaProjectMain) => {
          if (dfaProjectMain && dfaProjectMain.project) {
            var project = dfaProjectMain.project;

            this.projectName = 'Project - ' + project.projectName + ' (Amended)';
            this.originalApprovedProjectCost = project.approvedCost != null ? project.approvedCost.toString() : "0.00";
            this.deadline18Months = project.project18MonthDeadline != 'Date Not Set' ? project.project18MonthDeadline : null;

            // Set the value immediately if radio is already "Yes"
            if (
              this.amendmentForm.get('requestforProjectDeadlineExtention')?.value === 'Yes' &&
              this.deadline18Months &&
              !this.amendmentForm.get('amendedProjectDeadlineDate')?.value
            ) {
              const dateValue = new Date(this.deadline18Months);
              this.amendmentForm.get('amendedProjectDeadlineDate')?.setValue(dateValue);
            }

            // Subscribe to future changes
            this.amendmentForm.get('requestforProjectDeadlineExtention')?.valueChanges.subscribe(value => {
              if (
                value === 'Yes' &&
                this.deadline18Months &&
                !this.amendmentForm.get('amendedProjectDeadlineDate')?.value
              ) {
                const dateValue = new Date(this.deadline18Months);
                this.amendmentForm.get('amendedProjectDeadlineDate')?.setValue(dateValue);
              }
            });
          }
        },
        error: (error) => {
          //console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  getAmendmentDetails(projectId: string) {
    // Get the specific amendment ID from the data service
    const currentAmendmentId = this.dfaAmendmentMainDataService.getAmendmentId();
    
    if (!currentAmendmentId) {
      console.error('Amendment ID is required but not available');
      return;
    }

    if (projectId) {
      this.projectAmendmentService.projectAmendmentGetDfaProjectAmendments({ projectId: projectId }).subscribe({
        next: (dfaAmendment) => {
          if (dfaAmendment) {
            // Find the specific amendment by ID instead of using the first one
            var amendment = dfaAmendment.find(a => a.amendmentId === currentAmendmentId);
            
            if (amendment){
              this.dfaAmendmentMainMapping.mapDFAAmendmentMain(amendment);
              this.stage = amendment.stage;
              this.status = amendment.status;

              if (!this.amendmentForm.value.amendmentReceivedDate) {
                this.amendmentForm.controls.amendmentReceivedDate.setValue(new Date());
              }
            } else {
              console.warn(`Amendment with ID ${currentAmendmentId} not found in project amendments`);
              let noAmendment = 'Amendment not found!<br/>Click \'Close\' button to go back to Project Dashboard';
              this.ConfirmAndGoBack(noAmendment);
            }
          }
        },
        error: (error) => {
          console.error(error);
          let noAmendment = 'Error in loading details!<br/>Click \'Close\' button to go back to Project Dashboard';
          this.ConfirmAndGoBack(noAmendment);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  ViewApplication(appId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(appId);
    this.dfaApplicationMainDataService.setViewOrEdit('view');

    this.router.navigate(['/dfa-application-main/' + appId]);
  }

  getItems(lst) {
    if (!lst) return false;
    return lst.filter((item) => item.status !== '');
  }

  dontContinueAmendment(content: DialogContent, controlName: string) {
    this.dialog
      .open(DFAEligibilityDialogComponent, {
        data: {
          content: content
        },
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'cancel') {
          this.cancelAmendment();
        }
        else if (result === 'confirm') {
          this.amendmentForm.get(controlName).setValue("true");
        }
        else this.amendmentForm.get(controlName).setValue(null);
      });
  }

  cancelAmendment(): void {
    // TODO: Add application cancellation
    this.router.navigate(['/dfa-dashboard']);
  }

  saveSupportingFiles(fileUpload: FileUploadAmendment): void {
    // dont allow same filename twice
    let fileUploads = this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').value;
    if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
      this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
      this.formCreationService.fileUploadsAmendmentForm.value.get('supportingFilesFileUpload').reset();
      return;
    }

    if (this.fileUploadForm.get('supportingFilesFileUpload').status === 'VALID') {
      this.isLoading = true;
      fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1) // to allow upload as byte array
      //let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
      //this.dfaProjectMainMapping.mapDFAProjectMain(project);
      fileUpload.projectId = this.projectId;
      fileUpload.requiredDocumentType = null;
      this.isLoading = true;

      // Create the amendment file upload payload for the new S3 service
      const amendmentFileUpload: AmendmentFileUpload = {
        projectId: fileUpload.projectId,
        amendmentId: this.dfaAmendmentMainDataService.getAmendmentId(),
        fileName: fileUpload.fileName,
        description: fileUpload.fileDescription,
        fileData: fileUpload.fileData, // This should be base64 string for TypeScript model
        size: fileUpload.fileSize,
        mimeType: fileUpload.contentType,
        uploadedDate: new Date().toISOString(),
        deleteFlag: false,
        category: fileUpload.fileType
      };

      this.amendmentAttachmentService.amendmentAttachmentUpsertAttachment({ body: amendmentFileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [fileUpload];
          this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').setValue(fileUploads);
          this.showSupportingFileForm = !this.showSupportingFileForm;
          // Reset Form fields
          this.formCreationService.fileUploadsAmendmentForm.value.get('supportingFilesFileUpload').reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      this.fileUploadForm.get('supportingFilesFileUpload').markAllAsTouched();
    }
  }

  cancelSupportingFiles(): void {
    this.showSupportingFileForm = !this.showSupportingFileForm;
    this.fileUploadForm.get('addNewFileUploadIndicator').setValue(false);
  }

  confirmDeleteDocumentSummaryRow(element): void {
    this.dialog
      .open(DFAFileDeleteDialogComponent, {
        data: {
          content: "Are you sure you want to delete the supporting document:<br/>" + element.fileName + "?"
        },
        width: '350px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.deleteDocumentSummaryRow(element);
        }
      });
  }

  warningDialog(message: string) {
    this.dialog
      .open(FileUploadWarningDialogComponent, {
        data: {
          content: message
        },
        width: '350px',
        disableClose: true
      });
  }

  deleteDocumentSummaryRow(element): void {
    // For the new S3 service, we use soft delete by setting deleteFlag to true
    if (element.id) {
      // Create payload for soft delete by setting deleteFlag to true
      const softDeletePayload: AmendmentFileUpload = {
        id: element.id,
        projectId: element.projectId,
        amendmentId: this.dfaAmendmentMainDataService.getAmendmentId(),
        fileName: element.fileName,
        description: element.description,
        fileData: null, // No file data needed for soft delete
        size: element.size,
        mimeType: element.contentType || element.mimeType,
        uploadedDate: element.uploadedDate,
        deleteFlag: true, // Mark as deleted
        category: element.category
      };

      this.amendmentAttachmentService.amendmentAttachmentUpsertAttachment({ body: softDeletePayload }).subscribe({
        next: (result) => {
          // Remove from local array after successful soft delete
          let fileUploads = this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').value;
          let index = fileUploads?.indexOf(element);
          if (index > -1) {
            fileUploads.splice(index, 1);
            this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').setValue(fileUploads);
          }
          if (this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').value.length === 0) {
            this.fileUploadForm
              .get('addNewFileUploadIndicator')
              .setValue(false);
          }
        },
        error: (error) => {
          console.error('Error soft deleting amendment attachment:', error);
          this.warningDialog('Failed to delete the document. Please try again.');
        }
      });
    } else {
      // If no ID, just remove from local array (file wasn't saved yet)
      let fileUploads = this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').value;
      let index = fileUploads?.indexOf(element);
      if (index > -1) {
        fileUploads.splice(index, 1);
        this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').setValue(fileUploads);
      }
      if (this.formCreationService.fileUploadsAmendmentForm.value.get('fileUploads').value.length === 0) {
        this.fileUploadForm
          .get('addNewFileUploadIndicator')
          .setValue(false);
      }
    }
  }


  /**
   * Returns the control of the form
   */
  get amendmentFormControl(): { [key: string]: AbstractControl } {
    return this.amendmentForm.controls;
  }

  updateOnVisibility(): void {
    //this.amendmentForm.controls.lossesExceed1000.updateValueAndValidity();
    this.amendmentForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.amendmentForm$.unsubscribe();
  }
}

@NgModule({
  declarations: [AmendmentComponent],
  imports: [
    CommonModule,
    CoreModule,
    AddressFormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    ComponentWrapperModule,
    ReviewProjectModule,
    MatTooltipModule,
    MatTabsModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    DirectivesModule,
    MatTableModule,
    CustomPipeModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [AmendmentComponent]
})
export class AmendmentModule { }

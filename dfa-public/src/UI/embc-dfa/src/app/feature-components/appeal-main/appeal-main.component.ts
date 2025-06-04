import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CurrentApplication, CurrentProjectAppeal, RecoveryPlan } from 'src/app/core/api/models';
import { ApplicationService, ProjectService } from 'src/app/core/api/services';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { AppealDocument } from 'src/app/feature-components/appeal-main/appeal-documents/appeal-documents.component';

/**
 * Public eligibility Appeal main component.
 *
 * @export
 * @class AppealMainComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-appeal-main',
  templateUrl: './appeal-main.component.html',
  styleUrl: './appeal-main.component.scss'
})
export class AppealMainComponent implements OnInit {
  appealForm: FormGroup;
  projectId: string;
  project: RecoveryPlan;
  application: CurrentApplication;
  appeal: CurrentProjectAppeal;

  isLoading: boolean = false;
  isdisabled: boolean = false;
  isReadOnly: boolean = false;

  reasonMaxLength: number = 2000;
  reasonRemainingLength: number = 2000;

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private applicationService: ApplicationService,
    // private attachmentsService: AttachmentService,
    private dialog: MatDialog
  ) {
    this.appealForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        reason: new FormControl(null, [Validators.required])
      }),
      step2: this.formBuilder.group({
        documents: this.formBuilder.array<AppealDocument>([])
      })
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      console.log('Project ID:', this.projectId);
      // load project data including appeal
      this.loadProject(this.projectId);
      // load application data
      // this.loadApplication(this.projectId);
    });
  }

  /**
   * Loads the application data based on the provided application ID.
   *
   * @param {string} applicationId
   * @memberof AppealMainComponent
   */
  loadApplication(applicationId: string) {
    this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
      next: (dfaApplicationMain) => {
        this.application = dfaApplicationMain;
      }
    });
  }

  /**
   * Loads the project data based on the provided project ID.
   *
   * @param {string} projectId
   * @memberof AppealMainComponent
   */
  loadProject(projectId: string) {
    this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
      next: (dfaProjectMain) => {
        console.log('Project Data:', dfaProjectMain);
        if (dfaProjectMain && dfaProjectMain.project)
          // this.projectName = 'Project - ' + dfaProjectMain.project.projectName +' (Amended)';
          this.project = dfaProjectMain.project;
      },
      error: (error) => {
        console.error(error);
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  addDocument() {}

  /**
   * Cancels the appeal process and redirects user.
   *
   * @memberof AppealMainComponent
   */
  cancelAppeal() {}

  /**
   * Submits the appeal form.
   *
   * @memberof AppealMainComponent
   */
  save() {
    console.log('Form Submitted', this.appealForm.value);
    console.log('Form Group', this.appealForm);
  }

  updateReasonRemainingChars() {
    this.reasonRemainingLength = this.reasonMaxLength - this.appealForm.get('step1.reason').value?.length;
  }

  warningDialog(message: string) {
    this.dialog.open(FileUploadWarningDialogComponent, {
      data: {
        content: message
      },
      width: '350px',
      disableClose: true
    });
  }

  // saveRequiredForm(fileUpload: FileUpload): void {
  //   // dont allow same filename twice
  //   let fileUploads = this.appealForm.get('step2.fileUploads').value;

  //   console.log(fileUploads);

  //   if (fileUploads?.find((item) => item.fileName === fileUpload.fileName && item.deleteFlag !== true)) {
  //     this.warningDialog('A document with the name ' + fileUpload.fileName + ' has already been uploaded.');
  //     return;
  //   }

  //   this.isLoading = true;

  //   // let project = this.dfaProjectMainDataService.createDFAProjectMainDTO();
  //   // fileUpload.project = project;

  //   fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1); // to allow upload as byte array

  //   if (fileUploads?.filter((x) => x.requiredDocumentType === fileUpload.requiredDocumentType).length > 0) {
  //     this.attachmentsService.attachmentUpsertDeleteProjectAttachment({ body: fileUpload }).subscribe({
  //       next: (fileUploadId) => {
  //         fileUpload.id = fileUploadId;

  //         let requiredDocumentTypeFoundIndex = fileUploads.findIndex(
  //           (x) => x.requiredDocumentType === fileUpload.requiredDocumentType
  //         );

  //         fileUploads[requiredDocumentTypeFoundIndex] = fileUpload;

  //         this.appealForm.get('step2.fileUploads').setValue(fileUploads);

  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error(error);

  //         this.isLoading = false;
  //         document.location.href = 'https://dfa.gov.bc.ca/error.html';
  //       }
  //     });
  //   } else {
  //     this.attachmentsService.attachmentUpsertDeleteProjectAttachment({ body: fileUpload }).subscribe({
  //       next: (fileUploadId) => {
  //         fileUpload.id = fileUploadId;

  //         if (fileUploads) {
  //           fileUploads.push(fileUpload);
  //         } else {
  //           fileUploads = [fileUpload];
  //         }

  //         this.appealForm.get('step2.fileUploads').setValue(fileUploads);
  //         //if (fileUpload.requiredDocumentType == Object.keys(this.RequiredDocumentTypes)[Object.values(this.RequiredDocumentTypes).indexOf(this.RequiredDocumentTypes.TenancyAgreement)])
  //         //  this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(true);
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error(error);

  //         this.isLoading = false;
  //         document.location.href = 'https://dfa.gov.bc.ca/error.html';
  //       }
  //     });
  //   }
  // }
}

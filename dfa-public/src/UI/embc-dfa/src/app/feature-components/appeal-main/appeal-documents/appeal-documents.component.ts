import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, FormGroupDirective, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CurrentApplication, CurrentProjectAppeal, FileCategory, FileCategoryAppeal, FileUploadProjectAppeal, RecoveryPlan } from 'src/app/core/api/models';
import { AttachmentService } from 'src/app/core/api/services';
import { DfaAttachmentComponent } from 'src/app/core/components/dfa-attachment/dfa-attachment.component';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { DFAClaimAppealDataService } from '../appeal-data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DFAFileDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';
import { mapTo } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

/**
 * Appeal Documents Component.
 *
 * Renders the drag-and-drop file upload area for appeal documents.
 * Renders the list of selected documents.
 * Does not upload selected documents to the backend.
 *
 * @export
 * @class AppealDocumentsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-appeal-documents',
  standalone: false,
  templateUrl: './appeal-documents.component.html',
  styleUrl: './appeal-documents.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AppealDocumentsComponent implements OnInit {
  // TODO: Remove unused imports
  @Input() projectId: string;
  @Input() project: RecoveryPlan;
  @Input() application: CurrentApplication;
  @Input() appeal: CurrentProjectAppeal;
  @Input() isDisabled: boolean = false;
  @Input() documentsData: FileUploadProjectAppeal[];
  @Input() vieworedit : string;
  @Input() appealId: string;
  /**
   * Callback fired when the remove document button is clicked.
   *
   * @memberof AppealDocumentsComponent
   */
  @Input() onRemoveDocument: (index: number) => void;

  noOfAttachments: number = 10;
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
  allowedFileExtensionsList = '.pdf, .doc, .docx, .png, .jpeg, .jpg, .ppt, .pptx, .xls, .xlsx';

  fileDescriptionMaxLength: number = 100;

  appealForm: FormGroup;
  showSupportingFileForm: boolean = false;
  isLoading: boolean = false;
  isdisabled: string = 'false';
  fileUploadsProjectAppealForm: UntypedFormGroup = this.formCreationService.fileUploadsProjectAppealForm;
  projectAppealDocumentSummaryColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate']
  projectAppealDocumentSummaryDataSource = new MatTableDataSource<FileUploadProjectAppeal>();

  constructor(
    private dialog: MatDialog,
    public controlContainer: ControlContainer,
    public attachmentService: AttachmentService,
    public dfaClaimAppealDataService: DFAClaimAppealDataService,
    private formCreationService: FormCreationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.appealForm = this.controlContainer.control as FormGroup;
    

    // subscribe to changes for document summary
    const _projectAppealDocumentSummaryFormArray = this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads');
    _projectAppealDocumentSummaryFormArray.valueChanges
      .pipe(
        mapTo(_projectAppealDocumentSummaryFormArray.getRawValue())
      ).subscribe(
        _data => {
          this.projectAppealDocumentSummaryDataSource.data = _projectAppealDocumentSummaryFormArray.getRawValue()?.filter(x => x.deleteFlag == false)
        });

    this.projectAppealDocumentSummaryDataSource.data = this.documentsData.filter(x => x.deleteFlag == false);

    if (this.vieworedit !== 'view') {
      this.projectAppealDocumentSummaryColumnsToDisplay.push('icons');
    }
  }

  

  saveSupportingFiles(fileUpload: FileUploadProjectAppeal) {
    console.log("saveSupportingFilesProjectAppeals", fileUpload);
    // dont allow same filename twice
    let fileUploads = this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').value;
    if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
      this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
      this.formCreationService.fileUploadsProjectAppealForm.get('supportingFilesFileUpload').reset();
      return;
    }

    if (this.formCreationService.fileUploadsProjectAppealForm.get('supportingFilesFileUpload').status === 'VALID') {
      this.isLoading = true;
      fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1); // to allow upload as byte array
      fileUpload.appealId =  this.appealId;
      fileUpload.requiredDocumentType = null;

      this.attachmentService.attachmentUpsertDeleteProjectAppealAttachment({ body: fileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [fileUpload];
          this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').setValue(fileUploads);
          this.showSupportingFileForm = !this.showSupportingFileForm;
          // Reset Form feilds
          this.formCreationService.fileUploadsProjectAppealForm.get('supportingFilesFileUpload').reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          // document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }

  }

  cancelSupportingFiles(): void {
    this.showSupportingFileForm = !this.showSupportingFileForm;
    this.formCreationService.fileUploadsProjectAppealForm.get('addNewFileUploadIndicator').setValue(false);
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

  deleteDocumentSummaryRow(element): void {
    // For the new S3 service, we use soft delete by setting deleteFlag to true
    if (element.id) {
      // Create payload for soft delete by setting deleteFlag to true
      const softDeletePayload: FileUploadProjectAppeal = {
        id: element.id,
        appealId:  this.appealId ,
        fileName: element.fileName,
        fileDescription: element.description,
        fileData: null, // No file data needed for soft delete
        fileSize: element.size,
        contentType: element.contentType || element.mimeType,
        uploadedDate: element.uploadedDate,
        deleteFlag: true, // Mark as deleted
        fileType: element.category
      };

      this.attachmentService.attachmentUpsertDeleteProjectAppealAttachment({ body: softDeletePayload }).subscribe({
        next: (result) => {
          // Remove from local array after successful soft delete
          let fileUploads = this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').value;
          let index = fileUploads?.indexOf(element);
          if (index > -1) {
            fileUploads.splice(index, 1);
            this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').setValue(fileUploads);
          }
          if (this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').value.length === 0) {
            this.fileUploadsProjectAppealForm
              .get('addNewFileUploadIndicator')
              .setValue(false);
          }
        },
        error: (error) => {
          console.error('Error soft deleting Project Appeal attachment:', error);
          this.warningDialog('Failed to delete the document. Please try again.');
        }
      });
    } else {
      // If no ID, just remove from local array (file wasn't saved yet)
      let fileUploads = this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').value;
      let index = fileUploads?.indexOf(element);
      if (index > -1) {
        fileUploads.splice(index, 1);
        this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').setValue(fileUploads);
      }
      if (this.formCreationService.fileUploadsProjectAppealForm.get('fileUploads').value.length === 0) {
        this.fileUploadsProjectAppealForm
          .get('addNewFileUploadIndicator')
          .setValue(false);
      }
    }
  }

  warningDialog(message: string) {
    this.dialog.open(FileUploadWarningDialogComponent, {
      data: {
        content: message
      },
      width: '500px',
      disableClose: true
    });
  }
}

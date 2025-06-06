import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CurrentApplication, CurrentProjectAppeal, RecoveryPlan } from 'src/app/core/api/models';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';

export type AppealDocument = {
  fileName: string;
  fileDescription: string;
  fileData: string | ArrayBuffer;
  contentType: 'Appeal Support'; // TODO: Update to use FileCategory type when available
  fileSize: number;
  uploadedDate: Date;
};

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
  @Input() isReadOnly: boolean = false;
  @Input() isDisabled: boolean = false;
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

  constructor(
    private dialog: MatDialog,
    public controlContainer: ControlContainer
  ) {}

  ngOnInit() {
    this.appealForm = this.controlContainer.control as FormGroup;
  }

  /**
   * Handles the file attachment event.
   *
   * @param {*} event
   * @memberof AppealDocumentsComponent
   */
  onAttachedFile(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      const documents = this.appealForm.get('step2.documents') as FormArray;

      // Show warning and exit early if a document already exists with the same file name
      if (documents.controls.some((document) => document.get('fileName')?.value === event.name)) {
        this.warningDialog('A file with the name ' + event.name + ' has already been added.');
        return;
      }

      documents.push(
        new FormGroup({
          fileName: new FormControl(event.name),
          fileDescription: new FormControl(event.name, [
            Validators.required,
            Validators.maxLength(this.fileDescriptionMaxLength)
          ]),
          fileData: new FormControl(reader.result),
          contentType: new FormControl('Appeal Support'),
          fileSize: new FormControl(event.size),
          uploadedDate: new FormControl(new Date())
        })
      );
    };
  }

  /**
   * Opens a warning dialog with the provided message.
   *
   * @param {string} message
   * @memberof AppealDocumentsComponent
   */
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

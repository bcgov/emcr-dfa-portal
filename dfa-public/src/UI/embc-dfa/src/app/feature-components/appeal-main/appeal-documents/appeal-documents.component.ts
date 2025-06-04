import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CurrentApplication, CurrentProjectAppeal, RecoveryPlan } from 'src/app/core/api/models';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';

export type AppealDocument = {
  fileName: string;
  fileDescription: string;
  fileData: string | ArrayBuffer;
  contentType: 'Appeal Support';
  fileSize: number;
  uploadedDate: Date;
};

/**
 * Appeal Documents Component.
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
  @Input() projectId: string;
  @Input() project: RecoveryPlan;
  @Input() application: CurrentApplication;
  @Input() appeal: CurrentProjectAppeal;

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

  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    public controlContainer: ControlContainer
  ) {}

  ngOnInit() {
    this.form = this.controlContainer.control as FormGroup;
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
      const documents = this.form.get('step2.documents') as FormArray;

      // Show warning and exit early if a document already exists with the same file name
      if (documents.controls.some((document) => document.get('fileName')?.value === event.name)) {
        this.warningDialog('TEST');
        return;
      }

      documents.push(
        new FormGroup({
          fileName: new FormControl(event.name),
          fileDescription: new FormControl(event.name),
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
      width: '350px',
      disableClose: true
    });
  }
}

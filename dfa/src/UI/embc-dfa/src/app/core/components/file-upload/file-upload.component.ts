import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import * as constant from 'src/app/core/services/globalConstants';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() attachedFile = new EventEmitter<any>();
  @Input() noOfAttachments: number;
  @Input() allowedFileTypes: string[];
  @Input() allowedFileExtensionsList: string;
  fileAttachments: string[] = [];
  attachSizeError = false;
  maxFileSize: number = 45 * 1024 * 1024;  // MB

  constructor(
    public dialog: MatDialog
  ) {}

  /**
   * Listens to file drop event and filters the dropped files before attaching
   * to the form
   *
   * @param event : File drop event
   */
  onFileDropped(event: any) {
    if (this.attachSizeError) {
      this.attachSizeError = !this.attachSizeError;
    }
    for (const e of event) {
      if (!(e.size > 0)) {
        this.warningDialog(constant.zeroFileMessage);
      } else if (!(e.size <= this.maxFileSize)) {
        this.warningDialog(`${constant.fileTooLargeMessage}${(this.maxFileSize / 1048576).toFixed(2)}MB`);
      } else if (!this.allowedFileTypes?.includes(e.type)) {
        this.warningDialog(constant.fileTypeMessage);
      } else if (!constant.fileNameFormat.test(e.name)) {
        this.warningDialog(constant.invalidFileNameMessage);
      } else if (
        this.fileAttachments !== undefined &&
        this.fileAttachments.length >= this.noOfAttachments
      ) {
        this.attachSizeError = true;
        setTimeout(
          function () {
            this.attachSizeError = false;
          }.bind(this),
          4500
        );
      } else {
        this.fileAttachments.push(e.name);
        this.attachedFile.emit(e);
      }
    }
  }

 warningDialog(message: string) {
    this.dialog
      .open(FileUploadWarningDialogComponent, {
        data: {
          content: message
        },
        // height: '250px',
        width: '350px',
        disableClose: true
      });
  }
}

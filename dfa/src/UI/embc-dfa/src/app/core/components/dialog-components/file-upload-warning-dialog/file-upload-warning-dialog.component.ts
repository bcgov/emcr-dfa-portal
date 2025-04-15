import { Component, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-warning-dialog',
  standalone: false,
  templateUrl: './file-upload-warning-dialog.component.html',
  styleUrls: ['./file-upload-warning-dialog.component.scss']
})
export class FileUploadWarningDialogComponent {
  public content: DialogContent;

  constructor(public dialogRef: MatDialogRef<FileUploadWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.content = this.data.content;
  }

  cancel() {
    this.dialogRef.close('cancel');
  }
}

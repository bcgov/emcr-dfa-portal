import { Component, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-secondary-applicant-warning-dialog',
  standalone: false,
  templateUrl: './secondary-applicant-warning-dialog.component.html',
  styleUrls: ['./secondary-applicant-warning-dialog.component.scss']
})
export class SecondaryApplicantWarningDialogComponent {
  public content: DialogContent;

  constructor(public dialogRef: MatDialogRef<SecondaryApplicantWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.content = this.data.content;
  }

  cancel() {
    this.dialogRef.close('cancel');
  }
}

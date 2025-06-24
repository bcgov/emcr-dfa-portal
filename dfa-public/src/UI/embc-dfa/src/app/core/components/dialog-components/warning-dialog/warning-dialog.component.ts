import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  standalone: false,
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent {
  public title: string;
  public content: string;

  constructor(
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string }
  ) {
    this.title = this.data.title;
    this.content = this.data.content;
  }

  cancel() {
    this.dialogRef.close('cancel');
  }
}

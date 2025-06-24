import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogContent } from 'src/app/core/model/dialog-content.model';

@Component({
  standalone: true,
  selector: 'app-appeal-decision-dialog',
  templateUrl: './dfa-confirm-claim-begin-appeal-dialog.component.html',
  styleUrls: ['./dfa-confirm-claim-begin-appeal-dialog.component.scss'],
  imports: [MatDialogModule]
})
export class AppealDecisionDialogComponent  {
  public content: DialogContent;

  constructor(
    public dialogRef: MatDialogRef<AppealDecisionDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.content = this.data.content;
  }

  cancel() {
    this.dialogRef.close(true);
  }

  beginAppealProcess(): void {
    this.dialogRef.close(true);
  }
}

import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<AppealDecisionDialogComponent >
  ) {}

  cancel() {
    this.dialogRef.close(true);
  }

  beginAppealProcess(): void {
    this.dialogRef.close(true);
  }
}

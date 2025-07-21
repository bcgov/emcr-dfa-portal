import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CaseEligibility } from 'src/app/core/model/caseEligibilityEnum';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';


@Component({
  standalone: true,
  selector: 'app-appeal-confirmation-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './appeal-confirmation-dialog.component.html',
  styleUrl: './appeal-confirmation-dialog.component.scss'
})
export class AppealConfirmationDialogComponent {

  public content: any;
   CaseElibilityEnum = CaseEligibility;
   
  constructor(
    public dialogRef: MatDialogRef<AppealConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { content: any },
    private router: Router,
    private dfaAppealDataService: DFAAppealDataService
  ) {
    this.content = this.data.content;
  }

  confirmAppeal() {
    const caseId = this.content.caseId;
    const type = this.content.type;
    if (!caseId || !type) {
      this.dialogRef.close();
      return;
    }
    this.dfaAppealDataService.setCaseDetails(this.content);
    this.dialogRef.close();
    this.router.navigate([`/dfa-appeal/${type}/${caseId}/new`]);
  }

  cancel() {
    this.dialogRef.close('cancel');
  }

}

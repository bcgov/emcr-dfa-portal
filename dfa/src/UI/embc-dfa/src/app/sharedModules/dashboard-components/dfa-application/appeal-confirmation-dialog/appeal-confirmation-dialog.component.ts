import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CaseEligibility } from 'src/app/core/model/caseEligibilityEnum';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';
import { AppealService } from 'src/app/core/api/services/appeal.service';

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
    private dfaAppealDataService: DFAAppealDataService,
    private dfaAppealService: AppealService,
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

    this.dfaAppealService.appealCreateAppeal({
      body: {
        caseId: caseId,
        type: type,
      }
    }).subscribe({
      next: (appealId) => {
      
        console.log('Appeal created successfully:', appealId);
        //this.dfaAppealDataService.setCaseDetails(this.content);
        this.dialogRef.close(appealId);
      },
      error: (error) => {
        console.log('Appeal creation failed', error);
      }
    });
   
  }

  cancel() {
    this.dialogRef.close(null);
  }

}

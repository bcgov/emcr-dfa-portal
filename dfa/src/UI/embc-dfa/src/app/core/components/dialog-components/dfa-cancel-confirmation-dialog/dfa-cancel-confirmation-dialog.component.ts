import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DialogContent } from 'src/app/core/model/dialog-content.model';

@Component({
  standalone: true,
  selector: 'app-cancel-confirmation-dialog',
  templateUrl: './dfa-cancel-confirmation-dialog.component.html',
  styleUrls: ['./dfa-cancel-confirmation-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule ]
})
export class CancelConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogContent
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
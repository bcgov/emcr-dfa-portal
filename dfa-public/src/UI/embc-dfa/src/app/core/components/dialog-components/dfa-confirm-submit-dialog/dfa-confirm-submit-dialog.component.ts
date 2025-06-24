import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-submit-dialog',
  standalone: false,
  templateUrl: './dfa-confirm-submit-dialog.component.html',
  styleUrls: ['./dfa-confirm-submit-dialog.component.scss']
})
export class DFAConfirmSubmitDialogComponent {
  public content: DialogContent;
  public header: string = 'Submit Application Confirmation';
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DFAConfirmSubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.content = this.data.content;
      if (this.data.header) {
        this.header = this.data.header;
      }
    }

  cancel() {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }
}

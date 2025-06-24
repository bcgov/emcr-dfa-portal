import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dfa-application-submission-msg-dialog',
  standalone: false,
  templateUrl: './dfa-application-submission-msg.component.html',
  styleUrls: ['./dfa-application-submission-msg.component.scss']
})
export class DFAApplicationSubmissionMsgDialogComponent {
  public content: DialogContent;
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DFAApplicationSubmissionMsgDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.content = this.data.content;
    }

  close() {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }
}

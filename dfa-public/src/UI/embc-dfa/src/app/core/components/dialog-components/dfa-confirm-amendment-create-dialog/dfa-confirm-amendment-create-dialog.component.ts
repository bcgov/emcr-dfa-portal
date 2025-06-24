import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-amendment-create-dialog',
  standalone: false,
  templateUrl: './dfa-confirm-amendment-create-dialog.component.html',
  styleUrls: ['./dfa-confirm-amendment-create-dialog.component.scss']
})
export class DFAConfirmAmendmentCreateDialogComponent {
  public content: DialogContent;
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<DFAConfirmAmendmentCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.content = this.data.content;
    }

  cancel() {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }
}

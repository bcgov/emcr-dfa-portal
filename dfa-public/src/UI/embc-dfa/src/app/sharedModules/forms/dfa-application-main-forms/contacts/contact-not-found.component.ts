import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-not-found',
  standalone: false,
  templateUrl: './contact-not-found.component.html',
  styleUrl: './contact-not-found.component.scss'
})
export class ContactNotFoundComponent {

  constructor(
    public dialogRef: MatDialogRef<ContactNotFoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    { }

  close() {
    this.dialogRef.close('cancel');
  }
}

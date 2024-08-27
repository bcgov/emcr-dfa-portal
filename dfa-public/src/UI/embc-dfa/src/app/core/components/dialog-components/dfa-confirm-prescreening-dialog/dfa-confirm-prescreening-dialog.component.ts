import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthModule, AuthOptions, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-confirm-prescreening-dialog',
  templateUrl: './dfa-confirm-prescreening-dialog.component.html',
  styleUrls: ['./dfa-confirm-prescreening-dialog.component.scss']
})
export class DFAConfirmPrescreeningDialogComponent {
  public content: DialogContent;
  @Input() initDialog: boolean;
  @Output() outputEvent = new EventEmitter<string>();
  public isLoggedIn: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DFAConfirmPrescreeningDialogComponent>,
    private oidcSecurityService: OidcSecurityService,
    loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.content = this.data.content;
    // 2024-05-27 EMCRI-217 waynezen: use new BCeID async Auth
    if (this.oidcSecurityService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false
    }
  }

  cancel() {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    this.dialogRef.close('confirm');
  }
}

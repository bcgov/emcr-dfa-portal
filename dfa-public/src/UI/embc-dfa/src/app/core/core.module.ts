import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AlertComponent } from './components/alert/alert.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { InformationDialogComponent } from './components/dialog-components/information-dialog/information-dialog.component';
import { BcscInviteDialogComponent } from './components/dialog-components/bcsc-invite-dialog/bcsc-invite-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EnvironmentBannerComponent } from './layout/environment-banner/environment-banner.component';
import { HttpClient } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { TimeOutDialogComponent } from './components/dialog-components/time-out-dialog/time-out-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CaptchaV2Component } from './components/captcha-v2/captcha-v2.component';
import { SignatureComponent } from './components/signature/signature.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DfaAttachmentComponent } from './components/dfa-attachment/dfa-attachment.component';
import { DFAEligibilityDialogComponent } from './components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import { DFAConfirmSubmitDialogComponent } from './components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { DFAConfirmPrescreeningDialogComponent } from './components/dialog-components/dfa-confirm-prescreening-dialog/dfa-confirm-prescreening-dialog.component';
import { FileUploadWarningDialogComponent } from './components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { DFAFileDeleteDialogComponent } from './components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';
import { DFACleanuplogDeleteDialogComponent } from './components/dialog-components/dfa-cleanuplog-delete-dialog/dfa-cleanuplog-delete.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { DirectivesModule } from './directives/directives.module';
import { MatSelectModule } from '@angular/material/select';
import { DFAApplicationAlertDialogComponent } from './components/dialog-components/dfa-application-alert-dialog/dfa-application-alert.component';
import { DFADeleteConfirmDialogComponent } from './components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { AddressChangeComponent } from './components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAConfirmDashboardNavigationDialogComponent } from './components/dialog-components/dfa-confirm-dashboard-navigation/dfa-confirm-dashboard-navigation.component';
import { SecondaryApplicantWarningDialogComponent } from './components/dialog-components/secondary-applicant-warning-dialog/secondary-applicant-warning-dialog.component';
import { DFAApplicationSubmissionMsgDialogComponent } from './components/dialog-components/dfa-application-submission-msg-dialog/dfa-application-submission-msg.component';
import { DFADeleteConfirmInvoiceDialogComponent } from './components/dialog-components/dfa-confirm-delete-invoice-dialog/dfa-confirm-delete-invoice.component';
import { DFAConfirmClaimCreateDialogComponent } from './components/dialog-components/dfa-confirm-claim-create-dialog/dfa-confirm-claim-create-dialog.component';
import { DFAConfirmProjectCreateDialogComponent } from './components/dialog-components/dfa-confirm-project-create-dialog/dfa-confirm-project-create-dialog.component';
import { DFAGeneralInfoDialogComponent } from './components/dialog-components/dfa-general-info-dialog/dfa-general-info-dialog.component';
import { ContactNotFoundComponent } from 'src/app/sharedModules/forms/dfa-application-main-forms/contacts/contact-not-found.component';
import { WarningDialogComponent } from 'src/app/core/components/dialog-components/warning-dialog/warning-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    DirectivesModule,
    MarkdownModule.forRoot({ loader: HttpClient })
  ],
  declarations: [
    AppLoaderComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    SignatureComponent,
    FileUploadComponent,
    DfaAttachmentComponent,
    InformationDialogComponent,
    DFAEligibilityDialogComponent,
    DFAConfirmSubmitDialogComponent,
    DFAConfirmPrescreeningDialogComponent,
    FileUploadWarningDialogComponent,
    DFAFileDeleteDialogComponent,
    DFACleanuplogDeleteDialogComponent,
    BcscInviteDialogComponent,
    EnvironmentBannerComponent,
    TimeOutDialogComponent,
    DFAApplicationAlertDialogComponent,
    DFADeleteConfirmDialogComponent,
    AddressChangeComponent,
    DFAConfirmDashboardNavigationDialogComponent,
    SecondaryApplicantWarningDialogComponent,
    DFAApplicationSubmissionMsgDialogComponent,
    DFADeleteConfirmInvoiceDialogComponent,
    DFAConfirmClaimCreateDialogComponent,
    DFAConfirmProjectCreateDialogComponent,
    DFAGeneralInfoDialogComponent,
    ContactNotFoundComponent,
    WarningDialogComponent
  ],
  exports: [
    AppLoaderComponent,
    AlertComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    SignatureComponent,
    FileUploadComponent,
    DfaAttachmentComponent,
    EnvironmentBannerComponent,
    DFAEligibilityDialogComponent,
    DFAConfirmSubmitDialogComponent,
    DFAConfirmPrescreeningDialogComponent,
    FileUploadWarningDialogComponent,
    DFAFileDeleteDialogComponent,
    DFACleanuplogDeleteDialogComponent,
    TimeOutDialogComponent,
    MatToolbarModule,
    MatButtonModule,
    DFAApplicationAlertDialogComponent,
    DFADeleteConfirmDialogComponent,
    AddressChangeComponent,
    DFAConfirmDashboardNavigationDialogComponent,
    SecondaryApplicantWarningDialogComponent,
    DFAApplicationSubmissionMsgDialogComponent,
    DFADeleteConfirmInvoiceDialogComponent,
    DFAConfirmClaimCreateDialogComponent,
    DFAGeneralInfoDialogComponent,
    DFAConfirmProjectCreateDialogComponent,
    ContactNotFoundComponent,
    WarningDialogComponent
  ]
})
export class CoreModule {}

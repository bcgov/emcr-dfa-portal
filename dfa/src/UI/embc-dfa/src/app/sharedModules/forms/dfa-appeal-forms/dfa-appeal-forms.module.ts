import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from 'src/app/core/core.module';
import CaseDetailsComponent from 'src/app/sharedModules/components/case-details/case-details.component';
import { AppealFileUploadComponent } from 'src/app/sharedModules/forms/dfa-appeal-forms/supporting-documents/appeal-file-upload/appeal-file-upload.component';
import SupportingDocumentsComponent from 'src/app/sharedModules/forms/dfa-appeal-forms/supporting-documents/supporting-documents.component';
import AppealReasonComponent from './appeal-reason/appeal-reason.component';
import SignAndSubmitComponent from './sign-and-submit/sign-and-submit.component';

@NgModule({
  declarations: [
    AppealReasonComponent,
    SupportingDocumentsComponent,
    SignAndSubmitComponent,
    CaseDetailsComponent,
    AppealFileUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    CoreModule,
    MatTableModule
  ],
  exports: [AppealReasonComponent, SupportingDocumentsComponent, SignAndSubmitComponent],
  providers: [DatePipe]
})
export class DfaAppealFormsModule {}

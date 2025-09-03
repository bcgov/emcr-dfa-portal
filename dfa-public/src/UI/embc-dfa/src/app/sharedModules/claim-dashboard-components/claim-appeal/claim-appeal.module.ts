/* import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from 'src/app/core/core.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppealFileUploadComponent } from './appeal-file-upload/appeal-file-upload.component';
import SupportingDocumentsClaimAppealComponent from './supporting-documents/supporting-documents-claim-appeal.component';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@NgModule({
  declarations: [
    AppealFileUploadComponent,
    SupportingDocumentsClaimAppealComponent 
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
    MatTableModule,
    MatCheckboxModule
  ],
  exports: [AppealFileUploadComponent, SupportingDocumentsClaimAppealComponent],
  providers: [FormCreationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClaimAppealModule {}
 */
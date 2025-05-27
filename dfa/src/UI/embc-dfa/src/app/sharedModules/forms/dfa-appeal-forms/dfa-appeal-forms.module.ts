import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { CoreModule } from 'src/app/core/core.module';
import CaseDetailsComponent from '../../components/case-details/case-details.component';
import AppealReasonComponent from './appeal-reason/appeal-reason.component';
import SignAndSubmitComponent from './sign-and-submit/sign-and-submit.component';

@NgModule({
  declarations: [
    AppealReasonComponent,
    SignAndSubmitComponent,
    CaseDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CoreModule
  ],
  exports: [
    AppealReasonComponent,
    SignAndSubmitComponent
  ],
  providers: [
    DatePipe
  ]
})
export class DfaAppealFormsModule { }
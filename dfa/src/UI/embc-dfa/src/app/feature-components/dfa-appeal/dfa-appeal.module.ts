import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { CancelConfirmationDialogComponent } from 'src/app/core/components/dialog-components/dfa-cancel-confirmation-dialog/dfa-cancel-confirmation-dialog.component';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { DfaAppealFormsModule } from '../../sharedModules/forms/dfa-appeal-forms/dfa-appeal-forms.module';
import { DfaAppealRoutingModule } from './dfa-appeal-routing.module';
import { DfaAppealComponent } from './dfa-appeal.component';

@NgModule({
  declarations: [DfaAppealComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DfaAppealFormsModule,
    DfaAppealRoutingModule,
    ComponentWrapperModule,
    CancelConfirmationDialogComponent
  ],
  exports: [DfaAppealComponent]
})
export class DfaAppealModule {}

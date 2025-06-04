import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { DfaAppealFormsModule } from '../../sharedModules/forms/dfa-appeal-forms/dfa-appeal-forms.module';
import { DfaAppealRoutingModule } from './dfa-appeal-routing.module';
import { DfaAppealComponent } from './dfa-appeal.component';

@NgModule({
  declarations: [
    DfaAppealComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    DfaAppealFormsModule,
    DfaAppealRoutingModule,
    ComponentWrapperModule
  ],
  exports: [
    DfaAppealComponent
  ]
})
export class DfaAppealModule { }



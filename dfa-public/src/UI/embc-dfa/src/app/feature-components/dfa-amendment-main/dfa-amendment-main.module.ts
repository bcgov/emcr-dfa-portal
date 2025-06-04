import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { CoreModule } from '../../core/core.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DFAAmendmentMainRoutingModule } from './dfa-amendment-main-routing.module';
import { DFAAmendmentMainComponent } from './dfa-amendment-main.component';
import { ReviewAmendmentModule } from '../review-amendment/review-amendment.module';

@NgModule({
  declarations: [DFAAmendmentMainComponent],
  imports: [
    CommonModule,
    DFAAmendmentMainRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    ComponentWrapperModule,
    ReviewAmendmentModule,
    CoreModule,
    MatTooltipModule
  ]
})
export class DFAAmendmentMainModule {}

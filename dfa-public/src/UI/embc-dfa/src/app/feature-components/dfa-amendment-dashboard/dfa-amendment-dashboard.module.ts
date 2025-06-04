import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DFAAmendmentComponent } from './dfa-amendment-dashboard.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewProjectModule } from '../review-project/review-project.module';
import { CoreModule } from '../../core/core.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { DFAAmendmentRoutingModule } from './dfa-amendment-dashboard-routing.module';

@NgModule({
  declarations: [DFAAmendmentComponent],
  imports: [
    CommonModule,
    DFAAmendmentRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    ComponentWrapperModule,
    ReviewProjectModule,
    CoreModule,
    MatTooltipModule,
    MatTabsModule
  ]
})
export class DFAAmendmentModule {}

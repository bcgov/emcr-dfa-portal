import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppealRoutingModule } from './appeal-main-routing.module';
import { AppealMainComponent } from './appeal-main.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../review/review.module';
import { CoreModule } from '../../core/core.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AppealMainComponent],
  imports: [
    CommonModule,
    AppealRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    ComponentWrapperModule,
    ReviewModule,
    CoreModule,
    MatTooltipModule
  ]
})
export class AppealMainModule {}

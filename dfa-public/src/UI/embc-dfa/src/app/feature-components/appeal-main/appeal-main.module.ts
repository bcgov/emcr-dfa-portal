import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from '../../core/core.module';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../review/review.module';
import { AppealRoutingModule } from './appeal-main-routing.module';
import { AppealMainComponent } from './appeal-main.component';

@NgModule({
  declarations: [AppealMainComponent],
  imports: [
    AppealRoutingModule,
    CommonModule,
    ComponentWrapperModule,
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ReviewModule
  ]
})
export class AppealMainModule {}

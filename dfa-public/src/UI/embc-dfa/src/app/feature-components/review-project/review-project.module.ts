import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewProjectComponent } from './review-project.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from '../../core/pipe/customPipe.module';
import { CoreModule } from '../../core/core.module';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - using new ng-recaptcha-2
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { DashReviewProjectRoutingModule } from './review-project-routing.module';

@NgModule({
  declarations: [ReviewProjectComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CustomPipeModule,
    CoreModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    ReactiveFormsModule,
    DashReviewProjectRoutingModule
  ],
  exports: [ReviewProjectComponent]
})
export class ReviewProjectModule {}

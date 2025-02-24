import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewComponent } from './review.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from '../../core/pipe/customPipe.module';
import { CoreModule } from '../../core/core.module';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - using new ng-recaptcha-2
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { CaptchaV2Component } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { DashReviewRoutingModule } from './review-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { AddressFormsModule } from 'src/app/sharedModules/forms/address-forms/address-forms.module';

@NgModule({
  declarations: [ReviewComponent, CaptchaV2Component],
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
    DashReviewRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatInputModule,
    DirectivesModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    AddressFormsModule
  ],
  exports: [ReviewComponent]
})
export class ReviewModule {}

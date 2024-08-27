import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonDetailFormComponent } from '../person-detail-form/person-detail-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DirectivesModule } from '../../../core/directives/directives.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';


@NgModule({
  declarations: [PersonDetailFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DirectivesModule,
    MatCheckboxModule,
    // 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - new text mask provider
    NgxMaskDirective, NgxMaskPipe,
  ],
  exports: [PersonDetailFormComponent]
})
export class PersonDetailFormModule {}

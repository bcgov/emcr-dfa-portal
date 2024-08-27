import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  AbstractControl,
  UntypedFormControl,
  NgForm,
  FormGroupDirective
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatCheckboxChange
} from '@angular/material/checkbox';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/core/services/login.service';

export class CustomErrorMailMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) || control.parent.hasError('emailMatch')
    );
  }
}

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export default class ContactInfoComponent implements OnInit, OnDestroy {
  contactInfoForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  contactInfoForm$: Subscription;
  formCreationService: FormCreationService;
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  emailMatcher = new CustomErrorMailMatcher();

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public dialog: MatDialog,
    private loginService: LoginService,
    public customValidator: CustomValidationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.contactInfoForm$ = this.formCreationService
      .getContactDetailsForm()
      .subscribe((contactInfo) => {
        this.contactInfoForm = contactInfo;
        this.contactInfoForm.setValidators([
          this.customValidator
            .confirmEmailValidator()
            .bind(this.customValidator),
          this.customValidator
            .maxLengthValidator(100)
            .bind(this.customValidator)
        ]);
        this.contactFormControl.confirmEmail.reset();
        this.contactInfoForm.updateValueAndValidity();
      });

    this.contactInfoForm
      .get('cellPhoneNumber')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('cellPhoneNumber').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('email')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('email').reset();
          this.contactInfoForm.get('confirmEmail').reset();
          this.contactInfoForm.get('confirmEmail').disable();
        } else {
          this.contactInfoForm.get('confirmEmail').enable();
        }
        this.contactInfoForm.get('cellPhoneNumber').updateValueAndValidity();
        this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
      });

    this.contactInfoForm
      .get('confirmEmail')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactInfoForm.get('confirmEmail').reset();
        }
        this.contactInfoForm.get('email').updateValueAndValidity();
        this.contactInfoForm.get('cellPhoneNumber').updateValueAndValidity();
      });
  }

  /**
   * Returns the control of the form
   */
  get contactFormControl(): { [key: string]: AbstractControl } {
    return this.contactInfoForm.controls;
  }

  hideContact(event: MatRadioChange): void {
    if (!event.value) {
      this.contactInfoForm.get('cellPhoneNumber').reset();
      this.contactInfoForm.get('email').reset();
      this.contactInfoForm.get('confirmEmail').reset();
      this.updateOnVisibility();
    }
  }

  updateOnVisibility(): void {
    this.contactInfoForm.get('cellPhoneNumber').updateValueAndValidity();
    this.contactInfoForm.get('email').updateValueAndValidity();
    this.contactInfoForm.get('confirmEmail').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.contactInfoForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    DirectivesModule,
    // 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - new text mask provider
    NgxMaskDirective, NgxMaskPipe,
    MatRadioModule
  ],
  declarations: [ContactInfoComponent]
})
class ContactInfoModule {}

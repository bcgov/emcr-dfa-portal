import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  Validators,
  UntypedFormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { ProfileDataService } from 'src/app/feature-components/profile/profile-data.service';
import { ProfileService } from 'src/app/core/api/services';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { ErrorStateMatcher } from '@angular/material/core';

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
  selector: 'app-profile-verification',
  templateUrl: './profile-verification.component.html',
  styleUrls: ['./profile-verification.component.scss']
})
export default class ProfileVerificationComponent implements OnInit, OnDestroy {
  profileVerificationForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  mailingAddressRadioOption: string[] = ['Yes', 'No', 'I don\'t have a mailing address right now'];
  profileVerificationForm$: Subscription;
  formCreationService: FormCreationService;
  radioOption: string[] = ['Yes', 'No'];
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
    public customValidator: CustomValidationService,
    private profileDataService: ProfileDataService,
    private profileService: ProfileService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.profileService.profileGetProfileWithUpdatedBcsc().subscribe(profile => {
    console.log('getProfileWithUpdatedBCSC.id: ' + profile?.id)
    });

    this.profileVerificationForm$ = this.formCreationService
      .getProfileVerificationForm()
      .subscribe((profileVerification) => {
        this.profileVerificationForm = profileVerification;
        this.profileVerificationForm.get('profile.contactDetails').setValidators([
          this.customValidator
            .confirmProfileEmailValidator()
            .bind(this.customValidator)
        ]);
        this.profileVerificationForm.get('profile.contactDetails.confirmEmail').reset();
        this.profileVerificationForm.get('profile.contactDetails.confirmEmail').setValue(this.profileVerificationForm.get('profile.contactDetails.email').value);
        this.profileVerificationForm.updateValueAndValidity();
        this.profileService.profileGetProfileWithUpdatedBcsc().subscribe(profile => {
          this.profileVerificationForm.get('profile').patchValue(profile);
          // trim phone numbers
          this.profileVerificationForm.get('profile.isMailingAddressSameAsPrimaryAddress').setValue(profile.isMailingAddressSameAsPrimaryAddress == 'NoAddress' ? 'I don\'t have a mailing address right now' : profile.isMailingAddressSameAsPrimaryAddress);
          
          if (profile.isMailingAddressSameAsPrimaryAddress === 'Yes') {
            this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.city').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators(null);
          }
          else if (profile.isMailingAddressSameAsPrimaryAddress === 'No') {
            //this.profileVerificationForm.get('profile.mailingAddress').reset();
            this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators([Validators.required]);
            this.profileVerificationForm.get('profile.mailingAddress.city').setValidators([Validators.required]);
            this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators([Validators.required]);
            this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
          }
          else if (profile.isMailingAddressSameAsPrimaryAddress == 'NoAddress') {
            this.profileVerificationForm.get('profile.mailingAddress').reset();
            this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.city').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
            this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators(null);
          }
          this.updateOnVisibility();

          this.profileVerificationForm.get('profile.contactDetails.cellPhoneNumber').setValue(profile?.contactDetails?.cellPhoneNumber?.substring(0, 12));
          this.profileVerificationForm.get('profile.contactDetails.alternatePhone').setValue(profile?.contactDetails?.alternatePhone?.substring(0,12));
          this.profileVerificationForm.get('profile.contactDetails.residencePhone').setValue(profile?.contactDetails?.residencePhone?.substring(0,12));
          if (!this.profileVerificationForm.get('profile.primaryAddress.stateProvince').value) this.profileVerificationForm.get('profile.primaryAddress.stateProvince')?.setValue("BC");
          this.profileVerificationForm.get('profileId').setValue(profile.id);
          this.profileVerificationForm.updateValueAndValidity();
          this.dfaApplicationStartDataService.profile = profile;
        })
      });

    this.profileVerificationForm.get('profileId').setValue(this.profileDataService.getProfileId());

    this.profileVerificationForm
      .get('profileVerified')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profileVerified').reset();
        }
      });

    // TODO: Implement the correct setting of this value, will it be a radio button or checkbox??
    this.profileVerificationForm.get('profileVerified').setValue(true);

    this.profileVerificationForm
      .get('profile.isMailingAddressSameAsPrimaryAddress')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.isMailingAddressSameAsPrimaryAddress').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.personalDetails.indigenousStatus')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.personalDetails.indigenousStatus').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.personalDetails.initials')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.personalDetails.initials').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.mailingAddress.addressLine1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.mailingAddress.addressLine1').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.mailingAddress.addressLine2')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.mailingAddress.addressLine2').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.mailingAddress.city')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.mailingAddress.city').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.mailingAddress.postalCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.mailingAddress.postalCode').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.mailingAddress.stateProvince')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.mailingAddress.stateProvince').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.contactDetails.cellPhoneNumber')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.contactDetails.cellPhoneNumber').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.contactDetails.residencePhone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.contactDetails.residencePhone').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.contactDetails.alternatePhone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.profileVerificationForm.get('profile.contactDetails.alternatePhone').reset();
        }
      });

    this.profileVerificationForm
      .get('profile.contactDetails.email')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        //if (value === '') {
        //  this.profileVerificationForm.get('profile.contactDetails.email').reset();
        //  this.profileVerificationForm.get('profile.contactDetails.confirmEmail').reset();
        //  this.profileVerificationForm.get('profile.contactDetails.confirmEmail').disable();
        //} else {
        //  this.profileVerificationForm.get('profile.contactDetails.confirmEmail').enable();
        //}
        //this.profileVerificationForm.get('profile.contactDetails.confirmEmail').updateValueAndValidity();
        this.profileVerificationForm.updateValueAndValidity();
      });

    this.profileVerificationForm
      .get('profile.contactDetails.confirmEmail')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        //if (value === '') {
        //  this.profileVerificationForm.get('profile.contactDetails.confirmEmail').reset();
        //}
        //this.profileVerificationForm.get('profile.contactDetails.email').updateValueAndValidity();
        //this.profileVerificationForm.get('profile.contactDetails.confirmEmail').updateValueAndValidity();
        this.profileVerificationForm.updateValueAndValidity();
      });
  }

  sameAsPrimary(event: MatRadioChange): void {
    const primaryAddress = this.profileVerificationForm.getRawValue().address;
    if (event.value === 'Yes') {
      this.profileVerificationForm.get('profile.mailingAddress').patchValue(primaryAddress);
      this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.city').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators(null);
    }
    else if (event.value === 'No') {
      this.profileVerificationForm.get('profile.mailingAddress').reset();
      this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators([Validators.required]);
      this.profileVerificationForm.get('profile.mailingAddress.city').setValidators([Validators.required]);
      this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators([Validators.required]);
      this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
    }
    else {
      this.profileVerificationForm.get('profile.mailingAddress').reset();
      this.profileVerificationForm.get('profile.mailingAddress.addressLine1').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.city').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.stateProvince').setValidators(null);
      this.profileVerificationForm.get('profile.mailingAddress.postalCode').setValidators(null);
    }

    this.updateOnVisibility();
  }

  /**
   * Returns the control of the form
   */
  get profileVerificationFormControl(): { [key: string]: AbstractControl } {
    return this.profileVerificationForm.controls;
  }

  updateOnVisibility(): void {
    this.profileVerificationForm.get('profile.isMailingAddressSameAsPrimaryAddress').updateValueAndValidity();
    this.profileVerificationForm.get('profile.personalDetails.initials').updateValueAndValidity();
    this.profileVerificationForm.get('profile.personalDetails.indigenousStatus').updateValueAndValidity();
    this.profileVerificationForm.get('profile.personalDetails').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress.addressLine1').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress.addressLine2').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress.city').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress.postalCode').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress.stateProvince').updateValueAndValidity();
    this.profileVerificationForm.get('profile.mailingAddress').updateValueAndValidity();
    this.profileVerificationForm.get('profile.contactDetails.cellPhoneNumber').updateValueAndValidity();
    this.profileVerificationForm.get('profile.contactDetails.residencePhone').updateValueAndValidity();
    this.profileVerificationForm.get('profile.contactDetails.alternatePhone').updateValueAndValidity();
    this.profileVerificationForm.get('profile.contactDetails').updateValueAndValidity();
    this.profileVerificationForm.get('profileVerified').updateValueAndValidity();
    this.profileVerificationForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.profileVerificationForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    // 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - new text mask provider
    NgxMaskDirective, NgxMaskPipe,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
    AddressFormsModule
  ],
  declarations: [ProfileVerificationComponent]
})
class ProfileVerificationModule {}

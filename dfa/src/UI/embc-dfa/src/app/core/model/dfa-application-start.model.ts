import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Profile, SignatureBlock } from 'src/app/core/api/models';
import { ApplicantOption, SmallBusinessOption, FarmOption, InsuranceOption, DfaApplicationStart } from '../api/models';
import { CustomValidationService } from '../services/customValidation.service';

export class Consent {
  consent: boolean;

  constructor(
    consent?: boolean
  ) {}
}

export class ConsentForm {
  consent = new UntypedFormControl();

  constructor(
    consent: Consent
  ) {
    if (consent.consent) {
      this.consent.setValue(consent.consent);
    }

    this.consent.setValidators([Validators.required]);
  }
}

export class ProfileVerification {
  profileVerified: boolean;
  profileId: string;
  profile: Profile;

  constructor(
    profileVerified?: boolean,
    profileId?: string,
    profile?: Profile
  ) {}
}

export class ProfileVerificationForm {
  profileVerified = new UntypedFormControl();
  profileId = new UntypedFormControl();
  profile: UntypedFormGroup;
  personalDetails: UntypedFormGroup;
  primaryAddress: UntypedFormGroup;
  mailingAddress: UntypedFormGroup;
  contactDetails: UntypedFormGroup;
  email = new UntypedFormControl();
  confirmEmail = new UntypedFormControl();
  cellPhoneNumber = new UntypedFormControl();
  id = new UntypedFormControl();
  bcServiceCardId = new UntypedFormControl();
  residencePhone = new UntypedFormControl();
  alternatePhone = new UntypedFormControl();
  addressLine1 = new UntypedFormControl();
  addressLine2 = new UntypedFormControl();
  city = new UntypedFormControl();
  stateProvince = new UntypedFormControl();
  postalCode = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  initials = new UntypedFormControl();
  indigenousStatus = new UntypedFormControl();
  isMailingAddressSameAsPrimaryAddress = new UntypedFormControl();

  constructor(
    profileVerification: ProfileVerification,
    builder: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    this.profileVerified.setValidators([Validators.required]);
    this.profileVerified.setValue(profileVerification.profileVerified);

    this.profileId.setValue(profileVerification.profileId);
    this.profileId.setValidators([Validators.required]);

    this.profile = builder.group({
      id: ['', Validators.required],
      bcServiceCardId: ['', Validators.required],
      isMailingAddressSameAsPrimaryAddress: ['', Validators.required],
      personalDetails: builder.group({
        lastName: [
          profileVerification.profile?.personalDetails.lastName,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        firstName: [
          profileVerification.profile?.personalDetails.firstName,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        indigenousStatus: [
          profileVerification.profile?.personalDetails.indigenousStatus
        ],
        initials: [
          profileVerification.profile?.personalDetails.initials,
          [customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
      }),
      primaryAddress: builder.group({
        addressLine1: [
          profileVerification.profile?.primaryAddress.addressLine1,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        addressLine2: [
          profileVerification.profile?.primaryAddress.addressLine2,
          [customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        city: [
          profileVerification.profile?.primaryAddress.city,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        postalCode: [
          profileVerification.profile?.primaryAddress.postalCode,
          [Validators.required, customValidator.postalValidation().bind(customValidator), customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        stateProvince: [
          profileVerification.profile?.primaryAddress.stateProvince ? profileVerification.profile?.primaryAddress.stateProvince : 'British Columbia',
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ]
      }),
      mailingAddress: builder.group({
        addressLine1: [
          profileVerification.profile?.mailingAddress.addressLine1,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        addressLine2: [
          profileVerification.profile?.mailingAddress.addressLine2,
          [customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        city: [
          profileVerification.profile?.mailingAddress.city,
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        postalCode: [
          profileVerification.profile?.mailingAddress.postalCode,
          [Validators.required,
            Validators.pattern(/^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/),
            customValidator.postalValidation().bind(customValidator),
            customValidator.maxLengthValidator(100).bind(customValidator)]
        ],
        stateProvince: [
          profileVerification.profile?.mailingAddress.stateProvince ? profileVerification.profile.mailingAddress.stateProvince : 'British Columbia',
          [Validators.required, customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ]
      }),
      contactDetails: builder.group({
        email: [
          profileVerification.profile?.contactDetails.email,
          [Validators.required,
            Validators.email,
            customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
        ],
        confirmEmail: [
          profileVerification.profile?.contactDetails.email,
          [Validators.required,
          Validators.email,
          customValidator
            .maxLengthValidator(100)
              .bind(customValidator)
          ]
        ],
        cellPhoneNumber: [
          profileVerification.profile?.contactDetails.cellPhoneNumber,
          [customValidator.maskedNumberLengthValidator().bind(customValidator),
            customValidator
              .maxLengthValidator(12)
              .bind(customValidator)]
        ],
        residencePhone: [
          profileVerification.profile?.contactDetails.residencePhone,
          [customValidator.maskedNumberLengthValidator().bind(customValidator),
            customValidator
              .maxLengthValidator(12)
              .bind(customValidator)]
        ],
        alternatePhone: [
          profileVerification.profile?.contactDetails.alternatePhone,
          [customValidator.maskedNumberLengthValidator().bind(customValidator),
            customValidator
              .maxLengthValidator(12)
              .bind(customValidator)]
        ]
      }),
    });
  }
}

export class AppTypeInsurance {
  applicantOption: ApplicantOption;
  insuranceOption: InsuranceOption;
  smallBusinessOption: SmallBusinessOption;
  farmOption: FarmOption;
  applicantSignature: SignatureBlock;
  secondaryApplicantSignature: SignatureBlock;

  constructor(
    applicantOption?: ApplicantOption,
    insuranceOption?: InsuranceOption,
    smallBusinessOption?: SmallBusinessOption,
    farmOption?: FarmOption,
    applicantSignature?: SignatureBlock,
    secondaryApplicantSignature?: SignatureBlock
  ) {   }
}

export class AppTypeInsuranceForm {
  applicantOption = new UntypedFormControl();
  insuranceOption = new UntypedFormControl();
  smallBusinessOption = new UntypedFormControl();
  farmOption = new UntypedFormControl();
  applicantSignature: UntypedFormGroup;
  secondaryApplicantSignature: UntypedFormGroup;

  constructor(
    appTypeInsurance: AppTypeInsurance,
    fb: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    if (appTypeInsurance.applicantOption) {
      this.applicantOption.setValue(appTypeInsurance.applicantOption);
    }

    this.applicantOption.setValidators([Validators.required]);

    this.insuranceOption.setValue(appTypeInsurance.insuranceOption);
    this.insuranceOption.setValidators([Validators.required]);
    this.smallBusinessOption.setValue(appTypeInsurance.smallBusinessOption);
    this.farmOption.setValue(appTypeInsurance.farmOption);

    this.applicantSignature = fb.group({
      signature: null,
      dateSigned: null,
      signedName: null
    });
    this.applicantSignature?.controls.signature.setValue(appTypeInsurance?.applicantSignature?.signature);
    this.applicantSignature?.controls.dateSigned.setValue(appTypeInsurance?.applicantSignature?.dateSigned);
    this.applicantSignature?.controls.signedName.setValue(appTypeInsurance?.applicantSignature?.signedName);

    this.applicantSignature?.controls.signedName.setValidators([
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    this.secondaryApplicantSignature = fb.group({
      signature: null,
      dateSigned: null,
      signedName: null
    });
    this.secondaryApplicantSignature?.controls.signature.setValue(appTypeInsurance?.secondaryApplicantSignature?.signature);
    this.secondaryApplicantSignature?.controls.dateSigned.setValue(appTypeInsurance?.secondaryApplicantSignature?.dateSigned);
    this.secondaryApplicantSignature?.controls.signedName.setValue(appTypeInsurance?.secondaryApplicantSignature?.signedName);
  }
}

export class ApplicationDetails {
  applicantOption: ApplicantOption;
  insuranceOption: InsuranceOption;
  smallBusinessOption: SmallBusinessOption;
  farmOption: FarmOption;
  consent: Consent;

  constructor(
    applicantOption?: ApplicantOption,
    insuranceOption?: InsuranceOption,
    smallBusinessOption?: SmallBusinessOption,
    farmOption?: FarmOption,
    consent?: Consent
  ) {   }
}

export class ApplicationDetailsForm {
  applicantOption = new UntypedFormControl();
  insuranceOption = new UntypedFormControl();
  smallBusinessOption = new UntypedFormControl();
  farmOption = new UntypedFormControl();
  consent = new UntypedFormControl();

  constructor(
    applicationDetails: ApplicationDetails
  ) {
    if (applicationDetails.applicantOption) {
      this.applicantOption.setValue(applicationDetails.applicantOption);
    }
    this.insuranceOption.setValue(applicationDetails.insuranceOption);
    this.smallBusinessOption.setValue(applicationDetails.smallBusinessOption);
    this.farmOption.setValue(applicationDetails.farmOption);
    if (applicationDetails.consent?.consent) {
      this.consent.setValue(applicationDetails.consent.consent);
    }
  }
}


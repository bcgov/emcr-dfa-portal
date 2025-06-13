import {
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { CustomValidationService } from '../services/customValidation.service';
import { RegAddress } from './address';
import * as globalConst from '../services/globalConstants';
import { Country } from '../services/location.service';

export class Restriction {
  restrictedAccess: boolean;
}

export class RestrictionForm {
  restrictedAccess = new UntypedFormControl();

  constructor(restriction: Restriction) {
    this.restrictedAccess.setValue(restriction.restrictedAccess);
    this.restrictedAccess.setValidators([Validators.required]);
  }
}

export class PersonDetails {
  firstName: string;
  lastName: string;
  preferredName?: string;
  initials?: string;
  sameLastNameCheck?: boolean;
  isPrimaryRegistrant?: boolean;
  indigenousStatus?: boolean;

  constructor(
    firstName?: string,
    lastName?: string,
    preferredName?: string,
    initials?: string,
    sameLastNameCheck?: boolean,
    isPrimaryRegistrant?: boolean,
    indigenousStatus?: boolean
  ) {}
}

export class PersonDetailsForm {
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  //preferredName = new UntypedFormControl();
  initials = new UntypedFormControl();
  indigenousStatus = new UntypedFormControl();

  constructor(
    personDetail: PersonDetails,
    customValidator: CustomValidationService
  ) {

    if (personDetail.firstName) {
      this.firstName.setValue(personDetail.firstName);
    }

    this.firstName.setValidators([Validators.required]);

    this.lastName.setValue(personDetail.lastName);
    this.lastName.setValidators([Validators.required]);

    //this.preferredName.setValue(personDetail.preferredName);

    this.initials.setValue(personDetail.initials);

    this.indigenousStatus.setValue('');
    //this.indigenousStatus.setValidators([Validators.required]);
  }
}

export class ContactDetails {
  email: string;
  cellPhoneNumber: string;
  confirmEmail: string;
  showContacts: boolean;
  //hideEmailRequired: boolean;
  //hidePhoneRequired: boolean;
  residencePhone: string;
  alternatePhone: string;
  optOutNonEssential?: boolean;
  constructor() {}
}

export class ContactDetailsForm {
  email = new UntypedFormControl();
  cellPhoneNumber = new UntypedFormControl();
  confirmEmail = new UntypedFormControl();
  showContacts = new UntypedFormControl();
  //hideEmailRequired = new UntypedFormControl(false);
  //hidePhoneRequired = new UntypedFormControl(false);
  residencePhone = new UntypedFormControl();
  alternatePhone = new UntypedFormControl();
  optOutNonEssential = new UntypedFormControl(false, Validators.required);

  constructor(
    contactDetails: ContactDetails,
    customValidator: CustomValidationService
  ) {
    //this.showContacts.setValue(contactDetails.showContacts);
    //this.showContacts.setValidators([Validators.required]);

    //this.email.setValue(contactDetails.email);
    this.email.setValidators([
      Validators.email,
      Validators.maxLength(100),
      customValidator
      .conditionalValidation(
        () =>
          this.email.value !== '' &&
          this.email.value !== undefined &&
          this.email.value !== null,
        Validators.required,
      )
      .bind(customValidator)
    ]);

    this.cellPhoneNumber.setValidators([
      customValidator.maskedNumberLengthValidator().bind(customValidator),
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    this.residencePhone.setValidators([
      customValidator.maskedNumberLengthValidator().bind(customValidator),
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    this.alternatePhone.setValidators([
      customValidator.maskedNumberLengthValidator().bind(customValidator),
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    this.confirmEmail.setValue(contactDetails.confirmEmail);
    this.confirmEmail.setValidators([
     Validators.email,
     Validators.maxLength(100),
     customValidator
       .conditionalValidation(
         () =>
           this.email.value !== '' &&
           this.email.value !== undefined &&
           this.email.value !== null,
         Validators.required
       )
       .bind(customValidator)
    ]);

    this.optOutNonEssential.setValue(
      contactDetails.optOutNonEssential !== undefined
        ? contactDetails.optOutNonEssential
        : false
    );
    this.optOutNonEssential.setValidators([Validators.required]);

    //this.phone.setValue(contactDetails.phone);
    //this.phone.setValidators([
    //  customValidator.maskedNumberLengthValidator().bind(customValidator),
    //  customValidator
    //    .conditionalValidation(
    //      () =>
    //        (this.email.value === '' ||
    //          this.email.value === undefined ||
    //          this.email.value === null) &&
    //        this.showContacts.value === true,
    //      Validators.required
    //    )
    //    .bind(customValidator)
    //]);
  }
}

export class Address {
  isBcAddress: string;
  address: RegAddress;
  mailingAddress: RegAddress;
  isNewMailingAddress: string;
  isBcMailingAddress: string;
  //isAddressVerified: string;

  constructor() {}
}

export class AddressForm {
  address: UntypedFormGroup;
  isBcAddress = new UntypedFormControl();
  isNewMailingAddress = new UntypedFormControl();
  isBcMailingAddress = new UntypedFormControl();
  //isAddressVerified = new UntypedFormControl();
  mailingAddress: UntypedFormGroup;

  constructor(
    address: Address,
    builder: UntypedFormBuilder,
    customValidator: CustomValidationService
  ) {
    this.address = builder.group({
      addressLine1: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      addressLine2: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      community: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      stateProvince: ['British Columbia',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      postalCode: [
        '',
        [customValidator.postalValidation().bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)]
      ],
      country: '',
      isAddressVerified: ''
    });

    this.mailingAddress = builder.group({
      addressLine1: ['',
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
      ],
      addressLine2: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      community: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      stateProvince: ['',
        customValidator
          .maxLengthValidator(100)
          .bind(customValidator)
      ],
      postalCode: [
        '',
        [customValidator.postalCodeSpaceValidation().bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      country: '',
      isAddressVerified: ''
    });

    //this.isBcAddress.setValue(address.isBcAddress);
    //this.isBcAddress.setValidators([Validators.required]);

    this.isNewMailingAddress.setValue(address.isNewMailingAddress);
    //this.isAddressVerified.setValue(address.isAddressVerified);
    //this.isNewMailingAddress.setValidators([Validators.required]);

    //this.isNewMailingAddress.setValue(address.isNewMailingAddress);
    //this.isNewMailingAddress.setValidators([
    //  customValidator
    //    .conditionalValidation(
    //      () => this.isNewMailingAddress.value === 'No',
    //      Validators.required
    //    )
    //    .bind(customValidator)
    //]);
    //this.isNewMailingAddress.removeValidators([
    //  customValidator
    //    .conditionalValidation(
    //      () => this.isNewMailingAddress.value !== 'No',
    //      Validators.required
    //    )
    //    .bind(customValidator)
    //]);
  }

  compareObjects<T extends Country>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }
}

// export class Secret {
//   secretPhrase: string;

//   constructor() {}
// }

// export class SecretForm {
//   secretPhrase = new FormControl();

//   constructor(secret: Secret) {
//     this.secretPhrase.setValue(secret.secretPhrase);
//     this.secretPhrase.setValidators([Validators.required]);
//   }
// }

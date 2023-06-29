import {
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RegAddress, Community, Country, StateProvince } from '../model/address';
import { CustomValidationService } from '../services/customValidation.service';

export interface DamagedPropertyAddress extends RegAddress {
  occupyAsPrimaryResidence: boolean;
  onAFirstNationsReserve: boolean;
  firstNationsReserve?: FirstNationsReserve | string;
  manufacturedHome?: boolean;
  eligibleForHomeOwnerGrant: boolean;
}

export interface FirstNationsReserve
{
  code?: null | string;
  name?: null | string;
}

export class DamagedPropertyAddress implements DamagedPropertyAddress {

  constructor(
    addressLine1?: string,
    addressLine2?: string,
    community?: Community | string,
    postalCode?: null | string,
    stateProvince?: null | StateProvince,
    country?: Country,
    occupyAsPrimaryResidence?: null | boolean,
    onAFirstNationsReserve?: null | boolean,
    firstNationsReserve?: FirstNationsReserve | string,
    manufacturedHome?: null | boolean,
    eligibleForHomeOwnerGrant?: null | boolean
  ) {}
}

export class DamagedPropertyAddressForm {
  addressLine1 = new UntypedFormControl();
  addressLine2 = new UntypedFormControl();
  community = new UntypedFormControl();
  postalCode = new UntypedFormControl();
  stateProvince = new UntypedFormControl();
  country = new UntypedFormControl();
  occupyAsPrimaryResidence = new UntypedFormControl();
  onAFirstNationsReserve = new UntypedFormControl();
  firstNationsReserve = new UntypedFormControl();
  manufacturedHome = new UntypedFormControl();
  eligibleForHomeOwnerGrant = new UntypedFormControl();

  constructor(
    damagedPropertyAddress: DamagedPropertyAddress
  ) {
    if (damagedPropertyAddress.addressLine1) {
      this.addressLine1.setValue(damagedPropertyAddress.addressLine1);
    }
    this.addressLine1.setValidators([Validators.required]);

    if (damagedPropertyAddress.addressLine2) {
      this.addressLine2.setValue(damagedPropertyAddress.addressLine2);
    }
    this.addressLine2.setValidators(null);

    if (damagedPropertyAddress.community) {
      this.community.setValue(damagedPropertyAddress.community);
    }
    this.community.setValidators([Validators.required]);

    if (damagedPropertyAddress.postalCode) {
      this.postalCode.setValue(damagedPropertyAddress.postalCode);
    }
    this.postalCode.setValidators([Validators.required, Validators.pattern(/^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/)]);

    if (damagedPropertyAddress.stateProvince) {
      this.stateProvince.setValue(damagedPropertyAddress.stateProvince);
    }
    this.stateProvince.setValidators([Validators.required]);

    if (damagedPropertyAddress.country) {
      this.country.setValue(damagedPropertyAddress.country);
    }
    this.country.setValidators([Validators.required]);

    if (damagedPropertyAddress.occupyAsPrimaryResidence) {
      this.occupyAsPrimaryResidence.setValue(damagedPropertyAddress.occupyAsPrimaryResidence);
    }
    this.occupyAsPrimaryResidence.setValidators([Validators.required]);

    if (damagedPropertyAddress.onAFirstNationsReserve) {
      this.onAFirstNationsReserve.setValue(damagedPropertyAddress.onAFirstNationsReserve);
    }
    this.onAFirstNationsReserve.setValidators([Validators.required]);

    if (damagedPropertyAddress.firstNationsReserve) {
      this.firstNationsReserve.setValue(damagedPropertyAddress.firstNationsReserve);
    }
    this.firstNationsReserve.setValidators(null);

    if (damagedPropertyAddress.manufacturedHome) {
      this.manufacturedHome.setValue(damagedPropertyAddress.manufacturedHome);
    }
    this.manufacturedHome.setValidators(null);

    if (damagedPropertyAddress.eligibleForHomeOwnerGrant) {
      this.eligibleForHomeOwnerGrant.setValue(damagedPropertyAddress.eligibleForHomeOwnerGrant);
    }
    this.eligibleForHomeOwnerGrant.setValidators([Validators.required]);
  }
}

export class PropertyDamage {
  floodDamage?: boolean;
  landslideDamage?: boolean;
  stormDamage?: boolean;
  otherDamage?: boolean;
  otherDamageText?: string;
  damageFromDate?: Date;
  damageToDate?: Date;
  briefDescription?: string;
  lossesExceed1000?: boolean;
  wereYouEvacuated?: boolean;
  dateReturned?: Date;
  residingInResidence?: boolean;

  constructor(
    floodDamage?: null | boolean,
    landslideDamage?: null | boolean,
    stormDamage?: null | boolean,
    otherDamage?: null | boolean,
    otherDamageText?: null | string,
    damageFromDate?: null | Date,
    damageToDate?: null | Date,
    briefDescription?: null | string,
    lossesExceed1000?: null | boolean,
    wereYouEvacuated?: null | boolean,
    dateReturned?: null | Date,
    residingInResidence?: null | boolean,
  ) {}
}

export class PropertyDamageForm {
  floodDamage = new UntypedFormControl();
  landslideDamage = new UntypedFormControl();
  stormDamage = new UntypedFormControl();
  otherDamage = new UntypedFormControl();
  otherDamageText = new UntypedFormControl();
  damageFromDate = new UntypedFormControl();
  damageToDate = new UntypedFormControl();
  briefDescription = new UntypedFormControl();
  lossesExceed1000 = new UntypedFormControl();
  wereYouEvacuated = new UntypedFormControl();
  dateReturned = new UntypedFormControl();
  residingInResidence = new UntypedFormControl();

  constructor(
    propertyDamage: PropertyDamage
  ) {
    if (propertyDamage.floodDamage) {
      this.floodDamage.setValue(propertyDamage.floodDamage);
    }
    this.floodDamage.setValidators(null);

    if (propertyDamage.landslideDamage) {
      this.landslideDamage.setValue(propertyDamage.landslideDamage);
    }
    this.landslideDamage.setValidators(null);

    if (propertyDamage.stormDamage) {
      this.stormDamage.setValue(propertyDamage.stormDamage);
    }
    this.stormDamage.setValidators(null);

    if (propertyDamage.otherDamage) {
      this.otherDamage.setValue(propertyDamage.otherDamage);
    }
    this.otherDamage.setValidators(null);

    if (propertyDamage.otherDamageText) {
      this.otherDamageText.setValue(propertyDamage.otherDamageText);
    }
    this.otherDamageText.setValidators(null);

    if (propertyDamage.damageFromDate) {
      this.damageFromDate.setValue(propertyDamage.damageFromDate);
    }
    this.damageFromDate.setValidators(null);

    if (propertyDamage.damageToDate) {
      this.damageToDate.setValue(propertyDamage.damageToDate);
    }
    this.damageToDate.setValidators(null);

    if (propertyDamage.briefDescription) {
      this.briefDescription.setValue(propertyDamage.briefDescription);
    }
    this.briefDescription.setValidators(null);

    if (propertyDamage.lossesExceed1000) {
      this.lossesExceed1000.setValue(propertyDamage.lossesExceed1000);
    }
    this.lossesExceed1000.setValidators(null);

    if (propertyDamage.wereYouEvacuated) {
      this.wereYouEvacuated.setValue(propertyDamage.wereYouEvacuated);
    }
    this.wereYouEvacuated.setValidators(null);

    if (propertyDamage.dateReturned) {
      this.dateReturned.setValue(propertyDamage.dateReturned);
    }
    this.dateReturned.setValidators(null);

    if (propertyDamage.residingInResidence) {
      this.residingInResidence.setValue(propertyDamage.residingInResidence);
    }
    this.residingInResidence.setValidators(null);

  }
}

// TODO This should be coming in from the API in api/models
/* tslint:disable */
/* eslint-disable */
export enum SecondaryApplicantTypeOption {
  Contact = 'Contact',
  Organization = 'Organization',
}


export interface FullTimeOccupant {
  firstName: string;
  lastName: string;
  relationship: string;
}

export interface OtherContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface SecondaryApplicant {
  applicantType: SecondaryApplicantTypeOption;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export class Occupants {
  fullTimeOccupants: Array<FullTimeOccupant>;
  otherContacts: Array<OtherContact>;
  secondaryApplicants: Array<SecondaryApplicant>;

  constructor(
  ) {}
}

export class OccupantsForm {
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  relationship = new UntypedFormControl();
  phoneNumber = new UntypedFormControl();
  email = new UntypedFormControl();
  secondaryApplicantType = new UntypedFormControl();
  fullTimeOccupant: UntypedFormGroup;
  fullTimeOccupants = new UntypedFormControl([]);
  addNewFullTimeOccupantIndicator = new UntypedFormControl(false);
  addNewOtherContactIndicator = new UntypedFormControl(false);
  addNewSecondaryApplicantIndicator = new UntypedFormControl(false);
  otherContact: UntypedFormGroup;
  secondaryApplicant: UntypedFormGroup;
  otherContacts = new UntypedFormControl([]);
  secondaryApplicants = new UntypedFormControl([]);

  constructor(
    occupants: Occupants,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.fullTimeOccupant = builder.group({
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFullTimeOccupantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      lastName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFullTimeOccupantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      relationship: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFullTimeOccupantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.otherContact = builder.group({
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      lastName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      phoneNumber: [
        '',
        [
          customValidator.maskedNumberLengthValidator().bind(customValidator),
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      email: [
        '',
        [
          Validators.email,
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required,
            )
            .bind(customValidator)
        ]
      ]

    });
    this.secondaryApplicant = builder.group({
      secondaryApplicantType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      lastName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      phoneNumber: [
        '',
        [
          customValidator.maskedNumberLengthValidator().bind(customValidator),
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      email: [
        '',
        [
          Validators.email,
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required,
            )
            .bind(customValidator)
        ]
      ]

    });
  }
}

export interface CleanupLog {
  date: Date;
  name: string;
  hours: string;
  description: string;
  fileName: string;
  fileDescription: string;
  fileDate: Date;
}

export class CleanUpLog {
  field: boolean;

  constructor(
    field?: boolean
  ) {}
}

export class CleanUpLogForm {
  name = new UntypedFormControl();
  date = new UntypedFormControl();
  hours = new UntypedFormControl();
  description = new UntypedFormControl();
  fileName = new UntypedFormControl();
  fileDescription = new UntypedFormControl();
  fileDate = new UntypedFormControl();
  cleanuplog: UntypedFormGroup;
  cleanuplogs = new UntypedFormControl([]);
  addNewCleanUpLogIndicator = new UntypedFormControl(false);
  cleanuplogFile: UntypedFormGroup;
  cleanuplogFiles = new UntypedFormControl([]);
  addNewCleanUpLogFileIndicator = new UntypedFormControl(false);

  constructor(
    cleanUpLog: CleanUpLog,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.cleanuplog = builder.group({
      date: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewCleanUpLogIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      name: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewCleanUpLogIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      hours: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewCleanUpLogIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      description: [
        ''
      ]
    });
    this.cleanuplogFile = builder.group({
      fileDate: [
        ''
      ],
      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewCleanUpLogIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        ''
      ]
    });
  }
}


export class DamagedItemsByRoom {
  field: boolean;

  constructor(
    field?: boolean
  ) {}
}

export class DamagedItemsByRoomForm {
  field = new UntypedFormControl();

  constructor(
    damagedItemsByRoom: DamagedItemsByRoom
  ) {
    if (damagedItemsByRoom.field) {
      this.field.setValue(damagedItemsByRoom.field);
    }
    this.field.setValidators(null);
  }
}

// TODO This should be coming in from the API in api/models
/**
 * Homeowner Application
 */
export interface HomeOwnerApplication {
  id?: string;
  damagedPropertyAddress?: DamagedPropertyAddress;
  propertyDamage?: PropertyDamage;
  occupants?: Occupants;
  cleanUpLog?: CleanUpLog;
  damagedItemsByRoom?: DamagedItemsByRoom;
}

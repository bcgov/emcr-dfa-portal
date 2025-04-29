import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Community, Country, StateProvince } from './address';
import { CustomValidationService } from '../services/customValidation.service';
import { SignatureBlock, SecondaryApplicantTypeOption, FileCategory, RoomType, RequiredDocumentType } from 'src/app/core/api/models';

export class DamagedPropertyAddress {
  addressLine1?: null | string;
  addressLine2?: null | string;
  community?: null | string;
  eligibleForHomeOwnerGrant?: null | boolean;
  firstNationsReserve?: null | string;
  isPrimaryAndDamagedAddressSame?: null | boolean;
  landlordEmail?: null | string;
  landlordEmail2?: null | string;
  landlordGivenNames?: null | string;
  landlordGivenNames2?: null | string;
  landlordPhone?: null | string;
  landlordPhone2?: null | string;
  landlordSurname?: null | string;
  landlordSurname2?: null | string;
  manufacturedHome?: null | boolean;
  occupyAsPrimaryResidence?: null | boolean;
  lossesExceed1000?: null | boolean;
  onAFirstNationsReserve?: null | boolean;
  postalCode?: null | string;
  stateProvince?: null | string;
  businessLegalName?: null | string;
  businessManagedByAllOwnersOnDayToDayBasis?: null | boolean;
  employLessThan50EmployeesAtAnyOneTime?: null | boolean;
  grossRevenues100002000000BeforeDisaster?: null | boolean;
  farmoperation?: null | boolean;
  ownedandoperatedbya?: null | boolean;
  farmoperationderivesthatpersonsmajorincom?: null | boolean;
  charityExistsAtLeast12Months?: null | boolean;
  charityProvidesCommunityBenefit?: null | boolean;
  charityRegistered?: null | boolean;
  isDamagedAddressVerified?: null | boolean;

  constructor(
    addressLine1?: string,
    addressLine2?: string,
    community?: Community | string,
    postalCode?: null | string,
    stateProvince?: null | StateProvince,
    country?: Country,
    occupyAsPrimaryResidence?: null | boolean,
    lossesExceed1000?: null | boolean,
    onAFirstNationsReserve?: null | boolean,
    firstNationsReserve?: string,
    manufacturedHome?: null | boolean,
    isPrimaryAndDamagedAddressSame?: null | boolean,
    eligibleForHomeOwnerGrant?: null | boolean,
    landlordGivenNames?: null | string,
    landlordGivenNames2?: null | string,
    landlordSurname?: null | string,
    landlordSurname2?: null | string,
    landlordPhone?: null | string,
    landlordPhone2?: null | string,
    landlordEmail?: null | string,
    landlordEmail2?: null | string,
    businessLegalName?: null | string,
    businessManagedByAllOwnersOnDayToDayBasis?: null | boolean,
    employLessThan50EmployeesAtAnyOneTime?: null | boolean,
    grossRevenues100002000000BeforeDisaster?: null | boolean,
    farmoperation?: null | boolean,
    ownedandoperatedbya?: null | boolean,
    farmoperationderivesthatpersonsmajorincom?: null | boolean,
    charityExistsAtLeast12Months?: null | boolean,
    charityProvidesCommunityBenefit?: null | boolean,
    charityRegistered?: null | boolean,
    isDamagedAddressVerified?: null | boolean,

    ) {}
}

export class DamagedPropertyAddressForm {
  addressLine1 = new UntypedFormControl();
  addressLine2 = new UntypedFormControl();
  community = new UntypedFormControl();
  postalCode = new UntypedFormControl();
  stateProvince = new UntypedFormControl();
  occupyAsPrimaryResidence = new UntypedFormControl();
  onAFirstNationsReserve = new UntypedFormControl();
  firstNationsReserve = new UntypedFormControl();
  manufacturedHome = new UntypedFormControl();
  eligibleForHomeOwnerGrant = new UntypedFormControl();
  isPrimaryAndDamagedAddressSame = new UntypedFormControl();
  lossesExceed1000 = new UntypedFormControl();
  landlordGivenNames = new UntypedFormControl();
  landlordGivenNames2 = new UntypedFormControl();
  landlordSurname = new UntypedFormControl();
  landlordSurname2 = new UntypedFormControl();
  landlordPhone = new UntypedFormControl();
  landlordPhone2 = new UntypedFormControl();
  landlordEmail = new UntypedFormControl();
  landlordEmail2 = new UntypedFormControl();
  businessLegalName = new UntypedFormControl();
  businessManagedByAllOwnersOnDayToDayBasis = new UntypedFormControl();
  employLessThan50EmployeesAtAnyOneTime = new UntypedFormControl();
  grossRevenues100002000000BeforeDisaster = new UntypedFormControl();
  farmoperation = new UntypedFormControl();
  ownedandoperatedbya = new UntypedFormControl();
  farmoperationderivesthatpersonsmajorincom = new UntypedFormControl();
  charityExistsAtLeast12Months = new UntypedFormControl();
  charityProvidesCommunityBenefit = new UntypedFormControl();
  charityRegistered = new UntypedFormControl();
  isDamagedAddressVerified = new UntypedFormControl();

  constructor(
    damagedPropertyAddress: DamagedPropertyAddress,
    customValidator: CustomValidationService
  ) {
    if (damagedPropertyAddress.addressLine1) {
      this.addressLine1.setValue(damagedPropertyAddress.addressLine1);
    }
    this.addressLine1.setValidators([Validators.required,
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
      ]);

    if (damagedPropertyAddress.addressLine2) {
      this.addressLine2.setValue(damagedPropertyAddress.addressLine2);
    }
    this.addressLine2.setValidators([
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
      ]);

    if (damagedPropertyAddress.community) {
      this.community.setValue(damagedPropertyAddress.community);
    }
    this.community.setValidators([Validators.required,
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    if (damagedPropertyAddress.postalCode) {
      this.postalCode.setValue(damagedPropertyAddress.postalCode);
    }
    this.postalCode.setValidators([Validators.required, Validators.pattern(/^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/)]);

    if (damagedPropertyAddress.stateProvince) {
      this.stateProvince.setValue(damagedPropertyAddress.stateProvince);
    }
    this.stateProvince.setValidators([Validators.required,
      customValidator
      .maxLengthValidator(100)
      .bind(customValidator)
    ]);

    if (damagedPropertyAddress.occupyAsPrimaryResidence) {
      this.occupyAsPrimaryResidence.setValue(damagedPropertyAddress.occupyAsPrimaryResidence);
    }
    this.occupyAsPrimaryResidence.setValidators(null);

    if (damagedPropertyAddress.onAFirstNationsReserve) {
      this.onAFirstNationsReserve.setValue(damagedPropertyAddress.onAFirstNationsReserve);
    }
    this.onAFirstNationsReserve.setValidators([Validators.required]);

    if (damagedPropertyAddress.firstNationsReserve) {
      this.firstNationsReserve.setValue(damagedPropertyAddress.firstNationsReserve);
    }
    this.firstNationsReserve.setValidators([customValidator
      .maxLengthValidator(100)
      .bind(customValidator)]);

    if (damagedPropertyAddress.isPrimaryAndDamagedAddressSame) {
      this.isPrimaryAndDamagedAddressSame.setValue(damagedPropertyAddress.isPrimaryAndDamagedAddressSame);
    }
    this.isPrimaryAndDamagedAddressSame.setValidators([Validators.required]);

    if (damagedPropertyAddress.manufacturedHome) {
      this.manufacturedHome.setValue(damagedPropertyAddress.manufacturedHome);
    }
    this.manufacturedHome.setValidators(null);

    if (damagedPropertyAddress.eligibleForHomeOwnerGrant) {
      this.eligibleForHomeOwnerGrant.setValue(damagedPropertyAddress.eligibleForHomeOwnerGrant);
    }
    this.eligibleForHomeOwnerGrant.setValidators(null);

    if (damagedPropertyAddress.landlordGivenNames) {
      this.landlordGivenNames.setValue(damagedPropertyAddress.landlordGivenNames);
    }
    this.landlordGivenNames.setValidators(null);

    if (damagedPropertyAddress.landlordGivenNames2) {
      this.landlordGivenNames2.setValue(damagedPropertyAddress.landlordGivenNames2);
    }
    this.landlordGivenNames2.setValidators(null);

    if (damagedPropertyAddress.landlordSurname) {
      this.landlordSurname.setValue(damagedPropertyAddress.landlordSurname);
    }
    this.landlordSurname.setValidators(null);

    if (damagedPropertyAddress.landlordSurname2) {
      this.landlordSurname2.setValue(damagedPropertyAddress.landlordSurname2);
    }
    this.landlordSurname2.setValidators(null);

    if (damagedPropertyAddress.landlordPhone) {
      this.landlordPhone.setValue(damagedPropertyAddress.landlordPhone);
    }
    this.landlordPhone.setValidators([customValidator.maskedNumberLengthValidator().bind(customValidator)]);

    if (damagedPropertyAddress.landlordPhone2) {
      this.landlordPhone2.setValue(damagedPropertyAddress.landlordPhone2);
    }
    this.landlordPhone2.setValidators([customValidator.maskedNumberLengthValidator().bind(customValidator)]);

    if (damagedPropertyAddress.landlordEmail) {
      this.landlordEmail.setValue(damagedPropertyAddress.landlordEmail);
    }
    this.landlordEmail.setValidators([Validators.email]);

    if (damagedPropertyAddress.landlordEmail2) {
      this.landlordEmail2.setValue(damagedPropertyAddress.landlordEmail2);
    }
    this.landlordEmail2.setValidators([Validators.email]);

    if (damagedPropertyAddress.businessLegalName) {
      this.businessLegalName.setValue(damagedPropertyAddress.businessLegalName);
    }
    this.businessLegalName.setValidators([Validators.required]);

    if (damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime) {
      this.employLessThan50EmployeesAtAnyOneTime.setValue(damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime);
    }
    this.employLessThan50EmployeesAtAnyOneTime.setValidators(null);

    if (damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis) {
      this.businessManagedByAllOwnersOnDayToDayBasis.setValue(damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis);
    }
    this.businessManagedByAllOwnersOnDayToDayBasis.setValidators(null);

    if (damagedPropertyAddress.grossRevenues100002000000BeforeDisaster) {
      this.grossRevenues100002000000BeforeDisaster.setValue(damagedPropertyAddress.grossRevenues100002000000BeforeDisaster);
    }
    this.grossRevenues100002000000BeforeDisaster.setValidators(null);

    if (damagedPropertyAddress.farmoperation) {
      this.farmoperation.setValue(damagedPropertyAddress.farmoperation);
    }
    this.farmoperation.setValidators(null);

    if (damagedPropertyAddress.ownedandoperatedbya) {
      this.ownedandoperatedbya.setValue(damagedPropertyAddress.ownedandoperatedbya);
    }
    this.ownedandoperatedbya.setValidators(null);

    if (damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom) {
      this.farmoperationderivesthatpersonsmajorincom.setValue(damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom);
    }
    this.farmoperationderivesthatpersonsmajorincom.setValidators(null);

    if (damagedPropertyAddress.lossesExceed1000) {
      this.lossesExceed1000.setValue(damagedPropertyAddress.lossesExceed1000);
    }
    this.lossesExceed1000.setValidators(null);

    if (damagedPropertyAddress.charityExistsAtLeast12Months) {
      this.charityExistsAtLeast12Months.setValue(damagedPropertyAddress.charityExistsAtLeast12Months);
    }
    this.charityExistsAtLeast12Months.setValidators(null);

    if (damagedPropertyAddress.charityProvidesCommunityBenefit) {
      this.charityProvidesCommunityBenefit.setValue(damagedPropertyAddress.charityProvidesCommunityBenefit);
    }
    this.charityProvidesCommunityBenefit.setValidators(null);

    if (damagedPropertyAddress.charityRegistered) {
      this.charityRegistered.setValue(damagedPropertyAddress.charityRegistered);
    }
    this.charityRegistered.setValidators(null);

    if (damagedPropertyAddress.isDamagedAddressVerified) {
      this.isDamagedAddressVerified.setValue(damagedPropertyAddress.isDamagedAddressVerified);
    }
  }
}

export class PropertyDamage {
  briefDescription?: null | string;
  damageFromDate?: null | string;
  damageToDate?: null | string;
  dateReturned?: null | string;
  floodDamage?: null | boolean;
  landslideDamage?: null | boolean;
  otherDamage?: null | boolean;
  otherDamageText?: null | string;
  previousApplicationText?: null | string;
  residingInResidence?: null | boolean;
  previousApplication?: null | string;
  stormDamage?: null | boolean;
  wereYouEvacuated?: null | boolean;

  constructor(
    floodDamage?: null | boolean,
    landslideDamage?: null | boolean,
    stormDamage?: null | boolean,
    otherDamage?: null | boolean,
    otherDamageText?: null | string,
    previousApplicationText?: null | string,
    damageFromDate?: null | Date,
    damageToDate?: null | Date,
    briefDescription?: null | string,
    wereYouEvacuated?: null | boolean,
    dateReturned?: null | Date,
    residingInResidence?: null | boolean,
    previousApplication?: null | string,
  ) {}
}

export class PropertyDamageForm {
  floodDamage = new UntypedFormControl();
  landslideDamage = new UntypedFormControl();
  stormDamage = new UntypedFormControl();
  otherDamage = new UntypedFormControl();
  otherDamageText = new UntypedFormControl();
  previousApplicationText = new UntypedFormControl();
  damageFromDate = new UntypedFormControl();
  damageToDate = new UntypedFormControl();
  briefDescription = new UntypedFormControl();
  wereYouEvacuated = new UntypedFormControl();
  dateReturned = new UntypedFormControl();
  residingInResidence = new UntypedFormControl();
  previousApplication = new UntypedFormControl();

  constructor(
    propertyDamage: PropertyDamage,
    customValidator: CustomValidationService
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
    this.otherDamageText.setValidators([customValidator
      .maxLengthValidator(100)
      .bind(customValidator)]);

    if (propertyDamage.previousApplicationText) {
      this.previousApplicationText.setValue(propertyDamage.previousApplicationText);
    }
    this.previousApplicationText.setValidators([customValidator
      .maxLengthValidator(100)
      .bind(customValidator)]);

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
    this.briefDescription.setValidators([customValidator
      .maxLengthValidator(2000)
      .bind(customValidator)]);

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

    if (propertyDamage.previousApplication) {
      this.previousApplication.setValue(propertyDamage.previousApplication);
    }
    this.previousApplication.setValidators(null);

  }
}

export class FullTimeOccupant {
  applicationId?: string;
  contactId?: string;
  deleteFlag?: boolean;
  firstName?: string;
  id?: null | string;
  lastName?: string;
  relationship?: string;
  onlyOccupantInHome?: boolean;
}

export class FullTimeOccupantsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  relationship = new UntypedFormControl();
  fullTimeOccupant: UntypedFormGroup;
  fullTimeOccupants = new UntypedFormControl([]);
  addNewFullTimeOccupantIndicator = new UntypedFormControl(false);
  onlyOccupantInHome = new UntypedFormControl();

  constructor(
    fullTimeOccupants: Array<FullTimeOccupant>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.fullTimeOccupant = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFullTimeOccupantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
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
      id: [
        ''
      ],
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFullTimeOccupantIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49) // first name last name and ', ' have to add up to no more than 100
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49)
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class OtherContact {
  applicationId?: string;
  deleteFlag?: boolean;
  email?: string;
  firstName?: string;
  id?: null | string;
  lastName?: string;
  phoneNumber?: string;
  onlyOtherContact?: boolean;
}

export class OtherContactsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  phoneNumber = new UntypedFormControl();
  email = new UntypedFormControl();
  addNewOtherContactIndicator = new UntypedFormControl(false);
  otherContact: UntypedFormGroup;
  otherContacts = new UntypedFormControl([], Validators.required);
  onlyOtherContact = new UntypedFormControl();

  constructor(
    otherContacts: Array<OtherContact>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.otherContact = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
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
      id: [
        ''
      ],
      firstName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49)  // have to fit firstname and lastname and one space and comma into dfa_name
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49)
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class SecondaryApplicant {
  applicantType?: SecondaryApplicantTypeOption;
  applicationId?: string;
  deleteFlag?: boolean;
  email?: string;
  firstName?: string;
  id?: null | string;
  lastName?: string;
  phoneNumber?: string;
}

export class SecondaryApplicantsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  phoneNumber = new UntypedFormControl();
  email = new UntypedFormControl();
  applicantType = new UntypedFormControl();
  addNewSecondaryApplicantIndicator = new UntypedFormControl(false);
  secondaryApplicant: UntypedFormGroup;
  secondaryApplicants = new UntypedFormControl([]);

  constructor(
    secondaryApplicants: Array<SecondaryApplicant>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.secondaryApplicant = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewSecondaryApplicantIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
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
      id: [
        ''
      ],
      applicantType: [
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49) // must squish lastname, firstname into organizationname
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(49)
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class CleanUpLogItem {
  applicationId?: string;
  date?: string;
  deleteFlag?: boolean;
  description?: string;
  hours?: string;
  id?: null | string;
  name?: string;
}

export class CleanUpLogItemsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  name = new UntypedFormControl();
  date = new UntypedFormControl();
  hours = new UntypedFormControl();
  description = new UntypedFormControl();
  cleanuplog: UntypedFormGroup;
  cleanuplogs = new UntypedFormControl([]);
  addNewCleanUpLogIndicator = new UntypedFormControl(false);

  constructor(
    cleanUpLogItems: Array<CleanUpLogItem>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.cleanuplog = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewCleanUpLogIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
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
      id: [
        ''
      ],
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
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
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
            .bind(customValidator),
          Validators.max(100000000000),
          Validators.min(0)
        ]
      ],
      description: [
        '',
        [
          customValidator
            .maxLengthValidator(200)
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class CleanUpLog {
  haveInvoicesOrReceiptsForCleanupOrRepairs?: null | boolean;
}

export class CleanUpLogForm {
  haveInvoicesOrReceiptsForCleanupOrRepairs = new UntypedFormControl();

  constructor(
    cleanUpLog: CleanUpLog,
  ) {
    if (cleanUpLog.haveInvoicesOrReceiptsForCleanupOrRepairs != null) {
      this.haveInvoicesOrReceiptsForCleanupOrRepairs.setValue(cleanUpLog.haveInvoicesOrReceiptsForCleanupOrRepairs);
    }
    this.haveInvoicesOrReceiptsForCleanupOrRepairs.setValidators(null);
  }
}

export class FileUpload {
  applicationId?: string;
  contentType?: string;
  deleteFlag?: boolean;
  fileData?: string;
  fileDescription?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: FileCategory;
  requiredDocumentType?: RequiredDocumentType;
  id?: null | string;
  modifiedBy?: string;
  uploadedDate?: string;
  applicantType?: string;
  smallBusinessOption?: string;
  farmOption?: string;
}

export class FileUploadsForm {
  applicationId = new UntypedFormControl();
  applicantType = new UntypedFormControl();
  smallBusinessOption = new UntypedFormControl();
  farmOption = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  fileName = new UntypedFormControl();
  fileDescription = new UntypedFormControl();
  fileType = new UntypedFormControl();
  requiredDocumentType = new UntypedFormControl();
  uploadedDate = new UntypedFormControl();
  modifiedBy = new UntypedFormControl();
  fileData = new UntypedFormControl();
  contentType = new UntypedFormControl();
  fileSize = new UntypedFormControl();
  cleanupFileUpload: UntypedFormGroup;
  insuranceTemplateFileUpload: UntypedFormGroup;
  T1IncomeTaxReturnFileUpload: UntypedFormGroup;
  T2IncomeTaxReturnFileUpload: UntypedFormGroup;
  proofOfOwnershipFileUpload: UntypedFormGroup;
  T776FileUpload: UntypedFormGroup;
  financialStatementsFileUpload: UntypedFormGroup;
  tenancyAgreementFileUpload: UntypedFormGroup;
  rentalAgreementFileUpload: UntypedFormGroup;
  identificationFileUpload: UntypedFormGroup;
  directorsListingFileUpload: UntypedFormGroup;
  registrationProofFileUpload: UntypedFormGroup;
  structureAndPurposeFileUpload: UntypedFormGroup;
  damagePhotoFileUpload: UntypedFormGroup;
  supportingFilesFileUpload: UntypedFormGroup;
  fileUploads = new UntypedFormControl([]);
  addNewFileUploadIndicator = new UntypedFormControl(false);

  constructor(
    fileUploads: Array<FileUpload>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.insuranceTemplateFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.T1IncomeTaxReturnFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.T2IncomeTaxReturnFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.proofOfOwnershipFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.T776FileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.financialStatementsFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.tenancyAgreementFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.rentalAgreementFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.identificationFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.supportingFilesFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],
      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.damagePhotoFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],
      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.cleanupFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.directorsListingFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.registrationProofFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.structureAndPurposeFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class DamagedRoom {
  applicationId?: string;
  deleteFlag?: boolean;
  description?: string;
  id?: null | string;
  otherRoomType?: null | string;
  roomType?: RoomType;
}

export class DamagedRoomsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  roomType = new UntypedFormControl();
  otherRoomType = new UntypedFormControl();
  description = new UntypedFormControl();
  damagedRoom: UntypedFormGroup;
  damagedRooms = new UntypedFormControl([]);
  addNewDamagedRoomIndicator = new UntypedFormControl(false);

  constructor(
    damagedRooms: Array<DamagedRoom>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.damagedRoom = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewDamagedRoomIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      applicationId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewDamagedRoomIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        ''
      ],
      roomType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewDamagedRoomIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      otherRoomType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewDamagedRoomIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      description: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewDamagedRoomIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(2000)
            .bind(customValidator)
        ]
      ],
    });
  }
}

export class SupportingDocuments {
  hasCopyOfARentalAgreementOrLease?: boolean;

  constructor(
   ) {}
}

export class SupportingDocumentsForm {
  hasCopyOfARentalAgreementOrLease = new UntypedFormControl();

  constructor(
    supportingDocuments: SupportingDocuments,
  ) {
    if (supportingDocuments.hasCopyOfARentalAgreementOrLease != null) {
      this.hasCopyOfARentalAgreementOrLease.setValue(supportingDocuments.hasCopyOfARentalAgreementOrLease);
    }
    this.hasCopyOfARentalAgreementOrLease.setValidators(null);
  }
}

export class SignAndSubmit {
  applicantSignature?: null | SignatureBlock;
  secondaryApplicantSignature?: null | SignatureBlock;
  ninetyDayDeadline?: null | string;
}

export class SignAndSubmitForm {
  applicantSignature: UntypedFormGroup;
  secondaryApplicantSignature: UntypedFormGroup;
  ninetyDayDeadline = new UntypedFormControl();

  constructor(
    signAndSubmit: SignAndSubmit,
    fb: UntypedFormBuilder
  ) {
    this.applicantSignature = fb.group({
      signature: [null, Validators.required],
      dateSigned: [null, Validators.required],
      signedName: [null, Validators.required]
    });
    this.applicantSignature?.controls.signature.setValue(signAndSubmit?.applicantSignature?.signature);
    this.applicantSignature?.controls.dateSigned.setValue(signAndSubmit?.applicantSignature?.dateSigned);
    this.applicantSignature?.controls.signedName.setValue(signAndSubmit?.applicantSignature?.signedName);

    this.secondaryApplicantSignature = fb.group({
      signature: null,
      dateSigned: null,
      signedName: null
    });
    this.secondaryApplicantSignature?.controls.signature.setValue(signAndSubmit?.secondaryApplicantSignature?.signature);
    this.secondaryApplicantSignature?.controls.dateSigned.setValue(signAndSubmit?.secondaryApplicantSignature?.dateSigned);
    this.secondaryApplicantSignature?.controls.signedName.setValue(signAndSubmit?.secondaryApplicantSignature?.signedName);

    this.ninetyDayDeadline.setValue(signAndSubmit.ninetyDayDeadline);
  }
}

/**
 * DFA Application Main
 **/
export interface DfaApplicationMain {
  cleanUpLog?: CleanUpLog;
  damagedPropertyAddress?: DamagedPropertyAddress;
  id?: string;
  propertyDamage?: PropertyDamage;
  signAndSubmit?: SignAndSubmit;
  supportingDocuments?: SupportingDocuments;
  deleteFlag?: boolean;
  onlyOccupantInHome?: boolean;
  onlyOtherContact?: boolean
}

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
  landlordGivenNames?: null | string;
  landlordPhone?: null | string;
  landlordSurname?: null | string;
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
    landlordSurname?: null | string,
    landlordPhone?: null | string,
    landlordEmail?: null | string,
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
  landlordSurname = new UntypedFormControl();
  landlordPhone = new UntypedFormControl();
  landlordEmail = new UntypedFormControl();
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

    if (damagedPropertyAddress.landlordSurname) {
      this.landlordSurname.setValue(damagedPropertyAddress.landlordSurname);
    }
    this.landlordSurname.setValidators(null);

    if (damagedPropertyAddress.landlordPhone) {
      this.landlordPhone.setValue(damagedPropertyAddress.landlordPhone);
    }
    this.landlordPhone.setValidators([customValidator.maskedNumberLengthValidator().bind(customValidator)]);

    if (damagedPropertyAddress.landlordEmail) {
      this.landlordEmail.setValue(damagedPropertyAddress.landlordEmail);
    }
    this.landlordEmail.setValidators([Validators.email]);

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
  damageFromDate?: null | string;
  damageToDate?: null | string;
  floodDamage?: null | boolean;
  landslideDamage?: null | boolean;
  otherDamage?: null | boolean;
  otherDamageText?: null | string;
  stormDamage?: null | boolean;
  wildfireDamage?: null | boolean;
  guidanceSupport?: null | boolean;
  applicantSubtype?: null | string;
  applicantSubtypeId?: null | string;
  applicantSubSubtype?: null | string;
  estimatedPercent?: null | string;
  subtypeOtherDetails?: null | string;
  subtypeDFAComment?: null | string;

  constructor(
    floodDamage?: null | boolean,
    landslideDamage?: null | boolean,
    stormDamage?: null | boolean,
    wildfireDamage?: null | boolean,
    guidanceSupport?: null | boolean,
    otherDamage?: null | boolean,
    otherDamageText?: null | string,
    damageFromDate?: null | Date,
    damageToDate?: null | Date,
    applicantSubSubtype?: null | string,
    applicantSubtypeId?: null | string,
    applicantSubtype?: null | string,
    estimatedPercent?: null | string,
    subtypeOtherDetails?: null | string,
    subtypeDFAComment?: null | string
  ) { }
}

export class PropertyDamageForm {
  floodDamage = new UntypedFormControl();
  landslideDamage = new UntypedFormControl();
  stormDamage = new UntypedFormControl();
  wildfireDamage = new UntypedFormControl();
  guidanceSupport = new UntypedFormControl();
  otherDamage = new UntypedFormControl();
  otherDamageText = new UntypedFormControl();
  damageFromDate = new UntypedFormControl();
  damageToDate = new UntypedFormControl();
  applicantSubtype = new UntypedFormControl();
  applicantSubSubtype = new UntypedFormControl();
  estimatedPercent = new UntypedFormControl();
  subtypeOtherDetails = new UntypedFormControl();
  subtypeDFAComment = new UntypedFormControl();

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

    if (propertyDamage.wildfireDamage) {
      this.stormDamage.setValue(propertyDamage.wildfireDamage);
    }
    this.wildfireDamage.setValidators(null);

    if (propertyDamage.guidanceSupport) {
      this.stormDamage.setValue(propertyDamage.guidanceSupport);
    }
    this.guidanceSupport.setValidators(null);

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

    if (propertyDamage.damageFromDate) {
      this.damageFromDate.setValue(propertyDamage.damageFromDate);
    }
    this.damageFromDate.setValidators(null);

    if (propertyDamage.damageToDate) {
      this.damageToDate.setValue(propertyDamage.damageToDate);
    }
    this.damageToDate.setValidators(null);

    if (propertyDamage.applicantSubtype) {
      this.applicantSubtype.setValue(propertyDamage.applicantSubtype);
    }
    this.applicantSubtype.setValidators(null);

    if (propertyDamage.applicantSubSubtype) {
      this.applicantSubSubtype.setValue(propertyDamage.applicantSubSubtype);
    }
    this.applicantSubSubtype.setValidators(null);

    if (propertyDamage.estimatedPercent) {
      this.estimatedPercent.setValue(propertyDamage.estimatedPercent);
    }

    this.estimatedPercent.setValidators(null);

    if (propertyDamage.subtypeOtherDetails) {
      this.subtypeOtherDetails.setValue(propertyDamage.subtypeOtherDetails);
    }
    this.subtypeOtherDetails.setValidators(null);

    if (propertyDamage.subtypeDFAComment) {
      this.subtypeDFAComment.setValue(propertyDamage.subtypeDFAComment);
    }
    this.subtypeDFAComment.setValidators(null);
  }
}

// 2024-08-20 EMCRI-613 waynezen; Create Application1
export class CreateApplication1 {
  legalName?: null | string;

  constructor(
    legalName?: null | string) {
  
  }
}

export class CreateApplication1Form {
  legalName = new UntypedFormControl();
  
  constructor(
    createApplication1: CreateApplication1,
    customValidator: CustomValidationService) {
      if (createApplication1.legalName) {
        this.legalName.setValue(createApplication1.legalName);
      }
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
        ''
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
  id?: string;
  propertyDamage?: PropertyDamage;
  otherContact?: OtherContact[];
  deleteFlag?: boolean;
}

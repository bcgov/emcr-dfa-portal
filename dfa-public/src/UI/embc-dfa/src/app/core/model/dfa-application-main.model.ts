import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Community, Country, StateProvince } from './address';
import { CustomValidationService } from '../services/customValidation.service';
import { SignatureBlock, SecondaryApplicantTypeOption, FileCategory, RoomType, RequiredDocumentType, ApplicationStageOptionSet, ApplicationContacts } from 'src/app/core/api/models';

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

export class ApplicationDetails {
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
  legalName?: null | string;
  eventName?: null | string;
  eventId?: null | string;
  appStatus?: null | ApplicationStageOptionSet;

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
    subtypeDFAComment?: null | string,
    legalName?: null | string,
    eventName?: null | string,
    eventId?: null | string,
    appStatus?: null | ApplicationStageOptionSet,

  ) { }
}

export class ApplicationDetailsForm {
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
  legalName = new UntypedFormControl();
  eventName = new UntypedFormControl();
  eventId = new UntypedFormControl();
  appStatus = new UntypedFormControl();

  constructor(
    applicationDetails: ApplicationDetails,
    customValidator: CustomValidationService
  ) {
    if (applicationDetails.floodDamage) {
      this.floodDamage.setValue(applicationDetails.floodDamage);
    }
    this.floodDamage.setValidators(null);

    if (applicationDetails.landslideDamage) {
      this.landslideDamage.setValue(applicationDetails.landslideDamage);
    }
    this.landslideDamage.setValidators(null);

    if (applicationDetails.stormDamage) {
      this.stormDamage.setValue(applicationDetails.stormDamage);
    }
    this.stormDamage.setValidators(null);

    if (applicationDetails.wildfireDamage) {
      this.wildfireDamage.setValue(applicationDetails.wildfireDamage);
    }
    this.wildfireDamage.setValidators(null);

    if (applicationDetails.guidanceSupport) {
      this.guidanceSupport.setValue(applicationDetails.guidanceSupport);
    }
    this.guidanceSupport.setValidators(null);

    if (applicationDetails.otherDamage) {
      this.otherDamage.setValue(applicationDetails.otherDamage);
    }
    this.otherDamage.setValidators(null);

    if (applicationDetails.otherDamageText) {
      this.otherDamageText.setValue(applicationDetails.otherDamageText);
    }
    this.otherDamageText.setValidators([customValidator
      .maxLengthValidator(100)
      .bind(customValidator)]);

    if (applicationDetails.damageFromDate) {
      this.damageFromDate.setValue(applicationDetails.damageFromDate);
    }
    this.damageFromDate.setValidators(null);

    if (applicationDetails.damageToDate) {
      this.damageToDate.setValue(applicationDetails.damageToDate);
    }
    this.damageToDate.setValidators(null);

    if (applicationDetails.applicantSubtype) {
      this.applicantSubtype.setValue(applicationDetails.applicantSubtype);
    }
    this.applicantSubtype.setValidators(null);

    if (applicationDetails.applicantSubSubtype) {
      this.applicantSubSubtype.setValue(applicationDetails.applicantSubSubtype);
    }
    this.applicantSubSubtype.setValidators(null);

    if (applicationDetails.estimatedPercent) {
      this.estimatedPercent.setValue(applicationDetails.estimatedPercent);
    }

    this.estimatedPercent.setValidators(null);

    if (applicationDetails.subtypeOtherDetails) {
      this.subtypeOtherDetails.setValue(applicationDetails.subtypeOtherDetails);
    }
    this.subtypeOtherDetails.setValidators(null);

    if (applicationDetails.subtypeDFAComment) {
      this.subtypeDFAComment.setValue(applicationDetails.subtypeDFAComment);
    }
    this.subtypeDFAComment.setValidators(null);

    if (applicationDetails.legalName) {
      this.legalName.setValue(applicationDetails.legalName);
    }
    this.legalName.setValidators(null);

    if (applicationDetails.eventName) {
      this.eventName.setValue(applicationDetails.eventName);
    }
    this.eventName.setValidators(null);

    if (applicationDetails.eventId) {
      this.eventId.setValue(applicationDetails.eventId);
    }
    this.eventId.setValidators(null);

    if (applicationDetails.appStatus) {
      this.appStatus.setValue(applicationDetails.appStatus);
    }
    this.appStatus.setValidators(null);
  }
}

// 2024-09-03 EMCRI-663 waynezen; Create Contacts
export class Contacts {
  contactId?: null | string;
  legalName?: null | string;
  doingBusinessAs?: null | string;
  businessNumber?: null | string;
  addressLine1?: null | string;
  addressLine2?: null | string;
  community?: null | string;
  city?: null | string;
  stateProvince?: null | string;
  postalCode?: null | string;
  isDamagedAddressVerified?: null | string;
  primaryContactSearch?: null | string;
  primaryContactValidated?: null | boolean;
  guidanceSupport?: null | boolean;

  // 2024-09-10 EMCRI-663 waynezen; Primary Contact info
  pcFirstName?: null | string;  
  pcLastName?: null | string;
  pcDepartment?: null | string;
  pcBusinessPhone?: null | string;
  pcEmailAddress?: null | string;
  pcCellPhone?: null | string;
  pcJobTitle?: null | string;
  pcNotes?: null | string;
  pcBCeIDOrgGuid?: null | string;
  pcBCeIDuserGuid?: null | string;


  constructor(
    legalName?: null | string,
    doingBusinessAs?: null | string,
    businessNumber?: null | string,
    addressLine1?: null | string,
    addressLine2?: null | string,
    community?: Community | string,
    city?: null | string,
    stateProvince?: null | string,
    postalCode?: null | string,
    isDamagedAddressVerified?: null | string,
    primaryContactSearch?: null | string,
    primaryContactValidated?: null | boolean,
    contactId?: null | string,
    guidanceSupport?: null | boolean,
    
    pcFirstName?: null | string,
    pcLastName?: null | string,
    pcDepartment?: null | string,
    pcBusinessPhone?: null | string,
    pcEmailAddress?: null | string,
    pcNotes?: null | string,
    pcBCeIDOrgGuid?: null | string,
    pcBCeIDuserGuid?: null | string,    
  ) { }
}

// 2024-09-09 EMCRI-663 waynezen; new Contacts form
export class ContactsForm {
  legalName = new UntypedFormControl();
  doingBusinessAs = new UntypedFormControl();
  businessNumber = new UntypedFormControl();
  addressLine1 = new UntypedFormControl();
  addressLine2 = new UntypedFormControl();
  community = new UntypedFormControl();
  city? = new UntypedFormControl();
  stateProvince = new UntypedFormControl();
  postalCode = new UntypedFormControl();
  isDamagedAddressVerified = new UntypedFormControl();
  primaryContactSearch = new UntypedFormControl();
  primaryContactValidated = new UntypedFormControl();
  contactId = new UntypedFormControl();
  guidanceSupport = new UntypedFormControl();

  // 2024-09-10 EMCRI-663 waynezen; Primary Contact info
  pcFirstName = new UntypedFormControl();
  pcLastName = new UntypedFormControl();
  pcDepartment = new UntypedFormControl();
  pcBusinessPhone = new UntypedFormControl();
  pcEmailAddress = new UntypedFormControl();
  pcCellPhone = new UntypedFormControl();
  pcJobTitle = new UntypedFormControl();
  pcNotes = new UntypedFormControl();

  pcBCeIDOrgGuid = new UntypedFormControl();
  pcBCeIDuserGuid = new UntypedFormControl();

  constructor(
    contacts: Contacts,
    customValidator: CustomValidationService) {

    if (contacts.legalName) {
      this.legalName.setValue(contacts.legalName);
    }
    if (contacts.doingBusinessAs) {
      this.doingBusinessAs.setValue(contacts.doingBusinessAs);
    }
    if (contacts.businessNumber) {
      this.businessNumber.setValue(contacts.businessNumber);
    }
    if (contacts.addressLine1) {
      this.addressLine1.setValue(contacts.addressLine1);
    }
    this.addressLine1.setValidators([Validators.required,
    customValidator
      .maxLengthValidator(100)
      .bind(customValidator)
    ]);

    if (contacts.addressLine2) {
      this.addressLine2.setValue(contacts.addressLine2);
    }
    if (contacts.community) {
      this.community.setValue(contacts.community);
    }
    this.community.setValidators([Validators.required,
    customValidator
      .maxLengthValidator(100)
      .bind(customValidator)
    ]);

    if (contacts.city) {
      this.city.setValue(contacts.city);
    }
    if (contacts.stateProvince) {
      this.stateProvince.setValue(contacts.stateProvince);
    }
    if (contacts.postalCode) {
      this.postalCode.setValue(contacts.postalCode);
    }
    if (contacts.isDamagedAddressVerified) {
      this.isDamagedAddressVerified.setValue(contacts.isDamagedAddressVerified);
    }
    if (contacts.primaryContactSearch) {
      this.primaryContactSearch.setValue(contacts.primaryContactSearch);
    }
    this.primaryContactSearch.setValidators([Validators.required,
      customValidator
        .maxLengthValidator(20)
        .bind(customValidator)
      ]);
  
    if (contacts.primaryContactValidated) {
      this.primaryContactValidated.setValue(contacts.primaryContactValidated);
    }

    if (contacts.contactId) {
      this.contactId.setValue(contacts.contactId);
    }
    if (contacts.guidanceSupport) {
      this.guidanceSupport.setValue(contacts.guidanceSupport);
    }
    this.guidanceSupport.setValidators([Validators.required]);

    if (contacts.pcFirstName) {
      this.pcFirstName.setValue(contacts.pcFirstName);
    }
    if (contacts.pcLastName) {
      this.pcLastName.setValue(contacts.pcLastName);
    }
    if (contacts.pcDepartment) {
      this.pcDepartment.setValue(contacts.pcDepartment);
    }
    if (contacts.pcBusinessPhone) {
      this.pcBusinessPhone.setValue(contacts.pcBusinessPhone);
    }
    if (contacts.pcEmailAddress) {
      this.pcEmailAddress.setValue(contacts.pcEmailAddress);
    }
    if (contacts.pcCellPhone) {
      this.pcCellPhone.setValue(contacts.pcCellPhone);
    }
    this.pcCellPhone.setValidators([customValidator.maskedNumberLengthValidator().bind(customValidator)]);

    if (contacts.pcJobTitle) {
      this.pcJobTitle.setValue(contacts.pcJobTitle);
    }
    if (contacts.pcNotes) {
      this.pcNotes.setValue(contacts.pcNotes);
    }
    if (contacts.pcBCeIDOrgGuid) {
      this.pcBCeIDOrgGuid.setValue(contacts.pcBCeIDOrgGuid);
    }
    if (contacts.pcBCeIDuserGuid) {
      this.pcBCeIDuserGuid.setValue(contacts.pcBCeIDuserGuid);
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
  
  // 2024-09-16 EMCRI-663 waynezen; add new fields to Other Contact
  cellPhone?: string;
  jobTitle?: string;
  otherNotes?: string;

  constructor(
    legalName?: null | string,

    applicationId?: null | string,
    deleteFlag?: null | boolean,
    email?: null | string,
    firstName?: null | string,
    id?: null | null | string,
    lastName?: null | string,
    phoneNumber?: null | string,
    cellPhone?: null | string,
    jobTitle?: null | string,
    otherNotes?: null | string,  
  ) { }

}

export class OtherContactsForm {
  applicationId = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  phoneNumber = new UntypedFormControl();
  email = new UntypedFormControl();

  // 2024-09-16 EMCRI-663 waynezen; add new fields to Other Contact
  cellPhone = new UntypedFormControl();
  jobTitle = new UntypedFormControl();
  otherNotes = new UntypedFormControl();

  addNewOtherContactIndicator = new UntypedFormControl(false);
  otherContact: UntypedFormGroup;
  otherContacts = new UntypedFormControl([], Validators.required);

  constructor(
    otherContacts: Array<OtherContact>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {

    // 2024-10-10 EMCRI-820 waynezen; add ability to re-hydrate OtherContacts data
    //console.debug('[DFA] otherContacts ctor: ' + otherContacts.length);
    
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
      ],
      cellPhone: [
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
      jobTitle: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewOtherContactIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      otherNotes: ['',]
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

/* EMCRI-1066: Authorized Representative */
export class AuthorizedRepresentative {
  firstName?: string;
  lastName?: string;
  email?: string;
  positionTitle?: string;
  businessPhone?: string;
  firstDeclaration?: boolean;
  secondDeclaration?: boolean;
}

export class AuthorizedRepresentativeForm {
  firstName = new UntypedFormControl();
  lastName = new UntypedFormControl();
  email = new UntypedFormControl();
  positionTitle = new UntypedFormControl();
  businessPhone = new UntypedFormControl();
  firstDeclaration = new UntypedFormControl();
  secondDeclaration = new UntypedFormControl();

  constructor(
    authorizedRepresentative: AuthorizedRepresentative,
    customValidator: CustomValidationService
  ) {

    if (authorizedRepresentative.firstName) {
      this.firstName.setValue(authorizedRepresentative.firstName);
    }
    this.firstName.setValidators([      
      Validators.required,
      customValidator
        .maxLengthValidator(49)  // have to fit firstname and lastname and one space and comma into dfa_name
        .bind(customValidator)
    ]);

    if (authorizedRepresentative.lastName) {
      this.lastName.setValue(authorizedRepresentative.lastName);
    }
    this.lastName.setValidators([      
      Validators.required,
      customValidator
        .maxLengthValidator(49)  // have to fit firstname and lastname and one space and comma into dfa_name
        .bind(customValidator)
    ]);

    if (authorizedRepresentative.businessPhone) {
      this.businessPhone.setValue(authorizedRepresentative.businessPhone);
    }
    this.businessPhone.setValidators([      
      customValidator.maskedNumberLengthValidator().bind(customValidator),
      Validators.required
    ]);

    if (authorizedRepresentative.email) {
      this.email.setValue(authorizedRepresentative.email);
    }
    this.email.setValidators([      
      Validators.required,
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    if (authorizedRepresentative.positionTitle) {
      this.positionTitle.setValue(authorizedRepresentative.positionTitle);
    }
    this.positionTitle.setValidators([      
      Validators.required,
      customValidator
        .maxLengthValidator(100)
        .bind(customValidator)
    ]);

    if (authorizedRepresentative.firstDeclaration) {
      this.firstDeclaration.setValue(authorizedRepresentative.firstDeclaration);
    }
    this.firstDeclaration.setValidators([      
      Validators.required
    ]);

    if (authorizedRepresentative.secondDeclaration) {
      this.secondDeclaration.setValue(authorizedRepresentative.secondDeclaration);
    }
    this.secondDeclaration.setValidators([      
      Validators.required
    ]);
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
  applicationDetails?: ApplicationDetails;
  applicationContacts?: ApplicationContacts;
  otherContact?: OtherContact[];
  authorizedRepresentative?: AuthorizedRepresentative;
  deleteFlag?: boolean;
}

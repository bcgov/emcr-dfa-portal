import { EventEmitter, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AppealReason,
  AppealReasonForm,
  SignAndSubmit as AppealSignAndSubmit,
  AppealSignAndSubmitForm
} from '../model/dfa-appeals-main.model';
import {
  CleanUpLog,
  CleanUpLogForm,
  CleanUpLogItem,
  CleanUpLogItemsForm,
  DamagedPropertyAddress,
  DamagedPropertyAddressForm,
  DamagedRoom,
  DamagedRoomsForm,
  FileUpload,
  FileUploadsForm,
  FullTimeOccupant,
  FullTimeOccupantsForm,
  OtherContactsForm,
  PropertyDamage,
  PropertyDamageForm,
  SecondaryApplicant,
  SecondaryApplicantsForm,
  SignAndSubmit,
  SignAndSubmitForm,
  SupportingDocuments,
  SupportingDocumentsForm
} from '../model/dfa-application-main.model';
import {
  ApplicationDetails,
  ApplicationDetailsForm,
  AppTypeInsurance,
  AppTypeInsuranceForm,
  Consent,
  ConsentForm,
  ProfileVerification,
  ProfileVerificationForm
} from '../model/dfa-application-start.model';
import {
  DfaPrescreening,
  DfaPrescreeningForm
} from '../model/dfa-prescreening.model';
import {
  Address,
  AddressForm,
  ContactDetails,
  ContactDetailsForm,
  PersonDetails,
  PersonDetailsForm,
  Restriction,
  RestrictionForm
} from '../model/profile.model';
import { CustomValidationService } from './customValidation.service';

@Injectable({ providedIn: 'root' })
export class FormCreationService {
  public insuranceOptionChanged: EventEmitter<any>;
  public applicantOptionChanged: EventEmitter<any>;
  public farmOptionChanged: EventEmitter<any>;
  public smallBusinessOptionChanged: EventEmitter<any>;
  public appTypeInsuranceFormValidityChange: EventEmitter<string>;
  public signaturesChanged: EventEmitter<UntypedFormGroup>;
  public AppTypeInsuranceData: AppTypeInsurance;

  restrictionForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(new RestrictionForm(new Restriction()))
    );

  restrictionForm$: Observable<UntypedFormGroup> =
    this.restrictionForm.asObservable();

  // profile
  personalDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new PersonDetailsForm(new PersonDetails(), this.customValidator)
      )
    );

  personalDetailsForm$: Observable<UntypedFormGroup> =
    this.personalDetailsForm.asObservable();

  contactDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ContactDetailsForm(new ContactDetails(), this.customValidator)
      )
    );

  contactDetailsForm$: Observable<UntypedFormGroup> =
    this.contactDetailsForm.asObservable();

  addressForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new AddressForm(new Address(), this.formBuilder, this.customValidator)
      )
    );

  addressForm$: Observable<UntypedFormGroup> = this.addressForm.asObservable();

  appTypeInsuranceForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new AppTypeInsuranceForm(
          new AppTypeInsurance(), this.formBuilder, this.customValidator
        )
      )
    );

  appTypeInsuranceForm$: Observable<UntypedFormGroup> =
    this.appTypeInsuranceForm.asObservable();

  consentForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ConsentForm(
          new Consent()
        )
      )
    );

  consentForm$: Observable<UntypedFormGroup | undefined> =
   this.consentForm.asObservable();

  applicationDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
   new BehaviorSubject(
     this.formBuilder.group(
       new ApplicationDetailsForm(
        new ApplicationDetails()
       )
     )
   );

  applicationDetailsForm$: Observable<UntypedFormGroup | undefined> =
   this.applicationDetailsForm.asObservable();

  profileVerificationForm: BehaviorSubject<UntypedFormGroup | undefined> =
   new BehaviorSubject(
     this.formBuilder.group(
       new ProfileVerificationForm(
         new ProfileVerification(),
         this.formBuilder,
         this.customValidator
       )
     )
   );

  profileVerificationForm$: Observable<UntypedFormGroup | undefined> =
    this.profileVerificationForm.asObservable();

  dfaPrescreeningForm: BehaviorSubject<UntypedFormGroup | undefined> =
   new BehaviorSubject(
     this.formBuilder.group(
       new DfaPrescreeningForm(
         new DfaPrescreening(),
         this.customValidator
       )
     )
   );

  dfaPrescreeningForm$: Observable<UntypedFormGroup | undefined> =
    this.dfaPrescreeningForm.asObservable();

  // DFA Applciation Main Forms
  damagedPropertyAddressForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new DamagedPropertyAddressForm(
         new DamagedPropertyAddress(),
         this.customValidator
       )
     )
   );

  damagedPropertyAddressForm$: Observable<UntypedFormGroup | undefined> =
    this.damagedPropertyAddressForm.asObservable();

  propertyDamageForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new PropertyDamageForm(
         new PropertyDamage(),
         this.customValidator
       )
     )
   );

  propertyDamageForm$: Observable<UntypedFormGroup | undefined> =
    this.propertyDamageForm.asObservable();

  fullTimeOccupantsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new FullTimeOccupantsForm(
         new Array<FullTimeOccupant>(),
         this.customValidator,
         this.formBuilder
       )
     )
   );

  fullTimeOccupantsForm$: Observable<UntypedFormGroup | undefined> =
    this.fullTimeOccupantsForm.asObservable();

  otherContactsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      OtherContactsForm.createForm(this.customValidator, this.formBuilder)
    );

  otherContactsForm$: Observable<UntypedFormGroup | undefined> =
    this.otherContactsForm.asObservable();

  secondaryApplicantsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new SecondaryApplicantsForm(
         new Array<SecondaryApplicant>(),
         this.customValidator,
         this.formBuilder
       )
     )
   );

  secondaryApplicantsForm$: Observable<UntypedFormGroup | undefined> =
    this.secondaryApplicantsForm.asObservable();

  cleanUpLogForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new CleanUpLogForm(
         new CleanUpLog(),
       )
     )
   );

  cleanUpLogForm$: Observable<UntypedFormGroup | undefined> =
    this.cleanUpLogForm.asObservable();

  cleanUpLogItemsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new CleanUpLogItemsForm(
         new Array<CleanUpLogItem>(),
         this.customValidator,
         this.formBuilder
       )
     )
   );

  cleanUpLogItemsForm$: Observable<UntypedFormGroup | undefined> =
    this.cleanUpLogItemsForm.asObservable();

  fileUploadsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new FileUploadsForm(
         new Array<FileUpload>(),
         this.customValidator,
         this.formBuilder
       )
     )
   );

  fileUploadsForm$: Observable<UntypedFormGroup | undefined> =
    this.fileUploadsForm.asObservable();

  damagedRoomsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new DamagedRoomsForm(
         new Array<DamagedRoom>(),
         this.customValidator,
         this.formBuilder
       )
     )
   );

  damagedRoomsForm$: Observable<UntypedFormGroup | undefined> =
    this.damagedRoomsForm.asObservable();

  supportingDocumentsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new SupportingDocumentsForm(
         new SupportingDocuments(),
       )
     )
   );

  supportingDocumentsForm$: Observable<UntypedFormGroup | undefined> =
    this.supportingDocumentsForm.asObservable();

  signAndSubmitForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group({
        applicantSignature: this.formBuilder.group({
          signedName: ['', Validators.required],
          signature: ['', Validators.required],
          dateSigned: ['', Validators.required]
        }, { updateOn: 'change' }),
        secondaryApplicantSignature: this.formBuilder.group({
          signedName: [''],
          signature: [''],
          dateSigned: ['']
        }, { updateOn: 'change' })
      })
    );

  signAndSubmitForm$: Observable<UntypedFormGroup | undefined> =
    this.signAndSubmitForm.asObservable();

  //Appeal Forms
  appealReasonForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new AppealReasonForm(new AppealReason(), this.customValidator)
      )
    );

  appealReasonForm$: Observable<UntypedFormGroup | undefined> =
    this.appealReasonForm.asObservable();

  AppealSignAndSubmitForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group({
        applicantSignature: this.formBuilder.group({
          signedName: ['', [Validators.required]],
          signature: ['', [Validators.required]],
          dateSigned: ['', [Validators.required]]
        }),
        secondaryApplicantSignature: this.formBuilder.group({
          signedName: [''],
          signature: [''],
          dateSigned: ['']
        })
      })
    );

  AppealSignAndSubmitForm$: Observable<UntypedFormGroup | undefined> =
    this.AppealSignAndSubmitForm.asObservable();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidator: CustomValidationService
  ) {
    this.insuranceOptionChanged = new EventEmitter<any>();
    this.applicantOptionChanged = new EventEmitter<any>();
    this.farmOptionChanged = new EventEmitter<any>();
    this.smallBusinessOptionChanged = new EventEmitter<any>();
    this.appTypeInsuranceFormValidityChange = new EventEmitter<string>();
    this.signaturesChanged = new EventEmitter<UntypedFormGroup>();
  }

  getPersonalDetailsForm(): Observable<UntypedFormGroup> {
    return this.personalDetailsForm$;
  }

  setPersonDetailsForm(personForm: UntypedFormGroup): void {
    this.personalDetailsForm.next(personForm);
  }

  getContactDetailsForm(): Observable<UntypedFormGroup> {
    return this.contactDetailsForm$;
  }

  setContactDetailsForm(contactForm: UntypedFormGroup): void {
    this.contactDetailsForm.next(contactForm);
  }

  getAddressForm(): Observable<UntypedFormGroup> {
    return this.addressForm$;
  }

  setAddressForm(addressForm: UntypedFormGroup): void {
    this.addressForm.next(addressForm);
  }

  clearProfileData(): void {
    this.restrictionForm.next(
      this.formBuilder.group(new RestrictionForm(new Restriction()))
    );
    this.addressForm.next(
      this.formBuilder.group(
        new AddressForm(new Address(), this.formBuilder, this.customValidator)
      )
    );
    this.personalDetailsForm.next(
      this.formBuilder.group(
        new PersonDetailsForm(new PersonDetails(), this.customValidator)
      )
    );
    this.contactDetailsForm.next(
      this.formBuilder.group(
        new ContactDetailsForm(new ContactDetails(), this.customValidator)
      )
    );
  }

  getAppTypeInsuranceForm(): Observable<UntypedFormGroup> {
    return this.appTypeInsuranceForm$;
  }

  setAppTypeInsuranceForm(appTypeInsuranceForm: UntypedFormGroup): void {
    this.appTypeInsuranceForm.next(appTypeInsuranceForm);
  }

  clearAppTypeInsuranceData(): void {
    this.appTypeInsuranceForm.next(
      this.formBuilder.group(
        new AppTypeInsuranceForm(
          new AppTypeInsurance(), this.formBuilder, this.customValidator
        )
      )
    );
  }

  getConsentForm(): Observable<UntypedFormGroup> {
    return this.consentForm$;
  }

  setConsentForm(consentForm: UntypedFormGroup): void {
    this.consentForm.next(consentForm);
  }

  clearConsentData(): void {
    this.consentForm.next(
      this.formBuilder.group(
        new ConsentForm(
          new Consent()
        )
      )
    );
  }

  getProfileVerificationForm(): Observable<UntypedFormGroup> {
    return this.profileVerificationForm$;
  }

  setProfileVerificationForm(profileVerificationForm: UntypedFormGroup): void {
    this.profileVerificationForm.next(profileVerificationForm);
  }

  clearProfileVerificationData(): void {
    this.profileVerificationForm.next(
      this.formBuilder.group(
        new ProfileVerificationForm(
          new ProfileVerification(),
          this.formBuilder,
          this.customValidator
        )
      )
    );
  }

  getDfaPrescreeningForm(): Observable<UntypedFormGroup> {
    return this.dfaPrescreeningForm$;
  }

  seDfaPrescreeningForm(dfaPrescreeningForm: UntypedFormGroup): void {
    this.dfaPrescreeningForm.next(dfaPrescreeningForm);
  }

  clearDfaPrescreeningData(): void {
    this.dfaPrescreeningForm.next(
      this.formBuilder.group(
        new DfaPrescreeningForm(
          new DfaPrescreening(),
          this.customValidator
        )
      )
    );
  }

  getDamagedPropertyAddressForm(): Observable<UntypedFormGroup> {
    return this.damagedPropertyAddressForm$;
  }

  setDamagedPropertyAddressForm(damagedPropertyAddressForm: UntypedFormGroup): void {
    this.appTypeInsuranceForm.next(damagedPropertyAddressForm);
  }

  clearDamagedPropertyAddressData(): void {
    this.damagedPropertyAddressForm.next(
      this.formBuilder.group(
        new DamagedPropertyAddressForm(
          new DamagedPropertyAddress(),
          this.customValidator
        )
      )
    );
  }

  getPropertyDamageForm(): Observable<UntypedFormGroup> {
    return this.propertyDamageForm$;
  }

  setPropertyDamageForm(propertyDamageForm: UntypedFormGroup): void {
    this.propertyDamageForm.next(propertyDamageForm);
  }

  clearPropertyDamageData(): void {
    this.propertyDamageForm.next(
      this.formBuilder.group(
        new PropertyDamageForm(
          new PropertyDamage(),
          this.customValidator
        )
      )
    );
  }

  getFullTimeOccupantsForm(): Observable<UntypedFormGroup> {
    return this.fullTimeOccupantsForm$;
  }

  setFullTimeOccupantsForm(fullTimeOccupantsForm: UntypedFormGroup): void {
    this.fullTimeOccupantsForm.next(fullTimeOccupantsForm);
  }

  clearFullTimeOccupantsData(): void {
    this.fullTimeOccupantsForm.next(
      this.formBuilder.group(
        new FullTimeOccupantsForm(
          new Array<FullTimeOccupant>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
  }

  getOtherContactsForm(): Observable<UntypedFormGroup> {
    return this.otherContactsForm$;
  }

  setOtherContactsForm(otherContactsForm: UntypedFormGroup): void {
    this.otherContactsForm.next(otherContactsForm);
  }

  clearOtherContactsData(): void {
    this.otherContactsForm.next(
      OtherContactsForm.createForm(this.customValidator, this.formBuilder)
    );
  }

  getSecondaryApplicantsForm(): Observable<UntypedFormGroup> {
    return this.secondaryApplicantsForm$;
  }

  setSecondaryApplicantsForm(secondaryApplicantsForm: UntypedFormGroup): void {
    this.secondaryApplicantsForm.next(secondaryApplicantsForm);
  }

  clearSecondaryApplicantsData(): void {
    this.secondaryApplicantsForm.next(
      this.formBuilder.group(
        new SecondaryApplicantsForm(
          new Array<SecondaryApplicant>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
  }

  getCleanUpLogForm(): Observable<UntypedFormGroup> {
    return this.cleanUpLogForm$;
  }

  setCleanUpLogForm(cleanUpLogForm: UntypedFormGroup): void {
    this.cleanUpLogForm.next(cleanUpLogForm);
  }

  clearCleanUpLogData(): void {
    this.cleanUpLogForm.next(
      this.formBuilder.group(
        new CleanUpLogForm(
          new CleanUpLog()
        )
      )
    );
  }

  getCleanUpLogItemsForm(): Observable<UntypedFormGroup> {
    return this.cleanUpLogItemsForm$;
  }

  setCleanUpLogItemsForm(cleanUpLogItemsForm: UntypedFormGroup): void {
    this.cleanUpLogForm.next(cleanUpLogItemsForm);
  }

  clearCleanUpLogItemsData(): void {
    this.cleanUpLogItemsForm.next(
      this.formBuilder.group(
        new CleanUpLogItemsForm(
          new Array<CleanUpLogItem>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
  }

  getDamagedRoomsForm(): Observable<UntypedFormGroup> {
    return this.damagedRoomsForm$;
  }

  setDamagedRoomsForm(damagedRoomsForm: UntypedFormGroup): void {
    this.damagedRoomsForm.next(damagedRoomsForm);
  }

  clearDamagedRoomsData(): void {
    this.damagedRoomsForm.next(
      this.formBuilder.group(
        new DamagedRoomsForm(
          new Array<DamagedRoom>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
  }

  getFileUploadsForm(): Observable<UntypedFormGroup> {
    return this.fileUploadsForm$;
  }

  setFileUploadsForm(fileUploadsForm: UntypedFormGroup): void {
    this.fileUploadsForm.next(fileUploadsForm);
  }

  clearFileUploadsData(): void {
    this.fileUploadsForm.next(
      this.formBuilder.group(
        new FileUploadsForm(
          new Array<FileUpload>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );
  }

  getSupportingDocumentsForm(): Observable<UntypedFormGroup> {
    return this.supportingDocumentsForm$;
  }

  setSupportingDocumentsForm(supportingDocumentsForm: UntypedFormGroup): void {
    this.supportingDocumentsForm.next(supportingDocumentsForm);
  }

  clearSupportingDocumentsData(): void {
    this.supportingDocumentsForm.next(
      this.formBuilder.group(
        new SupportingDocumentsForm(
          new SupportingDocuments()
        )
      )
    );
  }

  getSignAndSubmitForm(): Observable<UntypedFormGroup> {
    return this.signAndSubmitForm$;
  }

  setSignAndSubmitForm(signAndSubmitForm: UntypedFormGroup): void {
    this.signAndSubmitForm.next(signAndSubmitForm);
  }

  clearSignAndSubmitData(): void {
    this.signAndSubmitForm.next(
      this.formBuilder.group(
        new SignAndSubmitForm(
          new SignAndSubmit(),
          this.formBuilder
        )
      )
    );
  }

  getApplicationDetailsForm(): Observable<UntypedFormGroup> {
    return this.applicationDetailsForm$;
  }

  setApplicationDetailsForm(applicationDetailsForm: UntypedFormGroup): void {
    this.applicationDetailsForm.next(applicationDetailsForm);
  }

  clearApplicationDetailsData(): void {
    this.applicationDetailsForm.next(
      this.formBuilder.group(
        new ApplicationDetailsForm(
          new ApplicationDetails()
        )
      )
    );
  }

  // Appeal forms
  getAppealReasonForm(): Observable<UntypedFormGroup> {
    return this.appealReasonForm$;
  }

  setAppealReasonForm(appealReasonForm: UntypedFormGroup): void {
    this.appealReasonForm.next(appealReasonForm);
  }

  clearAppealReasonData(): void {
    this.appealReasonForm.next(
      this.formBuilder.group(
        new AppealReasonForm(new AppealReason(), this.customValidator)
      )
    );
  }

  getAppealSignAndSubmitForm(): Observable<UntypedFormGroup> {
    return this.AppealSignAndSubmitForm$;
  }

  setAppealSignAndSubmitForm(AppealSignAndSubmitForm: UntypedFormGroup): void {
    this.AppealSignAndSubmitForm.next(AppealSignAndSubmitForm);
  }

  clearAppealSignAndSubmitData(): void {
    this.AppealSignAndSubmitForm.next(
      this.formBuilder.group(
        new AppealSignAndSubmitForm(new AppealSignAndSubmit(), this.formBuilder)
      )
    );
  }
}

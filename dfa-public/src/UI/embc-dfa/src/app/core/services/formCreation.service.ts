import { Injectable, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import {
  PersonDetailsForm,
  PersonDetails,
  ContactDetailsForm,
  ContactDetails,
  AddressForm,
  Address,
  RestrictionForm,
  Restriction,
} from '../model/profile.model';
import { AppTypeInsurance, AppTypeInsuranceForm, Consent, ConsentForm, ProfileVerification, ProfileVerificationForm } from '../model/dfa-application-start.model';
import { DfaPrescreening, DfaPrescreeningForm } from '../model/dfa-prescreening.model';
import { InsuranceOption } from 'src/app/core/api/models';
import { ApplicationDetailsForm, DamagedPropertyAddressForm, DamagedPropertyAddress, SignAndSubmit, SupportingDocuments, DamagedRoomsForm,
  FullTimeOccupantsForm, SecondaryApplicantsForm, OtherContactsForm,
  CleanUpLogForm, SignAndSubmitForm, SupportingDocumentsForm, CleanUpLog, CleanUpLogItemsForm, SecondaryApplicant, FullTimeOccupant, OtherContact, CleanUpLogItem, DamagedRoom,  
  ApplicationDetails, ContactsForm, Contacts, AuthorizedRepresentative, AuthorizedRepresentativeForm} from '../model/dfa-application-main.model';
import { CustomValidationService } from './customValidation.service';
import { FileUpload, FileUploadsForm, ProjectAmendment, ProjectAmendmentForm, RecoveryPlan, RecoveryPlanForm } from '../model/dfa-project-main.model';
import { FileUploadClaim, FileUploadsClaimForm, RecoveryClaim, RecoveryClaimForm } from '../model/dfa-claim-main.model';
import { Invoice, InvoiceForm } from '../model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class FormCreationService {
  public insuranceOptionChanged: EventEmitter<any>;
  public applicantOptionChanged: EventEmitter<any>;
  public farmOptionChanged: EventEmitter<any>;
  public smallBusinessOptionChanged: EventEmitter<any>;
  public appTypeInsuranceFormValidityChange: EventEmitter<string>;
  public signaturesChanged: EventEmitter<UntypedFormGroup>;
  public AppTypeInsuranceData: AppTypeInsurance;
  /* EMCRI-1066 */
  public authorizedRepresentativeChanged: EventEmitter<UntypedFormGroup>;

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

  applicationDetailsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ApplicationDetailsForm(
         new ApplicationDetails(),
         this.customValidator
       )
     )
   );

  applicationDetailsForm$: Observable<UntypedFormGroup | undefined> =
    this.applicationDetailsForm.asObservable();

  // 2024-09-03 EMCRI-663 waynezen; Create contacts
  contactsForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ContactsForm(
          new Contacts(),
          this.customValidator
        )
      )
    );

  contactsForm$: Observable<UntypedFormGroup | undefined> =
    this.contactsForm.asObservable();


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
      this.formBuilder.group(
       new OtherContactsForm(
         new Array<OtherContact>(),
         this.customValidator,
         this.formBuilder
       )
     )
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

  fileUploadsClaimForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new FileUploadsClaimForm(
          new Array<FileUploadClaim>(),
          this.customValidator,
          this.formBuilder
        )
      )
    );

  fileUploadsClaimForm$: Observable<UntypedFormGroup | undefined> =
    this.fileUploadsClaimForm.asObservable();

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
      this.formBuilder.group(
       new SignAndSubmitForm(
         new SignAndSubmit(),
         this.formBuilder
       )
     )
   );

  signAndSubmitForm$: Observable<UntypedFormGroup | undefined> =
    this.signAndSubmitForm.asObservable();

  recoveryPlanForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new RecoveryPlanForm(
          new RecoveryPlan(),
          this.customValidator
        )
      )
    );

  recoveryPlanForm$: Observable<UntypedFormGroup | undefined> =
    this.recoveryPlanForm.asObservable();

  projectAmendmentForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new ProjectAmendmentForm(
          new ProjectAmendment()
        )
      )
    );

  projectAmendmentForm$: Observable<UntypedFormGroup | undefined> =
    this.projectAmendmentForm.asObservable();

  recoveryClaimForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new RecoveryClaimForm(
          new RecoveryClaim(),
          this.customValidator
        )
      )
    );

  recoveryClaimForm$: Observable<UntypedFormGroup | undefined> =
    this.recoveryClaimForm.asObservable();

  invoiceForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
        new InvoiceForm(
          new Invoice(),
          this.customValidator
        )
      )
    );

  invoiceForm$: Observable<UntypedFormGroup | undefined> =
    this.invoiceForm.asObservable();
        
  constructor(
    private formBuilder: UntypedFormBuilder,
    private customValidator: CustomValidationService
  ) {
    this.insuranceOptionChanged = new EventEmitter<any>();
    this.applicantOptionChanged = new EventEmitter<any>();
    this.farmOptionChanged = new EventEmitter<any>();
    this.smallBusinessOptionChanged = new EventEmitter<any>();
    this.appTypeInsuranceFormValidityChange = new EventEmitter<string>();
    this.signaturesChanged = new EventEmitter<UntypedFormGroup>;
    this.authorizedRepresentativeChanged = new EventEmitter<UntypedFormGroup>;
  }

  /* EMCRI-1066: Authorized Representative */
  authorizedRepresentativeForm: BehaviorSubject<UntypedFormGroup | undefined> =
    new BehaviorSubject(
      this.formBuilder.group(
       new AuthorizedRepresentativeForm(
         new AuthorizedRepresentative(),
         this.customValidator
       )
     )
   );

  authorizedRepresentativeForm$: Observable<UntypedFormGroup | undefined> =
    this.authorizedRepresentativeForm.asObservable();

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
          new ApplicationDetails(),
          this.customValidator
        )
      )
    );
  }

  // 2024-09-03 EMCRI-663 waynezen; Create Contacts
  getContactsForm(): Observable<UntypedFormGroup> {
    return this.contactsForm$;
  }

  setContactsForm(contactsForm: UntypedFormGroup): void {
    this.contactsForm.next(contactsForm);
  }

  clearContactsData(): void {
    this.contactsForm.next(
      this.formBuilder.group(
        new ContactsForm(
          new Contacts(),
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
      this.formBuilder.group(
        new OtherContactsForm(
          new Array<OtherContact>(),
          this.customValidator,
          this.formBuilder
        )
      )
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

  getClaimFileUploadsForm(): Observable<UntypedFormGroup> {
    return this.fileUploadsClaimForm$;
  }

  setClaimFileUploadsForm(fileUploadsClaimForm: UntypedFormGroup): void {
    this.fileUploadsClaimForm.next(fileUploadsClaimForm);
  }

  clearClaimFileUploadsData(): void {
    this.fileUploadsClaimForm.next(
      this.formBuilder.group(
        new FileUploadsClaimForm(
          new Array<FileUploadClaim>(),
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

  getRecoveryPlanForm(): Observable<UntypedFormGroup> {
    return this.recoveryPlanForm$;
  }

  setRecoveryPlanForm(recoveryPlanForm: UntypedFormGroup): void {
    this.recoveryPlanForm.next(recoveryPlanForm);
  }

  clearRecoveryPlanData(): void {
    this.recoveryPlanForm.next(
      this.formBuilder.group(
        new RecoveryPlanForm(
          new RecoveryPlan(),
          this.customValidator
        )
      )
    );
  }

  getProjectAmendmentForm(): Observable<UntypedFormGroup> {
    return this.projectAmendmentForm$;
  }

  setProjectAmendmentForm(projectAmendmentForm: UntypedFormGroup): void {
    this.projectAmendmentForm.next(projectAmendmentForm);
  }

  clearProjectAmendmentData(): void {
    this.projectAmendmentForm.next(
      this.formBuilder.group(
        new ProjectAmendmentForm(
          new ProjectAmendment()
        )
      )
    );
  }

  getRecoveryClaimForm(): Observable<UntypedFormGroup> {
    return this.recoveryClaimForm$;
  }

  setRecoveryClaimForm(recoveryClaimForm: UntypedFormGroup): void {
    this.recoveryClaimForm.next(recoveryClaimForm);
  }

  clearRecoveryClaimData(): void {
    this.recoveryClaimForm.next(
      this.formBuilder.group(
        new RecoveryClaimForm(
          new RecoveryClaim(),
          this.customValidator
        )
      )
    );
  }

  getInvoiceForm(): Observable<UntypedFormGroup> {
    return this.invoiceForm$;
  }

  setInvoiceForm(invoiceForm: UntypedFormGroup): void {
    this.invoiceForm.next(invoiceForm);
  }

  clearInvoiceData(): void {
    this.invoiceForm.next(
      this.formBuilder.group(
        new InvoiceForm(
          new Invoice(),
          this.customValidator
        )
      )
    );
  }

  /* EMCRI-1066: Authorized Representative */
  getAuthorizedRepresentativeForm():Observable<UntypedFormGroup> {
    return this.authorizedRepresentativeForm$;
  }

  setAuthorizedRepresentativeForm(authorizedRepresentativeForm: UntypedFormGroup): void {
    this.authorizedRepresentativeForm.next(authorizedRepresentativeForm);
  }

  clearAuthorizedRepresentativeData(): void {
    this.authorizedRepresentativeForm.next(
      this.formBuilder.group(
        new AuthorizedRepresentativeForm(
          new AuthorizedRepresentative,
          this.customValidator
        )
      )
    )
  }

}

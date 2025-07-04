import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Profile, ProfileDataConflict } from '../../core/api/models';
import { ProfileDataService } from './profile-data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ConflictManagementService } from '../../sharedModules/components/conflict-management/conflict-management.service';
import { LocationService } from 'src/app/core/services/location.service';

@Injectable({ providedIn: 'root' })
export class ProfileMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private profileDataService: ProfileDataService,
    private conflictService: ConflictManagementService,
    private locationService: LocationService,
  ) {}

  mapProfile(profile: Profile): void {
    this.profileDataService.setProfileId(profile.id);
    this.profileDataService.setProfile(profile);
    this.setExistingProfile(profile);
  }

  mapLoginProfile(profile: Profile): void {
    this.setLoginProfile(profile);
    this.profileDataService.setLoginProfile(profile);
  }

  mapConflicts(conflicts: ProfileDataConflict[]): void {
    this.conflictService.setConflicts(conflicts);
    this.conflictService.setCount(conflicts.length);
    this.conflictService.setHasVisitedConflictPage(true);
  }

  setExistingProfile(profile: Profile): void {
    //this.setRestrictionDetails(profile);
    this.setPersonalDetails(profile);
    this.setAddressDetails(profile);
    this.setContactDetails(profile);
  }

  setLoginProfile(profile: Profile): void {
    this.populateFromBCSC(profile);
  }

  populateFromBCSC(profile: Profile): void {
    this.formCreationService
      .getPersonalDetailsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          firstName: profile.personalDetails.firstName,
          lastName: profile.personalDetails.lastName,
          indigenousStatus: '',
          //preferredName: null,
          initials: null,
        });
      });

    this.formCreationService
      .getContactDetailsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          email: profile.contactDetails.email,
          confirmEmail: profile.contactDetails.email,
          showContacts: true,
          cellPhoneNumber: profile.contactDetails.cellPhoneNumber,
          residencePhone: profile.contactDetails.residencePhone,
          alternatePhone: profile.contactDetails.alternatePhone
        });
      });

    this.profileDataService.primaryAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.primaryAddress);
    this.formCreationService
      .getAddressForm()
      .pipe(first())
      .subscribe((address) => {
        address.setValue({
          address: {
            addressLine1:
              this.profileDataService.primaryAddressDetails?.addressLine1,
            addressLine2:
              this.profileDataService.primaryAddressDetails.addressLine2,
            community: this.profileDataService.primaryAddressDetails.community,
            stateProvince:
              this.profileDataService.primaryAddressDetails.stateProvince,
            postalCode: this.profileDataService.primaryAddressDetails.postalCode,
            country: null,
            isAddressVerified: true
          },
          isBcAddress: null,
          isNewMailingAddress: null,
          isBcMailingAddress: null,
          mailingAddress: {
            addressLine1: null,
            addressLine2: null,
            community: null,
            stateProvince: null,
            country: null,
            postalCode: null,
            isAddressVerified: false
          }
        });
      });
  }

  private setPersonalDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getPersonalDetailsForm()
      .pipe(first())
      .subscribe((details) => {
        details.setValue({
          ...profile.personalDetails
        });
        formGroup = details;
      });
    this.profileDataService.personalDetails = profile.personalDetails;
  }

  private setAddressDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getAddressForm()
      .pipe(first())
      .subscribe((address) => {
        const primaryAddress = this.locationService.getAddressRegFromAddress(
          profile.primaryAddress
        );
        const mailingAddress = this.locationService.getAddressRegFromAddress(
          profile.mailingAddress
        );
        address.setValue({
          address: primaryAddress,
          isBcAddress: this.isBCAddress(profile.primaryAddress.stateProvince),
          isNewMailingAddress: (profile.isMailingAddressSameAsPrimaryAddress == 'NoAddress' ? 'I don\'t have a mailing address right now' : profile.isMailingAddressSameAsPrimaryAddress),
          isBcMailingAddress: this.isBCAddress(
            profile.mailingAddress.stateProvince
          ),
          mailingAddress: mailingAddress
        });
        formGroup = address;
      });
    this.profileDataService.primaryAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.primaryAddress);
    this.profileDataService.mailingAddressDetails =
      this.locationService.getAddressRegFromAddress(profile.mailingAddress);
    this.profileDataService.IsMailingAddressSameAsPrimaryAddressDetails = profile.isMailingAddressSameAsPrimaryAddress;
  }

  private setContactDetails(profile: Profile): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getContactDetailsForm()
      .pipe(first())
      .subscribe((contact) => {
        contact.setValue({
          ...profile.contactDetails,
          confirmEmail: profile.contactDetails.email,
          showContacts: this.setShowContactsInfo(
            profile.contactDetails.cellPhoneNumber,
            profile.contactDetails.email
          )
        });
        formGroup = contact;
      });
    this.profileDataService.contactDetails = profile.contactDetails;
  }

  private setShowContactsInfo(phoneNumber: string, email: string): boolean {
    if (phoneNumber != null || email != null) {
      return true;
    } else {
      return false;
    }
  }

  //private setSecurityQuestions(profile: Profile): void {
  //  let formGroup: UntypedFormGroup;

  //  this.formCreationService
  //    .getSecurityQuestionsForm()
  //    .pipe(first())
  //    .subscribe((securityQuestions) => {
  //      securityQuestions.setValue({
  //        questions: {
  //          question1: profile.securityQuestions[0].question,
  //          answer1: profile.securityQuestions[0].answer,
  //          question2: profile.securityQuestions[1].question,
  //          answer2: profile.securityQuestions[1].answer,
  //          question3: profile.securityQuestions[2].question,
  //          answer3: profile.securityQuestions[2].answer
  //        }
  //      });
  //      formGroup = securityQuestions;
  //    });
  //  this.profileDataService.securityQuestions = profile.securityQuestions;
  //}

  private isSameMailingAddress(
    isMailingAddressSameAsPrimaryAddress: string
  ): string {
    return isMailingAddressSameAsPrimaryAddress;
  }

  private isBCAddress(province: null | string): string {
    return province !== null && province === 'BC' ? 'Yes' : 'No';
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EvacueeProfileService } from 'src/app/core/services/evacuee-profile.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

import * as globalConst from 'src/app/core/services/global-constants';
import { Community } from 'src/app/core/services/locations.service';
import { WizardAdapterService } from '../../wizard-adapter.service';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { SecurityQuestion } from 'src/app/core/api/models';
import { TabModel } from 'src/app/core/models/tab.model';
import { EvacueeMetaDataModel } from 'src/app/core/models/evacuee-metadata.model';
import { CustomErrorMailMatcher } from '../contact/contact.component';
import { RegistrationsService } from '../../../../core/api/services/registrations.service';

@Component({
  selector: 'app-profile-review',
  templateUrl: './profile-review.component.html',
  styleUrls: ['./profile-review.component.scss']
})
export class ProfileReviewComponent implements OnInit, OnDestroy {
  verifiedProfileGroup: FormGroup = null;
  tabUpdateSubscription: Subscription;

  saveLoader = false;
  disableButton = false;

  displayQuestions: SecurityQuestion[];

  primaryCommunity: string;
  mailingCommunity: string;
  tabMetaData: TabModel;
  inviteEmailGroup: FormGroup = null;
  emailMatcher = new CustomErrorMailMatcher();
  wizardType = WizardType;

  constructor(
    private router: Router,
    private wizardService: WizardService,
    private wizardAdapterService: WizardAdapterService,
    private evacueeProfileService: EvacueeProfileService,
    private registrationsService: RegistrationsService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public stepEvacueeProfileService: StepEvacueeProfileService,
    public evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    // Set up form validation for verification check
    this.primaryCommunity =
      typeof this.stepEvacueeProfileService.primaryAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.primaryAddressDetails?.community
        : (
            this.stepEvacueeProfileService.primaryAddressDetails
              ?.community as Community
          )?.name;
    this.mailingCommunity =
      typeof this.stepEvacueeProfileService.mailingAddressDetails?.community ===
      'string'
        ? this.stepEvacueeProfileService.mailingAddressDetails?.community
        : (
            this.stepEvacueeProfileService.mailingAddressDetails
              ?.community as Community
          )?.name;
    this.verifiedProfileGroup = this.formBuilder.group({
      verifiedProfile: [
        this.stepEvacueeProfileService.verifiedProfile,
        Validators.required
      ]
    });

    // Set up displayed version of Security Questions, depending on if they've been edited
    this.displayQuestions =
      this.stepEvacueeProfileService.editQuestions ||
      !(this.stepEvacueeProfileService.savedQuestions?.length > 0)
        ? this.stepEvacueeProfileService.securityQuestions
        : this.stepEvacueeProfileService.savedQuestions;

    // Set "update tab status" method, called for any tab navigation
    this.tabUpdateSubscription =
      this.stepEvacueeProfileService.nextTabUpdate?.subscribe(() => {
        this.updateTabStatus();
      });
    this.tabMetaData = this.stepEvacueeProfileService.getNavLinks('review');

    this.inviteEmailGroup = this.formBuilder.group(
      {
        email: [this.stepEvacueeProfileService.inviteEmail, Validators.email],
        confirmEmail: [
          this.stepEvacueeProfileService.confirmEmail,
          Validators.email
        ]
      },
      { validators: [this.confirmEmailValidator()] }
    );
  }

  get verifiedProfileControl(): { [key: string]: AbstractControl } {
    return this.verifiedProfileGroup.controls;
  }

  get inviteEmailControl(): { [key: string]: AbstractControl } {
    return this.inviteEmailGroup.controls;
  }

  /**
   * Go back to the Security Questions tab
   */
  back(): void {
    this.router.navigate([this.tabMetaData?.previous]);
  }

  /**
   * Create or update evacuee profile and continue to Step 2
   */
  save(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    if (this.verifiedProfileGroup.valid && this.inviteEmailGroup.valid) {
      this.saveLoader = true;

      if (
        !this.evacueeSessionService.profileId &&
        this.evacueeSessionService.getWizardType() ===
          WizardType.NewRegistration
      ) {
        this.createNewProfile();
      } else if (
        !this.evacueeSessionService.profileId &&
        this.evacueeSessionService.getWizardType() ===
          WizardType.MemberRegistration
      ) {
        this.createMemberRegistration();
      } else {
        this.editProfile();
      }
    } else {
      this.verifiedProfileControl.verifiedProfile.markAsTouched();
      this.inviteEmailControl.email.markAsTouched();
      this.inviteEmailControl.confirmEmail.markAsTouched();
    }
  }

  createNewProfile() {
    this.evacueeProfileService
      .createProfile(this.stepEvacueeProfileService.createProfileDTO())
      .subscribe({
        next: (profile: RegistrantProfileModel) => {
          if (this.inviteEmailControl.email.value) {
            this.sendEmailInvite(profile);
          } else {
            this.disableButton = true;
            this.saveLoader = false;
            this.setProfileMetaData(profile.id);
            this.createNewProfileDialog(profile);
          }
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  sendEmailInvite(profile: RegistrantProfileModel) {
    this.registrationsService
      .registrationsInviteToRegistrantPortal({
        registrantId: profile.id,
        body: { email: this.inviteEmailControl.email.value }
      })
      .subscribe({
        next: () => {
          this.disableButton = true;
          this.saveLoader = false;
          this.setProfileMetaData(profile.id);
          this.createNewProfileDialog(profile);
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.bcscInviteError);
        }
      });
  }

  createMemberRegistration() {
    this.evacueeProfileService
      .createMemberRegistration(
        this.stepEvacueeProfileService.createProfileDTO(),
        this.evacueeSessionService.memberRegistration.id,
        this.evacueeSessionService.essFileNumber
      )
      .subscribe({
        next: (profile) => {
          this.disableButton = true;
          this.saveLoader = false;
          this.setProfileMetaData(this.evacueeSessionService.profileId); //TODO-Sue
          this.memberProfileDialog();
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  createNewProfileDialog(profile: RegistrantProfileModel) {
    this.stepEvacueeProfileService
      .openModal(globalConst.newRegWizardProfileCreatedMessage)
      .afterClosed()
      .subscribe({
        next: () => {
          this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
          this.wizardAdapterService.stepCreateEssFileFromProfileRecord(profile);

          this.router.navigate(['/ess-wizard/ess-file'], {
            state: { step: 'STEP 2', title: 'Create ESS File' }
          });

          this.stepEvacueeProfileService.setFormValuesFromProfile(profile);
        }
      });
  }

  editProfile() {
    this.evacueeProfileService
      .updateProfile(
        this.evacueeSessionService.profileId,
        this.stepEvacueeProfileService.createProfileDTO()
      )
      .subscribe({
        next: (profile: RegistrantProfileModel) => {
          this.stepEvacueeProfileService.setFormValuesFromProfile(profile);
          this.disableButton = true;
          this.saveLoader = false;
          this.setProfileMetaData(profile.id);

          switch (this.evacueeSessionService.getWizardType()) {
            case WizardType.NewRegistration:
              this.editNewRegistrationProfileDialog(profile);
              return;

            case WizardType.EditRegistration:
              this.editProfileDialog();
              return;
          }
        },
        error: (error) => {
          this.saveLoader = false;
          this.alertService.clearAlert();
          this.alertService.setAlert(
            'danger',
            globalConst.createRegProfileError
          );
        }
      });
  }

  editNewRegistrationProfileDialog(profile: RegistrantProfileModel) {
    this.stepEvacueeProfileService
      .openModal(globalConst.newRegWizardProfileUpdatedMessage)
      .afterClosed()
      .subscribe({
        next: () => {
          this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
          this.wizardAdapterService.stepCreateEssFileFromEditProfileRecord(
            profile
          );

          this.router.navigate(['/ess-wizard/ess-file'], {
            state: { step: 'STEP 2', title: 'Create ESS File' }
          });
        }
      });
  }

  memberProfileDialog() {
    this.router
      .navigate(['responder-access/search/essfile-dashboard'])
      .then(() =>
        this.stepEvacueeProfileService.openModal(
          globalConst.memberProfileCreateMessage
        )
      );
  }

  editProfileDialog() {
    this.router
      .navigate(['responder-access/search/evacuee-profile-dashboard'])
      .then(() =>
        this.stepEvacueeProfileService.openModal(
          globalConst.evacueeProfileUpdatedMessage
        )
      );
  }

  /**
   * Checks if the email and confirm email field matches
   */
  confirmEmailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control) {
        const email = control.get('email').value;
        const confirmEmail = control.get('confirmEmail').value;
        if (email !== undefined && email !== null && email !== '') {
          if (
            confirmEmail === undefined ||
            confirmEmail === null ||
            confirmEmail === ''
          ) {
            return { emailMatch: true };
          }
          if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
            return { emailMatch: true };
          }
        }
      }
    };
  }

  /**
   * Checks the form validity and updates the tab status
   */
  updateTabStatus() {
    if (this.verifiedProfileGroup.valid) {
      this.stepEvacueeProfileService.setTabStatus('review', 'complete');
    }

    this.stepEvacueeProfileService.verifiedProfile =
      this.verifiedProfileGroup.get('verifiedProfile').value;
  }

  /**
   * When navigating away from tab, update variable value and status indicator
   */
  ngOnDestroy(): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.tabUpdateSubscription.unsubscribe();
  }

  private setProfileMetaData(registrantId: string) {
    const metaData: EvacueeMetaDataModel = {
      firstName: this.stepEvacueeProfileService?.personalDetails?.firstName,
      lastName: this.stepEvacueeProfileService?.personalDetails?.lastName,
      registrantId,
      fileId: null
    };
    this.evacueeSessionService.evacueeMetaData = metaData;
  }
}

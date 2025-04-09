import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { ProfileService } from '../profile/profile.service';
import { DFAApplicationStartDataService } from '../dfa-application-start/dfa-application-start-data.service';
import { DFAApplicationStartService } from '../dfa-application-start/dfa-application-start.service';
import { EditService } from './edit.service';
import * as globalConst from '../../core/services/globalConstants';
import { AppSessionService } from 'src/app/core/services/appSession.service';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  componentToLoad: string;
  profileFolderPath: string;
  dfaApplicationStartFolderPath: string;
  profileNavigationExtras: NavigationExtras = { state: { stepIndex: 3 } };
  form$: Subscription;
  form: UntypedFormGroup;
  editHeading: string;
  currentFlow: string;
  parentPageName: string;
  showLoader = false;
  verifiedRoute = '/verified-registration/create-profile';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private profileService: ProfileService,
    private profileDataService: ProfileDataService,
    private dfaApplicationStartService: DFAApplicationStartService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private alertService: AlertService,
    private editService: EditService,
    private appSessionService: AppSessionService,
    private cd: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state !== undefined) {
      const state = navigation.extras.state as { parentPageName: string };
      this.parentPageName = state.parentPageName;
      this.appSessionService.editParentPage = state.parentPageName;
    }
  }

  /**
   * Initializes the user flow and listens for route
   * parameters
   */
  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow;
    this.route.paramMap.subscribe((params) => {
      this.componentToLoad = params.get('type');
      this.loadForm(this.componentToLoad);
    });
    this.cd.detectChanges();
  }

  /**
   * Saves the updates information and navigates to review
   * page
   */
  save(): void {
    this.editService.saveFormData(
      this.componentToLoad,
      this.form,
      this.currentFlow
    );
    if (this.currentFlow !== 'non-verified-registration') {
      if (this.appSessionService.editParentPage === 'create-profile') {
        this.router.navigate(
          [this.verifiedRoute],
          this.profileNavigationExtras
        );
      } else if (this.appSessionService.editParentPage === 'dfa-dashboard') {
        this.showLoader = !this.showLoader;
        this.profileService
          .upsertProfile(this.profileDataService.createProfileDTO())
          .subscribe({
            next: (profileId) => {
              this.showLoader = !this.showLoader;
              this.router.navigate([
                '/dfa-dashboard/profile'
              ]);
            },
            error: (error) => {
              this.showLoader = !this.showLoader;
              document.location.href = 'https://dfa.gov.bc.ca/error.html';
            }
          });
      } else if (this.appSessionService.editParentPage === 'dfa-application-start') {
        this.router.navigate(
          [this.verifiedRoute]
        );
      }
    }
  }

  /**
   * Cancels the update operation and navigates to review
   * page
   */
  cancel(): void {
    this.editService.cancelFormData(
      this.componentToLoad,
      this.form,
      this.currentFlow
    );
    if (this.currentFlow !== 'non-verified-registration') {
      if (this.appSessionService.editParentPage === 'create-profile') {
        this.router.navigate(
          [this.verifiedRoute],
          this.profileNavigationExtras
        );
      } else if (this.appSessionService.editParentPage === 'dashboard') {
        this.router.navigate(['/verified-registration/dashboard/profile']);
      } else if (this.appSessionService.editParentPage === 'dfa-dashboard') {
        this.router.navigate(['/dfa-dashboard/profile']);
      }
    }
  }

  /**
   * Loads the form into view
   *
   * @param component form name
   */
  loadForm(component: string): void {
    switch (component) {
      case 'personal-details':
        this.form$ = this.formCreationService
          .getPersonalDetailsForm()
          .subscribe((personalDetails) => {
            this.form = personalDetails;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'address':
        this.form$ = this.formCreationService
          .getAddressForm()
          .subscribe((address) => {
            this.form = address;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'contact-info':
        this.form$ = this.formCreationService
          .getContactDetailsForm()
          .subscribe((contactDetails) => {
            this.form = contactDetails;
          });
        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'security-questions':

        this.editHeading = 'Edit Profile';
        this.profileFolderPath = 'evacuee-profile-forms';
        break;
      case 'apptype-insurance':
        this.form$ = this.formCreationService
          .getAppTypeInsuranceForm()
          .subscribe((appTypeInsurance) => {
            this.form = appTypeInsurance;
          });
        this.editHeading = 'Application Type & Insurance';
        this.dfaApplicationStartFolderPath = 'dfa-application-start-forms';
        break;
      // case 'profile-verification':
      //   this.form$ = this.formCreationService
      //     .getProfileVerificationForm()
      //     .subscribe((profileVerification) => {
      //       this.form = profileVerification;
      //     });
      //   this.editHeading = 'Profile Verification';
      //   this.dfaApplicationStartFolderPath = 'dfa-application-start-forms';
      //   break;
      case 'consent':
        this.form$ = this.formCreationService
          .getConsentForm()
          .subscribe((consent) => {
            this.form = consent;
          });
        this.editHeading = 'Consent';
        this.dfaApplicationStartFolderPath = 'dfa-application-start-forms';
        break;
     default:
    }
  }

  /**
   * Destroys the subscription on page destroy
   */
  ngOnDestroy(): void {
    this.form$.unsubscribe();
  }
}

import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import * as globalConst from '../../core/services/globalConstants';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { DFAApplicationStartDataService } from './dfa-application-start-data.service';
import { DFAApplicationStartService } from './dfa-application-start.service';
import { InsuranceOption, SignatureBlock } from 'src/app/core/api/models';
import { MatDialog } from '@angular/material/dialog';
import { DFAApplicationAlertDialogComponent } from 'src/app/core/components/dialog-components/dfa-application-alert-dialog/dfa-application-alert.component';
import { ProfileService } from 'src/app/core/api/services';
import { DFAPrescreeningDataService } from '../dfa-prescreening/dfa-prescreening-data.service';


@Component({
  selector: 'app-dfa-application-start',
  standalone: false,
  templateUrl: './dfa-application-start.component.html',
  styleUrls: ['./dfa-application-start.component.scss']
})
export class DFAApplicationStartComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('dfaApplicationStartStepper') dfaApplicationStartStepper: MatStepper;
  isEditable = true;
  showSaveButton: boolean = false;
  fullInsurance: boolean = false;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  dfaApplicationStartFolderPath = 'dfa-application-start-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'dfa-application-start';
  dfaApplicationStartHeading: string;
  parentPageName = 'dfa-application-start';
  showLoader = false;
  isSubmitted = false;
  submitAllowed: boolean = true;

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private dfaApplicationStartService: DFAApplicationStartService,
    private profileService: ProfileService,
    public dialog: MatDialog,
    private dfaPrescreeningDataService: DFAPrescreeningDataService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation !== null) {
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
    }
    this.formCreationService.insuranceOptionChanged.subscribe((any) => {
      let yesEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Yes)];
      if (this.form?.controls?.insuranceOption?.value === yesEnumKey) this.fullInsurance = true; else this.fullInsurance = false;
      // this.checkSubmitAllowed();
      });

    this.formCreationService.applicantOptionChanged.subscribe((any) => {
      // this.checkSubmitAllowed();
    });

    this.formCreationService.smallBusinessOptionChanged.subscribe((any) => {
      // this.checkSubmitAllowed();
    })

    this.formCreationService.farmOptionChanged.subscribe((any) => {
      // this.checkSubmitAllowed();
    })
  }

  checkSubmitAllowed() {
    // debugger;
    this.submitAllowed = false;

    // must have a value for both applicant option and insurance option
    if (!this.dfaApplicationStartDataService.applicantOption || !this.dfaApplicationStartDataService.insuranceOption) return;

    // if insurance option is no check for signatures
    let noEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)];
    if (this.form?.get('insuranceOption')?.value == noEnumKey ) {
      if (!this.form?.get('applicantSignature')?.value || !this.form?.get('applicantSignature.dateSigned')?.value ||
        !this.form?.get('applicantSignature.signature')?.value || !this.form?.get('applicantSignature.signedName')?.value) {
        return;
      }
    }

    // check for valid form
    if (!this.form?.valid) return;

    this.submitAllowed = true;
  }

  ngOnInit(): void {
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    this.dfaApplicationStartHeading = 'Create Your Application';
    this.steps = this.componentService.createDFAApplicationStartSteps();
    this.formCreationService.clearAppTypeInsuranceData();
    this.dfaApplicationStartDataService.profileVerified = true;
    this.dfaApplicationStartDataService.consent = true;
    this.dfaApplicationStartDataService.applicantSignature = { dateSigned: null, signedName: null, signature: null};
    this.dfaApplicationStartDataService.secondaryApplicantSignature = { dateSigned: null, signedName: null, signature: null };
    this.dfaApplicationStartDataService.applicantOption = this.dfaPrescreeningDataService.dfaPrescreening.applicantOption;
    this.dfaApplicationStartDataService.farmOption = null;
    this.dfaApplicationStartDataService.insuranceOption = this.dfaPrescreeningDataService.dfaPrescreening.insuranceOption;
    this.dfaApplicationStartDataService.smallBusinessOption = null;
    this.dfaApplicationStartDataService.addressLine1 = this.dfaPrescreeningDataService.dfaPrescreening.addressLine1;
    this.dfaApplicationStartDataService.addressLine2 = this.dfaPrescreeningDataService.dfaPrescreening.addressLine2;
    this.dfaApplicationStartDataService.city = this.dfaPrescreeningDataService.dfaPrescreening.city;
    this.dfaApplicationStartDataService.postalCode = this.dfaPrescreeningDataService.dfaPrescreening.postalCode;
    this.dfaApplicationStartDataService.stateProvince = this.dfaPrescreeningDataService.dfaPrescreening.stateProvince;
    this.dfaApplicationStartDataService.isPrimaryAndDamagedAddressSame = this.dfaPrescreeningDataService.dfaPrescreening.isPrimaryAndDamagedAddressSame;
    this.dfaApplicationStartDataService.isDamagedAddressVerified = this.dfaPrescreeningDataService.dfaPrescreening.isDamagedAddressVerified;
    this.dfaApplicationStartDataService.damageCausedByDisaster = this.dfaPrescreeningDataService.dfaPrescreening.damageCausedByDisaster;
    this.dfaApplicationStartDataService.damageFromDate = this.dfaPrescreeningDataService.dfaPrescreening.damageFromDate;
    this.dfaApplicationStartDataService.eventId = this.dfaPrescreeningDataService.dfaPrescreening.eventId;
    this.dfaApplicationStartDataService.lossesExceed1000 = this.dfaPrescreeningDataService.dfaPrescreening.lossesExceed1000;
    this.dfaApplicationStartDataService.createDFAApplicationStartDTO();
    // this.checkSubmitAllowed();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
  }

  /**
   * Loads form for every step based on index
   *
   * @param index step index
   */
  currentStep(index: number): void {
    this.loadStepForm(index);
    this.cd.detectChanges();
  }

  /**
   * Triggered on the step change animation event
   *
   * @param event animation event
   * @param stepper stepper instance
   */
  stepChanged(event: any, stepper: MatStepper): void {
    stepper.selected.interacted = false;
  }

  /**
   * Dashboard
   */
  returnToDashboard(): void {
    const navigationPath = '/' + this.currentFlow + '/dashboard';
    this.router.navigate([navigationPath]);
  }

  /**
   * Custom back stepper function
   *
   * @param stepper stepper instance
   * @param lastStep stepIndex
   */
    goBack(stepper: MatStepper, lastStep): void {
      if (lastStep === 0) {
        stepper.previous();
      } else if (lastStep === -1) {
        this.showStep = !this.showStep;
      } else if (lastStep === -2) {
        this.returnToDashboard();
      }
    }

  /**
   * Custom next stepper function
   *
   * @param stepper stepper instance
   * @param isLast stepperIndex
   * @param component current component name
   */
  goForward(stepper: MatStepper, isLast: boolean, component: string): void {
    if (this.form.status === 'VALID') {
      this.setFormData(component);
      if (stepper.selectedIndex == 1) {
        this.updateProfile(stepper);
      }
      else if (isLast) {
        this.alertMessage(component);
      }
      else {
        this.form$.unsubscribe();
        stepper.selected.completed = true;
        stepper.next();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'consent':
        this.dfaApplicationStartDataService.consent = this.form.get('consent').value;
        break;
      case 'profile-verification':  // only udpateable fields
        this.dfaApplicationStartDataService.profileVerified = this.form.get('profileVerified').value;
        this.dfaApplicationStartDataService.profile.bcServiceCardId = this.form.get('profile.bcServiceCardId').value;
        this.dfaApplicationStartDataService.profile.id = this.form.get('profile.id').value;
        this.dfaApplicationStartDataService.profile.personalDetails.indigenousStatus = this.form.get('profile.personalDetails.indigenousStatus').value;
        this.dfaApplicationStartDataService.profile.personalDetails.initials = this.form.get('profile.personalDetails.initials').value;
        this.dfaApplicationStartDataService.profile.mailingAddress.addressLine1 = this.form.get('profile.mailingAddress.addressLine1').value;
        this.dfaApplicationStartDataService.profile.mailingAddress.addressLine2 = this.form.get('profile.mailingAddress.addressLine2').value;
        this.dfaApplicationStartDataService.profile.mailingAddress.city = this.form.get('profile.mailingAddress.city').value;
        this.dfaApplicationStartDataService.profile.mailingAddress.postalCode = this.form.get('profile.mailingAddress.postalCode').value;
        this.dfaApplicationStartDataService.profile.mailingAddress.stateProvince = this.form.get('profile.mailingAddress.stateProvince').value;
        this.dfaApplicationStartDataService.profile.contactDetails.alternatePhone = this.form.get('profile.contactDetails.alternatePhone').value;
        this.dfaApplicationStartDataService.profile.contactDetails.cellPhoneNumber = this.form.get('profile.contactDetails.cellPhoneNumber').value;
        this.dfaApplicationStartDataService.profile.contactDetails.residencePhone = this.form.get('profile.contactDetails.residencePhone').value;
        this.dfaApplicationStartDataService.profile.contactDetails.email = this.form.get('profile.contactDetails.email').value;
        break;
      case 'apptype-insurance':
        this.dfaApplicationStartDataService.applicantOption = this.form.controls.applicantOption.value;
        this.dfaApplicationStartDataService.insuranceOption = this.form.controls.insuranceOption.value;
        this.dfaApplicationStartDataService.smallBusinessOption = this.form.controls.smallBusinessOption.value;
        this.dfaApplicationStartDataService.farmOption = this.form.controls.farmOption.value;
        if (this.form.get('applicantSignature').get('signature')?.value) {
          this.dfaApplicationStartDataService.applicantSignature =
          { signature: this.form.get('applicantSignature').get('signature').value,
          dateSigned: this.form.get('applicantSignature').get('dateSigned').value,
          signedName: this.form.get('applicantSignature').get('signedName').value} as SignatureBlock;
        } else this.dfaApplicationStartDataService.applicantSignature = null;
        if (this.form.get('secondaryApplicantSignature')?.get('signature')?.value) {
          this.dfaApplicationStartDataService.secondaryApplicantSignature =
          { signature: this.form.get('secondaryApplicantSignature').get('signature').value,
          dateSigned: this.form.get('secondaryApplicantSignature').get('dateSigned').value,
          signedName: this.form.get('secondaryApplicantSignature').get('signedName').value} as SignatureBlock;
        } else this.dfaApplicationStartDataService.secondaryApplicantSignature = null;
        break;
      default:
    }
  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param index Step index
   */
  loadStepForm(index: number): void {
    switch (index) {
      case 0:
        this.form$ = this.formCreationService
          .getConsentForm()
          .subscribe((consent) => {
            this.form = consent;
          });
        this.showSaveButton = false;
        break;
      case 1:
        this.form$ = this.formCreationService
          .getProfileVerificationForm()
          .subscribe((profileVerification) => {
            this.form = profileVerification;
          });
        this.showSaveButton = false;
        break;
      case 2:
        this.form$ = this.formCreationService
          .getAppTypeInsuranceForm()
          .subscribe((appTypeInsurance) => {
            this.form = appTypeInsurance;
          });
        this.showSaveButton = true;
        break;
    }
  }

  backToDashboard(): void {
    this.showLoader = !this.showLoader;
    this.alertService.clearAlert();
    this.router.navigate(['/verified-registration/dashboard']);
  }

  submitFile(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.alertService.clearAlert();
    this.dfaApplicationStartService
    .upsertApplication(this.dfaApplicationStartDataService.createDFAApplicationStartDTO())
     .subscribe({
      next: (applicationId) => {
       this.dfaApplicationStartDataService.setApplicationId(applicationId);
        this.router.navigate(['/dfa-application-main/'+applicationId]);
      },
      error: (error) => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
     });
  }

  updateProfile(stepper: MatStepper): void {
    this.showLoader = !this.showLoader;
    this.profileService
    .profileAddContact({ body: this.dfaApplicationStartDataService.profile })
     .subscribe({
      next: (msg) => {
        this.showLoader = !this.showLoader;
        this.form$.unsubscribe();
        stepper.selected.completed = true;
        stepper.next();
       return
      },
      error: (error) => {
        console.error(error);
        this.showLoader = !this.showLoader;
      }
     });
  }

  alertMessage(component: string): void {
    this.dialog
      .open(DFAApplicationAlertDialogComponent, {
        data: {
          content: globalConst.uneditableApplicationTypeAlert
        },
        height: '300px',
        width: '600px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'cancel') {
          //this.cancelApplication();
        }
        else if (result === 'confirm') {
          this.setFormData(component);
          this.submitFile();
        }
        //else this.appTypeInsuranceForm.controls.insuranceOption.setValue(null);
      });
  }
}

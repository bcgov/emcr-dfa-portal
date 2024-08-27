import { Component, OnInit, NgModule, Inject, OnDestroy, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Address, ApplicantOption, InsuranceOption, DisasterEvent, Profile } from 'src/app/core/api/models';
import { DFAEligibilityDialogComponent } from 'src/app/core/components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { CoreModule } from 'src/app/core/core.module';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { EligibilityService, ProfileService } from 'src/app/core/api/services';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { DFAPrescreeningDataService } from 'src/app/feature-components/dfa-prescreening/dfa-prescreening-data.service';
import { AuthModule, AuthOptions, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'prescreening',
  templateUrl: './prescreening.component.html',
  styleUrls: ['./prescreening.component.scss']
})
export default class PrescreeningComponent implements OnInit, OnDestroy {
  prescreeningForm: UntypedFormGroup;
  notInsured: boolean = false;
  formBuilder: UntypedFormBuilder;
  prescreeningForm$: Subscription;
  formCreationService: FormCreationService;
  radioApplicantOptions = ApplicantOption;
  radioInsuranceOptions = InsuranceOption;
  showOtherDocuments: boolean = false;
  private _profile: Profile;
  todayDate = new Date().toISOString();
  isValidAddressAndDate: boolean = false;
  public openDisasterEvents: DisasterEventMatching[] = [];
  matchingEventsData: DisasterEventMatching[] = [];
  public isLoggedIn: boolean = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dialog: MatDialog,
    private router: Router,
    private profileService: ProfileService,
    private eligibilityService: EligibilityService,
    private prescreeningDataService: DFAPrescreeningDataService,
    private oidcSecurityService: OidcSecurityService,
    private loginService: LoginService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  public get profile(): Profile {
    return this._profile;
  }
  public set profile(value: Profile) {
    this._profile = value;
  }

  ngOnInit(): void {
    this.prescreeningForm$ = this.formCreationService
      .getDfaPrescreeningForm()
      .subscribe((prescreening) => {
        this.prescreeningForm = prescreening;
        this.prescreeningForm.updateValueAndValidity();
        // add form level validator to check that insurance option is not set to yes
        this.prescreeningForm.addValidators([ValidateInsuranceOption.notFullInsurance('insuranceOption', InsuranceOption.Yes)]);
      });

    this.prescreeningDataService.clearPreScreeningAnswers.subscribe(any => {
      this.prescreeningForm.reset();
      this.prescreeningForm.updateValueAndValidity();
    })

    // 2024-05-27 EMCRI-217 waynezen: use new BCeID async Auth
    this.oidcSecurityService.isAuthenticated().subscribe(isAuth => {
      if (isAuth == true) {
        this.isLoggedIn = true;
        this.getProfileAddress();
      }
      else {
        this.prescreeningForm.controls.isPrimaryAndDamagedAddressSame.setValidators(null);
        this.prescreeningForm.controls.profileId.setValidators(null);
        this.prescreeningForm.updateValueAndValidity();
      }
    });

    this.getOpenDisasterEvents();

    this.prescreeningForm
      .get('applicantOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.prescreeningForm.get('applicantOption').reset();
        }
        this.formCreationService.applicantOptionChanged.emit();
        this.prescreeningForm.updateValueAndValidity();
        });

    let fullyInsuredEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Yes)];
    let notInsuredEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)];
    let unsureEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Unsure)];

    this.prescreeningForm
      .get('insuranceOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.prescreeningForm.get('insuranceOption').reset();
          this.notInsured = false;
        } else if (value === fullyInsuredEnumKey) {
          this.yesFullyInsured();
          this.notInsured = false;
        } else if (value === notInsuredEnumKey) {
          this.notInsured = true;
        } else if (value === unsureEnumKey) {
          this.notInsured = false;
        }
        this.prescreeningForm.updateValueAndValidity();
        this.formCreationService.insuranceOptionChanged.emit();
      });

    this.prescreeningForm
      .get('damageCausedByDisaster')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('damageCausedByDisaster').reset();
        else if (value === 'false')
          this.dontContinuePrescreening(globalConst.damageNotCausedByDisasterBody, "damageCausedByDisaster");
      });

    this.prescreeningForm
      .get('lossesExceed1000')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('lossesExceed1000').reset();
        else if (value === 'false')
          this.dontContinuePrescreening(globalConst.lossesDontExceed1000, "lossesExceed1000");
      });

    this.prescreeningForm
      .get('damageFromDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('damageFromDate').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('addressLine1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('addressLine1').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('addressLine2')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('addressLine2').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('city')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('city').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('community')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.prescreeningForm.get('community').reset();
        } else this.prescreeningForm.get('city').setValue(this.prescreeningForm.get('community').value);
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('postalCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('postalCode').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('stateProvince')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('stateProvince').reset();
        this.checkIsValidAddressAndDate();
      });

    this.prescreeningForm
      .get('eventId')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('eventId').reset();
      });

    this.prescreeningForm
      .get('isDamagedAddressVerified')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '')
          this.prescreeningForm.get('isDamagedAddressVerified').reset();
      });
  }

  getProfileAddress() {
    this.profileService.profileGetProfile().subscribe(profile => {
      this.profile = profile;
      this.prescreeningForm.controls.profileId.setValue(profile.id);
    });
  }

  getOpenDisasterEvents() {
    this.eligibilityService.eligibilityGetOpenEvents().subscribe((openDisasterEvents: DisasterEventMatching[]) => {
      this.openDisasterEvents = openDisasterEvents;
    })
  }

  checkIsValidAddressAndDate() {
    if (this.prescreeningForm.controls.addressLine1.valid &&
      this.prescreeningForm.controls.city.valid &&
      this.prescreeningForm.controls.postalCode.valid &&
      this.prescreeningForm.controls.stateProvince.valid &&
      this.prescreeningForm.controls.damageFromDate.valid)
      this.isValidAddressAndDate = true;
    else this.isValidAddressAndDate = false;
    this.matchingEventsData = [];
    if (this.isValidAddressAndDate) this.checkAddressAndDateWithinOpenEvent();
  }

  yesFullyInsured(): void {
    this.dialog
      .open(DFAEligibilityDialogComponent, {
        data: {
          content: globalConst.yesFullyInsuredBody
        },
        height: '400px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'cancel') {
          this.cancelPrescreening();
          }
        else if (result === 'confirm') {
          this.prescreeningForm.controls.insuranceOption.setValue(null);
          this.prescreeningForm.updateValueAndValidity();
        }
        else this.prescreeningForm.controls.insuranceOption.setValue(null);
        this.formCreationService.insuranceOptionChanged.emit();
      });
  }

  onUseProfileAddressChoice(choice: any) {
    
    this.prescreeningForm.controls.stateProvince.setValue("BC");
    if (!choice.value) return; // not a radio button change
    if (choice.value == 'true') // yes
    {
      this.prescreeningForm.controls.addressLine1.setValue(this.profile.primaryAddress.addressLine1);
      this.prescreeningForm.controls.addressLine2.setValue(this.profile.primaryAddress.addressLine2);
      this.prescreeningForm.controls.city.setValue(this.profile.primaryAddress.city);
      this.prescreeningForm.controls.community.setValue(this.profile.primaryAddress.city);
      this.prescreeningForm.controls.stateProvince.setValue(this.profile.primaryAddress.stateProvince);
      this.prescreeningForm.controls.postalCode.setValue(this.profile.primaryAddress.postalCode);
    } else { // no
      this.prescreeningForm.controls.addressLine1.setValue(null);
      this.prescreeningForm.controls.addressLine2.setValue(null);
      this.prescreeningForm.controls.city.setValue(null);
      this.prescreeningForm.controls.community.setValue(null);
      this.prescreeningForm.controls.postalCode.setValue(null);
    }
    this.checkIsValidAddressAndDate();
  }

  public onToggleOtherDocuments() {
    this.showOtherDocuments = !this.showOtherDocuments;
  }

  dontContinuePrescreening(content: DialogContent, controlName: string) {
    this.dialog
      .open(DFAEligibilityDialogComponent, {
        data: {
          content: content
        },
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'cancel') {
          this.cancelPrescreening();
          }
        else if (result === 'confirm') {
          this.prescreeningForm.get(controlName).setValue("true");
        }
        else this.prescreeningForm.get(controlName).setValue(null);
      });
  }

  cancelPrescreening(): void {
    // TODO: Add application cancellation
    this.router.navigate(['/dfa-dashboard']);
  }

  checkAddressAndDateWithinOpenEvent(): void {
    // TODO: check if address with GeoBC data
    this.openDisasterEvents.forEach(disasterEvent => disasterEvent.matchArea = true);

    // check for date of damage between start date and end date
    this.openDisasterEvents.forEach(disasterEvent => {
      if (new Date(new Date(disasterEvent.endDate).toDateString()) >= this.prescreeningForm.controls.damageFromDate.value &&
        new Date(new Date(disasterEvent.startDate).toDateString()) <= this.prescreeningForm.controls.damageFromDate.value) {
        disasterEvent.matchDate = true;
      } else disasterEvent.matchDate = false;
    })

    // Matching Events to display
    this.matchingEventsData = this.openDisasterEvents.filter(disasterEvent => disasterEvent.matchArea == true && disasterEvent.matchDate == true);

    let countMatchingEvents = this.matchingEventsData.length;
    if (countMatchingEvents <= 0) {
      this.dialog
      .open(DFAEligibilityDialogComponent, {
        data: {
          content: globalConst.addressAndDateNotWithinOpenEvent
        },
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'cancel') {
          this.cancelPrescreening();
        }
      });
    } else if (countMatchingEvents == 1) {
      this.prescreeningForm.controls.eventId.setValue(this.matchingEventsData[0].eventId);
      this.prescreeningForm.updateValueAndValidity();
    }
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  /**
   * Returns the control of the form
   */
  get prescreeningFormControl(): { [key: string]: AbstractControl } {
    return this.prescreeningForm.controls;
  }

  updateOnVisibility(): void {
    this.prescreeningForm.controls.lossesExceed1000.updateValueAndValidity();
    this.prescreeningForm.controls.insuranceOption.updateValueAndValidity();
    this.prescreeningForm.controls.applicantOption.updateValueAndValidity();
    this.prescreeningForm.controls.damageCausedByDisaster.updateValueAndValidity();
    this.prescreeningForm.controls.damgeFromDate.updateValueAndValidity();
    this.prescreeningForm.controls.addressLine1.updateValueAndValidity();
    this.prescreeningForm.controls.addressLine2.updateValueAndValidity();
    this.prescreeningForm.controls.city.updateValueAndValidity();
    this.prescreeningForm.controls.postalCode.updateValueAndValidity();
    this.prescreeningForm.controls.stateProvince.updateValueAndValidity();
    this.prescreeningForm.controls.eventId.updateValueAndValidity();
    this.prescreeningForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.prescreeningForm$.unsubscribe();
  }
}

// Form Level Validator cant proceed to next step if insurance is 'Yes'
export class ValidateInsuranceOption {
  static notFullInsurance(controlName: string, badOption: InsuranceOption): ValidatorFn {

    return (controls: AbstractControl) => {
      const control = controls.get(controlName);

      let enumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(badOption)];
      if (control.value !== enumKey) {
        return null;
      }
      else {
        control.setErrors({ notFullInsurance: true});
        return { notFullInsurance: true };
      }
    };
  }
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    AddressFormsModule,
    MatTableModule,
    MatSelectModule,
  ],
  declarations: [PrescreeningComponent]
})
class AppTypeInsuranceModule {}

export interface DisasterEventMatching extends DisasterEvent {
  matchArea: boolean;
  matchDate: boolean;
}

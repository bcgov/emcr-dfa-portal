import { Component, OnInit, NgModule, Inject, OnDestroy, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { SmallBusinessOption, ApplicantOption, SignatureBlock, InsuranceOption, FarmOption } from 'src/app/core/api/models';
import { DFAEligibilityDialogComponent } from 'src/app/core/components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import * as globalConst from '../../../../core/services/globalConstants';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { CoreModule } from 'src/app/core/core.module';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';

@Component({
  selector: 'apptype-insurance',
  standalone: false,
  templateUrl: './apptype-insurance.component.html',
  styleUrls: ['./apptype-insurance.component.scss']
})
export default class AppTypeInsuranceComponent implements OnInit, OnDestroy {
  appTypeInsuranceForm: UntypedFormGroup;
  notInsured: boolean = false;
  formBuilder: UntypedFormBuilder;
  appTypeInsuranceForm$: Subscription;
  formCreationService: FormCreationService;
  radioApplicantOptions = ApplicantOption;
  radioInsuranceOptions = InsuranceOption;
  radioSmallBusinessOptions = SmallBusinessOption;
  radioFarmOptions = FarmOption;
  showOtherDocuments: boolean = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dialog: MatDialog,
    private router: Router,
    private dfaApplicationStartDataService: DFAApplicationStartDataService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {

    let fullyInsuredEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Yes)];
    let notInsuredEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)];
    let unsureEnumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Unsure)];

    this.appTypeInsuranceForm$ = this.formCreationService
      .getAppTypeInsuranceForm()
      .subscribe((appTypeInsurance) => {
        this.appTypeInsuranceForm = appTypeInsurance;
        // pre-set from prescreening choices
        this.appTypeInsuranceForm.controls.applicantOption.setValue(this.dfaApplicationStartDataService.applicantOption);
        this.appTypeInsuranceForm.controls.insuranceOption.setValue(this.dfaApplicationStartDataService.insuranceOption);
        if (this.dfaApplicationStartDataService.insuranceOption == InsuranceOption.No) this.notInsured = true;
        else this.notInsured = false;
        this.appTypeInsuranceForm.updateValueAndValidity();
        // add form level validator to check that insurance option is not set to yes
        this.appTypeInsuranceForm.addValidators([ValidateInsuranceOption.notFullInsurance('insuranceOption', InsuranceOption.Yes)]);
        // another form level validator to check that if insurance option is no, signature data is provided
        this.appTypeInsuranceForm.addValidators([this.validateNoInsuranceHasSignatures]);
      });

    this.appTypeInsuranceForm
      .get('applicantOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.appTypeInsuranceForm.get('applicantOption').reset();
        }
        if (value === ApplicantOption.SmallBusinessOwner) {
          this.appTypeInsuranceForm.get('smallBusinessOption').setValidators([Validators.required]);
          this.appTypeInsuranceForm.get('farmOption').setValidators(null);
        } else if (value === ApplicantOption.FarmOwner) {
          this.appTypeInsuranceForm.get('smallBusinessOption').setValidators(null);
          this.appTypeInsuranceForm.get('farmOption').setValidators([Validators.required]);
        } else {
          this.appTypeInsuranceForm.get('smallBusinessOption').setValidators(null);
          this.appTypeInsuranceForm.get('farmOption').setValidators(null);
        }
        this.formCreationService.setAppTypeInsuranceForm(this.appTypeInsuranceForm);
        this.formCreationService.applicantOptionChanged.emit();
        this.appTypeInsuranceForm.updateValueAndValidity();
      });

    this.appTypeInsuranceForm
      .get('insuranceOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.appTypeInsuranceForm.get('insuranceOption').reset();
          this.appTypeInsuranceForm.get('applicantSignature.signature').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.dateSigned').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.signedName').setValidators(null);
          this.notInsured = false;
        } else if (value === fullyInsuredEnumKey) {
          this.appTypeInsuranceForm.get('applicantSignature.signature').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.dateSigned').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.signedName').setValidators(null);
          this.yesFullyInsured();
          this.notInsured = false;
        } else if (value === notInsuredEnumKey) {
          this.appTypeInsuranceForm.get('applicantSignature.signature').setValidators([Validators.required]);
          this.appTypeInsuranceForm.get('applicantSignature.dateSigned').setValidators([Validators.required]);
          this.appTypeInsuranceForm.get('applicantSignature.signedName').setValidators([Validators.required]);
          this.notInsured = true;
        } else if (value === unsureEnumKey) {
          this.appTypeInsuranceForm.get('applicantSignature.signature').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.dateSigned').setValidators(null);
          this.appTypeInsuranceForm.get('applicantSignature.signedName').setValidators(null);
          this.notInsured = false;
        }
        this.appTypeInsuranceForm.get('applicantSignature.signature').updateValueAndValidity();
        this.appTypeInsuranceForm.get('applicantSignature.dateSigned').updateValueAndValidity();
        this.appTypeInsuranceForm.get('applicantSignature.signedName').updateValueAndValidity();
        this.appTypeInsuranceForm.get('applicantSignature').updateValueAndValidity();
        this.appTypeInsuranceForm.updateValueAndValidity();
        this.formCreationService.insuranceOptionChanged.emit();
      });

    this.appTypeInsuranceForm
      .get('smallBusinessOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.appTypeInsuranceForm.get('smallBusinessOption').reset();
        }
        this.formCreationService.smallBusinessOptionChanged.emit();
      });

    this.appTypeInsuranceForm
      .get('farmOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.appTypeInsuranceForm.get('farmOption').reset();
        }
        this.formCreationService.farmOptionChanged.emit();
      });

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
          this.cancelApplication();
          }
        else if (result === 'confirm') {
          this.appTypeInsuranceForm.controls.insuranceOption.setValue(Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)]);
          this.appTypeInsuranceForm.updateValueAndValidity();
        }
        else this.appTypeInsuranceForm.controls.insuranceOption.setValue(null);
        this.formCreationService.insuranceOptionChanged.emit();
      });
  }

  cancelApplication(): void {
    // TODO: Add application cancellation
    this.router.navigate(['/verified-registration/dashboard']);
  }

  public onToggleOtherDocuments() {
    this.showOtherDocuments = !this.showOtherDocuments;
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  /**
   * Returns the control of the form
   */
  get appTypeInsuranceFormControl(): { [key: string]: AbstractControl } {
    return this.appTypeInsuranceForm.controls;
  }

  updateOnVisibility(): void {
    this.appTypeInsuranceForm.get('appTypeInsurance').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.appTypeInsuranceForm$.unsubscribe();
  }

  // check for No Ins & valid signature information
  validateNoInsuranceHasSignatures(form: FormGroup) {
    let enumKey = Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)];
    if (form.controls.insuranceOption.value !== enumKey) return null; // Yes or Yes, but

    // Check applicant signature (always required)
    if (
      !form.get('applicantSignature.signature').value ||
      !form.get('applicantSignature.signedName').value ||
      !form.get('applicantSignature.dateSigned').value
    ) {
      return { invalidSignature: true };
    }

    // Check secondary applicant signature (optional, but if any field is filled, require all)
    const sec = form.get('secondaryApplicantSignature');
    const secName = sec.get('signedName').value;
    const secSig = sec.get('signature').value;
    const secDate = sec.get('dateSigned').value;

    // Only consider the group "started" if signedName or signature is filled
    const secondaryStarted = !!(secName || secSig);

    // If started, require all three fields
    if (secondaryStarted && !(secName && secSig && secDate)) {
      return { invalidSecondarySignature: true };
    }

    // If applicant signature is valid, and secondary is either empty or fully filled, form is valid
    return null;
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
  ],
  declarations: [AppTypeInsuranceComponent]
})
class AppTypeInsuranceModule {}

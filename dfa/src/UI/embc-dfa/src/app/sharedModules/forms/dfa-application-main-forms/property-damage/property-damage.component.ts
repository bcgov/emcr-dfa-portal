import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { ApplicantOption } from 'src/app/core/api/models';


@Component({
  selector: 'app-property-damage',
  standalone: false,
  templateUrl: './property-damage.component.html',
  styleUrls: ['./property-damage.component.scss']
})
export default class PropertyDamageComponent implements OnInit, OnDestroy {
  propertyDamageForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  propertyDamageForm$: Subscription;
  formCreationService: FormCreationService;
  remainingLength: number = 2000;
  todayDate = new Date().toISOString();
  public ApplicantOptions = ApplicantOption;
  isResidentialTenant: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isReadOnly: boolean = false;
  isFarmOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  radioOption: string[] = ['Yes', 'No', 'Not sure'];


  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,

  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
    || dfaApplicationMainDataService.getViewOrEdit() === 'edit'
    || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');
    this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
      || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })
  }

  setViewOrEditControls() {
    if (!this.propertyDamageForm) return;
    if (this.isReadOnly) {
      this.propertyDamageForm.controls.floodDamage.disable();
      this.propertyDamageForm.controls.landslideDamage.disable();
      this.propertyDamageForm.controls.stormDamage.disable();
      this.propertyDamageForm.controls.otherDamage.disable();
      this.propertyDamageForm.controls.wereYouEvacuated.disable();
      this.propertyDamageForm.controls.residingInResidence.disable();
      this.propertyDamageForm.controls.previousApplication.disable();
      this.propertyDamageForm.controls.previousApplicationText.disable();
    } else {
      this.propertyDamageForm.controls.floodDamage.enable();
      this.propertyDamageForm.controls.landslideDamage.enable();
      this.propertyDamageForm.controls.stormDamage.enable();
      this.propertyDamageForm.controls.otherDamage.enable();
      this.propertyDamageForm.controls.wereYouEvacuated.enable();
      this.propertyDamageForm.controls.residingInResidence.enable();
      this.propertyDamageForm.controls.previousApplication.enable();
      this.propertyDamageForm.controls.previousApplicationText.enable();
    }
  }

  OnSelectionPreviousApplication(element) {
    if (element == 'No' && !this.isReadOnly) {
      this.propertyDamageForm.get('previousApplicationText').setValue('');
    }
  }

  ngOnInit(): void {
    this.propertyDamageForm$ = this.formCreationService
      .getPropertyDamageForm()
      .subscribe((propertyDamage) => {
        this.propertyDamageForm = propertyDamage;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
          if (application && application.appTypeInsurance) {
            this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
            this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
            this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
            this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
            this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
            if (this.isHomeowner || this.isResidentialTenant) {
              this.propertyDamageForm.controls.wereYouEvacuated.setValidators([Validators.required]);
              this.propertyDamageForm.controls.residingInResidence.setValidators([Validators.required]);
            } else if (this.isSmallBusinessOwner || this.isFarmOwner || this.isCharitableOrganization) {
              this.propertyDamageForm.controls.wereYouEvacuated.setValidators(null);
              this.propertyDamageForm.controls.wereYouEvacuated.setValue(null);
              this.propertyDamageForm.controls.dateReturned.setValue(null);
              this.propertyDamageForm.controls.residingInResidence.setValidators(null);
              this.propertyDamageForm.controls.residingInResidence.setValue(null);
            }
          this.propertyDamageForm.updateValueAndValidity();
          }
        });
        this.propertyDamageForm.addValidators([this.validateFormCauseOfDamage]);
        if (this.propertyDamageForm.get('otherDamage').value === 'true') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.propertyDamageForm.get('otherDamageText').updateValueAndValidity();
        this.propertyDamageForm.updateValueAndValidity();
      });

    this.propertyDamageForm
      .get('floodDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('floodDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('landslideDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('landslideDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('stormDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('stormDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('otherDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('otherDamage').reset();
        }  else if (value == 'true') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else if (value == 'false') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.propertyDamageForm.get('otherDamageText').updateValueAndValidity();
        this.propertyDamageForm.updateValueAndValidity();
      });

    this.propertyDamageForm
      .get('otherDamageText')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('otherDamageText').reset();
        }
      });

    this.propertyDamageForm
      .get('damageFromDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('damageFromDate').reset();
        }
      });

    this.propertyDamageForm
      .get('damageToDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('damageToDate').reset();
        }
      });

    this.propertyDamageForm
      .get('briefDescription')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('briefDescription').reset();
        }
      });

    this.propertyDamageForm
      .get('wereYouEvacuated')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('wereYouEvacuated').reset();
        }
      });

    this.propertyDamageForm
      .get('dateReturned')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('dateReturned').reset();
        }
      });

    this.propertyDamageForm
      .get('residingInResidence')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('residingInResidence').reset();
        }
      });

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.propertyDamageForm.disable();
    }
  }

  validateFormCauseOfDamage(form: FormGroup) {
    if (form.controls.stormDamage.value !== true &&
      form.controls.landslideDamage.value !== true &&
      form.controls.otherDamage.value !== true &&
      form.controls.floodDamage.value !== true) {
      return { noCauseOfDamage: true };
    }
    return null;
  }

  calcRemainingChars() {
    this.remainingLength = 2000 - this.propertyDamageForm.get('briefDescription').value?.length;
  }

  /**
   * Returns the control of the form
   */
  get propertyDamageFormControl(): { [key: string]: AbstractControl } {
    return this.propertyDamageForm.controls;
  }

  ngOnDestroy(): void {
    this.propertyDamageForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    DirectivesModule,
  ],
  declarations: [PropertyDamageComponent]
})
class PropertyDamageModule {}


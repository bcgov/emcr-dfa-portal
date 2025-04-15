import { Component, OnInit, NgModule, Inject, OnDestroy, OnChanges } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged, mapTo } from 'rxjs/operators';
import { SignatureBlock } from 'src/app/core/api/models';
import { CoreModule } from 'src/app/core/core.module';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { Signature } from 'typescript';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';

@Component({
  selector: 'app-sign-and-submit',
  standalone: false,
  templateUrl: './sign-and-submit.component.html',
  styleUrls: ['./sign-and-submit.component.scss']
})
export default class SignAndSubmitComponent implements OnInit, OnDestroy {
  signAndSubmitForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  signAndSubmitForm$: Subscription;
  formCreationService: FormCreationService;
  isSecondaryApplicant: boolean = false;
  isReadOnly: boolean = false;
  secondaryApplicants: SecondaryApplicant[] = [];
  initialApplicantSignature: SignatureBlock = {dateSigned: null, signedName: null, signature: null};
  initialSecondaryApplicantSignature: SignatureBlock = {dateSigned: null, signedName: null, signature: null};

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
    || dfaApplicationMainDataService.getViewOrEdit() === 'edit'
    || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
      || vieworedit === 'viewOnly');
    })
  }

  ngOnInit(): void {
    this.signAndSubmitForm$ = this.formCreationService
      .getSignAndSubmitForm()
      .subscribe((signAndSubmit) => {
        this.signAndSubmitForm = signAndSubmit;
        if (this.signAndSubmitForm.get('applicantSignature').get('signature').value) this.dfaApplicationMainDataService.isSubmitted = true;
        this.initialApplicantSignature.dateSigned = this.signAndSubmitForm?.get('applicantSignature')?.get('dateSigned').value;
        this.initialApplicantSignature.signedName = this.signAndSubmitForm?.get('applicantSignature')?.get('signedName').value;
        this.initialApplicantSignature.signature = this.signAndSubmitForm?.get('applicantSignature')?.get('signature').value;
        this.initialSecondaryApplicantSignature.dateSigned = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('dateSigned').value;
        this.initialSecondaryApplicantSignature.signedName = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('signedName').value;
        this.initialSecondaryApplicantSignature.signature = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('signature').value;
    });

    this.signAndSubmitForm
      .get('applicantSignature')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.signAndSubmitForm.get('applicantSignature').reset();
        }
        this.initialApplicantSignature.dateSigned = this.signAndSubmitForm?.get('applicantSignature')?.get('dateSigned').value;
        this.initialApplicantSignature.signedName = this.signAndSubmitForm?.get('applicantSignature')?.get('signedName').value;
        this.initialApplicantSignature.signature = this.signAndSubmitForm?.get('applicantSignature')?.get('signature').value;
      });

    this.signAndSubmitForm
    .get('secondaryApplicantSignature')
    .valueChanges.pipe(distinctUntilChanged())
    .subscribe((value) => {
      if (value === '') {
        this.signAndSubmitForm.get('secondaryApplicantSignature').reset();
      }
      this.initialSecondaryApplicantSignature.dateSigned = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('dateSigned').value;
      this.initialSecondaryApplicantSignature.signedName = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('signedName').value;
      this.initialSecondaryApplicantSignature.signature = this.signAndSubmitForm?.get('secondaryApplicantSignature')?.get('signature').value;
    });

    // subscribe to changes in secondary applicants
    const _secondaryApplicantsFormArray = this.formCreationService.secondaryApplicantsForm.value.get('secondaryApplicants');
    _secondaryApplicantsFormArray.valueChanges
      .pipe(
        mapTo(_secondaryApplicantsFormArray.getRawValue())
        ).subscribe(data => {
          this.secondaryApplicants = _secondaryApplicantsFormArray.getRawValue();
          if (this.secondaryApplicants.filter(x => x.deleteFlag != true)?.length > 0) {
            this.isSecondaryApplicant = true;
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('signature').setValidators([Validators.required]);
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('dateSigned').setValidators([Validators.required]);
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('signedName').setValidators([Validators.required, Validators.maxLength(100)]);
          } else {
            this.isSecondaryApplicant = false;
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('signature').setValidators(null);
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('dateSigned').setValidators(null);
            this.signAndSubmitForm.get('secondaryApplicantSignature').get('signedName').setValidators(Validators.maxLength(100));
          }
          this.signAndSubmitForm.get('secondaryApplicantSignature').updateValueAndValidity();
          this.signAndSubmitForm.updateValueAndValidity();
        });

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.signAndSubmitForm.disable();
    }
  }

  /**
   * Returns the control of the form
   */
  get signAndSubmitFormControl(): { [key: string]: AbstractControl } {
    return this.signAndSubmitForm.controls;
  }

  updateApplicantSignature(event: SignatureBlock) {
    this.signAndSubmitForm.get('applicantSignature').get('signedName').setValue(event.signedName);
    this.signAndSubmitForm.get('applicantSignature').get('dateSigned').setValue(event.dateSigned);
    this.signAndSubmitForm.get('applicantSignature').get('signature').setValue(event.signature);
    this.formCreationService.signaturesChanged.emit(this.signAndSubmitForm);
  }

  updateSecondaryApplicantSignature(event: SignatureBlock) {
    this.signAndSubmitForm.get('secondaryApplicantSignature').get('signedName').setValue(event.signedName);
    this.signAndSubmitForm.get('secondaryApplicantSignature').get('dateSigned').setValue(event.dateSigned);
    this.signAndSubmitForm.get('secondaryApplicantSignature').get('signature').setValue(event.signature);
    this.formCreationService.signaturesChanged.emit(this.signAndSubmitForm);
  }


  updateOnVisibility(): void {
    this.signAndSubmitForm.get('applicantSignature').updateValueAndValidity();
    this.signAndSubmitForm.get('secondaryApplicantSignature').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.signAndSubmitForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  declarations: [SignAndSubmitComponent]
})
class SignAndSubmitModule {}

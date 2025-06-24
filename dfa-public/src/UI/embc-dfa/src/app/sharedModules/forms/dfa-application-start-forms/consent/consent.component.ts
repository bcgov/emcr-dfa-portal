import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-consent',
  standalone: false,
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export default class ConsentComponent implements OnInit, OnDestroy {
  consentForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  consentForm$: Subscription;
  formCreationService: FormCreationService;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.consentForm$ = this.formCreationService
      .getConsentForm()
      .subscribe((consent) => {
        this.consentForm = consent;
        this.consentForm.updateValueAndValidity();
      });

    this.consentForm
      .get('consent')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.consentForm.get('consent').reset();
        }
      });

    // TODO: Implement the correct setting of this value, will it be a radio button or checkbox??
    this.consentForm.get('consent').setValue(true);
  }

  /**
   * Returns the control of the form
   */
  get consentFormControl(): { [key: string]: AbstractControl } {
    return this.consentForm.controls;
  }

  updateOnVisibility(): void {
    this.consentForm.get('consent').updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.consentForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  declarations: [ConsentComponent]
})
class ConsentModule {}

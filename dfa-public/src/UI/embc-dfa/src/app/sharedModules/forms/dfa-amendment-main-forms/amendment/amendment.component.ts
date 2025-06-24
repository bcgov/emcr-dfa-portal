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
import { ApplicationService, EligibilityService, ProfileService, ProjectService } from 'src/app/core/api/services';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { AuthModule, AuthOptions, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginService } from 'src/app/core/services/login.service';
import { DFAProjectAmendmentDataService } from 'src/app/feature-components/dfa-project-amendment/dfa-project-amendment-data.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';

@Component({
  selector: 'amendment',
  standalone: false,
  templateUrl: './amendment.component.html',
  styleUrls: ['./amendment.component.scss']
})
export default class AmendmentComponent implements OnInit, OnDestroy {
  amendmentForm: UntypedFormGroup;
  notInsured: boolean = false;
  formBuilder: UntypedFormBuilder;
  amendmentForm$: Subscription;
  formCreationService: FormCreationService;
  radioApplicantOptions = ApplicantOption;
  radioInsuranceOptions = InsuranceOption;
  showOtherDocuments: boolean = false;
  private _profile: Profile;
  todayDate = new Date().toISOString();
  isValidAddressAndDate: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dialog: MatDialog,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    private applicationService: ApplicationService,
    private projectService: ProjectService,
    private router: Router,
    private profileService: ProfileService,
    private eligibilityService: EligibilityService,
    private amendmentDataService: DFAProjectAmendmentDataService,
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
    this.amendmentForm$ = this.formCreationService
      .getProjectAmendmentForm()
      .subscribe((amendment) => {
        this.amendmentForm = amendment;
      });

/*     this.amendmentForm
      .get('applicantOption')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.amendmentForm.get('applicantOption').reset();
        }
        this.formCreationService.applicantOptionChanged.emit();
        this.amendmentForm.updateValueAndValidity();
        }); */

  }







  dontContinueAmendment(content: DialogContent, controlName: string) {
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
          this.cancelAmendment();
          }
        else if (result === 'confirm') {
          this.amendmentForm.get(controlName).setValue("true");
        }
        else this.amendmentForm.get(controlName).setValue(null);
      });
  }

  cancelAmendment(): void {
    // TODO: Add application cancellation
    this.router.navigate(['/dfa-dashboard']);
  }


  /**
   * Returns the control of the form
   */
  get amendmentFormControl(): { [key: string]: AbstractControl } {
    return this.amendmentForm.controls;
  }

  updateOnVisibility(): void {
    //this.amendmentForm.controls.lossesExceed1000.updateValueAndValidity();
    this.amendmentForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.amendmentForm$.unsubscribe();
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
  declarations: [AmendmentComponent]
})
class AmendmentModule {}

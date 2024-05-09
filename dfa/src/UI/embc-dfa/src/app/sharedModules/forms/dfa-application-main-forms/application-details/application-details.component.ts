import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileDataService } from '../../../../feature-components/profile/profile-data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import * as globalConst from '../../../../core/services/globalConstants';
import { RegAddress } from 'src/app/core/model/address';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { DFAEligibilityDialogComponent } from 'src/app/core/components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Profile, ApplicantOption, Address } from 'src/app/core/api/models';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { TextMaskModule } from 'angular2-text-mask';
import { MatInputModule } from '@angular/material/input';
import { ApplicationService, ProfileService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';


@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export default class DamagedPropertyAddressComponent implements OnInit, OnDestroy {
  consentForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  consentForm$: Subscription;
  formCreationService: FormCreationService;
  private _profileAddress: Address;
  public ApplicantOptions = ApplicantOption;
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  isResidentialTenant: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  isFarmOwner: boolean = false;
  accountLegalNameLabel: string = "";
  accountPlaceHolderLabel: string = "";
  isReadOnly: boolean = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private router: Router,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public profileDataService: ProfileDataService,
    public dialog: MatDialog,
    private applicationService: ApplicationService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    private profileService: ProfileService

  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
      || dfaApplicationMainDataService.getViewOrEdit() === 'edit'
      || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');
    //this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
      || vieworedit === 'viewOnly');
      //this.setViewOrEditControls();
    })
  }

  //setViewOrEditControls() {
  //  if (!this.damagedPropertyAddressForm) return;
  //  if (this.isReadOnly === true) {
  //    this.damagedPropertyAddressForm.controls.isPrimaryAndDamagedAddressSame.disable();
  //    this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.disable();
  //    this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.disable();
  //    this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.disable();
  //    this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.disable();
  //    this.damagedPropertyAddressForm.controls.farmoperation.disable();
  //    this.damagedPropertyAddressForm.controls.ownedandoperatedbya.disable();
  //    this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.disable();
  //    this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.disable();
  //    this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.disable();
  //    this.damagedPropertyAddressForm.controls.charityRegistered.disable();
  //    this.damagedPropertyAddressForm.controls.lossesExceed1000.disable();
  //    this.damagedPropertyAddressForm.controls.onAFirstNationsReserve.disable();
  //    this.damagedPropertyAddressForm.controls.manufacturedHome.disable();
  //    this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.disable();
  //  } else {
  //    this.damagedPropertyAddressForm.controls.isPrimaryAndDamagedAddressSame.enable();
  //    this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.enable();
  //    this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.enable();
  //    this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.enable();
  //    this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.enable();
  //    this.damagedPropertyAddressForm.controls.farmoperation.enable();
  //    this.damagedPropertyAddressForm.controls.ownedandoperatedbya.enable();
  //    this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.enable();
  //    this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.enable();
  //    this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.enable();
  //    this.damagedPropertyAddressForm.controls.charityRegistered.enable();
  //    this.damagedPropertyAddressForm.controls.lossesExceed1000.enable();
  //    this.damagedPropertyAddressForm.controls.onAFirstNationsReserve.enable();
  //    this.damagedPropertyAddressForm.controls.manufacturedHome.enable();
  //    this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.enable();
  //  }
  //}
  public get profileAddress(): Address {
    return this._profileAddress;
  }
  public set profileAddress(value: Address) {
    this._profileAddress = value;
  }

  ngOnInit(): void {
    //this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
    //  if (application) {
    //    if (!this.profileAddress) {
    //      this.profileService.profileGetProfile().subscribe(profile => {
    //        this.profileAddress = {
    //          addressLine1: profile?.primaryAddress?.addressLine1,
    //          addressLine2: profile?.primaryAddress?.addressLine2,
    //          postalCode: profile?.primaryAddress?.postalCode,
    //          stateProvince: profile?.primaryAddress?.stateProvince ? profile.primaryAddress?.stateProvince : "BC",
    //          city: profile?.primaryAddress?.city
    //        }
    //      })
    //    }
    //  }
    //});

    this.consentForm$ = this.formCreationService
      .getConsentForm()
      .subscribe((consent) => {
        this.consentForm = consent;
        this.consentForm.updateValueAndValidity();
      });

    //if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
    //  this.damagedPropertyAddressForm.disable();
    //}
  }

  getDamagedPropertyForApplication(applicationId: string) {
    this.applicationService.applicationGetApplicationMain({ applicationId: applicationId }).subscribe({
      next: (dfaApplicationMain) => {
        //console.log('dfaApplicationMain: ' + JSON.stringify(dfaApplicationMain))
        //if (dfaApplicationMain.notifyUser == true) {
        //  //this.notifyAddressChange();
        //}
        this.dfaApplicationMainMapping.mapDFAApplicationMain(dfaApplicationMain);
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  ngOnDestroy(): void {
    this.consentForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    TextMaskModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule,
    AddressFormsModule
  ],
  declarations: [DamagedPropertyAddressComponent]
})
class DamagedPropertyAddressModule {}

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
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { ApplicationService, ProfileService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { DialogContent } from 'src/app/core/model/dialog-content.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';


@Component({
  selector: 'app-damaged-property-address',
  templateUrl: './damaged-property-address.component.html',
  styleUrls: ['./damaged-property-address.component.scss']
})
export default class DamagedPropertyAddressComponent implements OnInit, OnDestroy {
  damagedPropertyAddressForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  damagedPropertyAddressForm$: Subscription;
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
    this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
      || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })
  }

  setViewOrEditControls() {
    if (!this.damagedPropertyAddressForm) return;
    if (this.isReadOnly === true) {
      this.damagedPropertyAddressForm.controls.isPrimaryAndDamagedAddressSame.disable();
      this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.disable();
      this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.disable();
      this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.disable();
      this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.disable();
      this.damagedPropertyAddressForm.controls.farmoperation.disable();
      this.damagedPropertyAddressForm.controls.ownedandoperatedbya.disable();
      this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.disable();
      this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.disable();
      this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.disable();
      this.damagedPropertyAddressForm.controls.charityRegistered.disable();
      this.damagedPropertyAddressForm.controls.lossesExceed1000.disable();
      this.damagedPropertyAddressForm.controls.onAFirstNationsReserve.disable();
      this.damagedPropertyAddressForm.controls.manufacturedHome.disable();
      this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.disable();
    } else {
      this.damagedPropertyAddressForm.controls.isPrimaryAndDamagedAddressSame.enable();
      this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.enable();
      this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.enable();
      this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.enable();
      this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.enable();
      this.damagedPropertyAddressForm.controls.farmoperation.enable();
      this.damagedPropertyAddressForm.controls.ownedandoperatedbya.enable();
      this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.enable();
      this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.enable();
      this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.enable();
      this.damagedPropertyAddressForm.controls.charityRegistered.enable();
      this.damagedPropertyAddressForm.controls.lossesExceed1000.enable();
      this.damagedPropertyAddressForm.controls.onAFirstNationsReserve.enable();
      this.damagedPropertyAddressForm.controls.manufacturedHome.enable();
      this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.enable();
    }
  }
  public get profileAddress(): Address {
    return this._profileAddress;
  }
  public set profileAddress(value: Address) {
    this._profileAddress = value;
  }

  ngOnInit(): void {
    this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
      if (application) {
        if (!this.profileAddress) {
          this.profileService.profileGetProfile().subscribe(profile => {
            this.profileAddress = {
              addressLine1: profile?.primaryAddress?.addressLine1,
              addressLine2: profile?.primaryAddress?.addressLine2,
              postalCode: profile?.primaryAddress?.postalCode,
              stateProvince: profile?.primaryAddress?.stateProvince ? profile.primaryAddress?.stateProvince : "BC",
              city: profile?.primaryAddress?.city
            }
          })
        }
      }
    });

    this.damagedPropertyAddressForm$ = this.formCreationService
    .getDamagedPropertyAddressForm()
    .subscribe((damagedPropertyAddress) => {
      this.damagedPropertyAddressForm = damagedPropertyAddress;
      this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
        this.damagedPropertyAddressForm.controls.lossesExceed1000.setValidators([Validators.required]);
        if (application) {
          this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
          this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
          this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
          this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
          this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
          this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.setValidators(null);
          this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.setValidators(null);
          this.damagedPropertyAddressForm.controls.landlordGivenNames.setValidators([Validators.maxLength(100)]);
          this.damagedPropertyAddressForm.controls.landlordSurname.setValidators([Validators.maxLength(100)]);
          this.damagedPropertyAddressForm.controls.landlordPhone.setValidators([Validators.maxLength(100)]);
          this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.setValidators(null);
          this.damagedPropertyAddressForm.controls.businessLegalName.setValidators(null);
          this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.setValidators(null);
          this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.setValidators(null);
          this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.setValidators(null);
          this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.setValidators(null);
          this.damagedPropertyAddressForm.controls.charityRegistered.setValidators(null);
          this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.setValidators(null);
          this.damagedPropertyAddressForm.controls.farmoperation.setValidators(null);
          this.damagedPropertyAddressForm.controls.ownedandoperatedbya.setValidators(null);
          this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.setValidators(null);
          this.accountLegalNameLabel = "farm's ";
          this.accountPlaceHolderLabel = "Farm";
          if (this.isHomeowner) {
            this.damagedPropertyAddressForm.controls.eligibleForHomeOwnerGrant.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.setValidators([Validators.required]);
          } else if (this.isResidentialTenant) {
            this.damagedPropertyAddressForm.controls.landlordGivenNames.setValidators([Validators.required, Validators.maxLength(100)]);
            this.damagedPropertyAddressForm.controls.landlordSurname.setValidators([Validators.required, Validators.maxLength(100)]);
            this.damagedPropertyAddressForm.controls.landlordPhone.setValidators([Validators.required, Validators.maxLength(100)]);
            this.damagedPropertyAddressForm.controls.occupyAsPrimaryResidence.setValidators([Validators.required]);
          } else if (this.isSmallBusinessOwner) {
            this.damagedPropertyAddressForm.controls.businessLegalName.setValidators([Validators.maxLength(100), Validators.required]);
            this.damagedPropertyAddressForm.controls.employLessThan50EmployeesAtAnyOneTime.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.grossRevenues100002000000BeforeDisaster.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.businessManagedByAllOwnersOnDayToDayBasis.setValidators([Validators.required]);
            this.accountLegalNameLabel = "business'"
            this.accountPlaceHolderLabel = "Business";
          } else if (this.isFarmOwner) {
            this.damagedPropertyAddressForm.controls.farmoperation.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.ownedandoperatedbya.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.farmoperationderivesthatpersonsmajorincom.setValidators([Validators.required]);
            this.accountLegalNameLabel = "farm's"
            this.accountPlaceHolderLabel = "Farm";
          } else if (this.isCharitableOrganization) {
            this.damagedPropertyAddressForm.controls.charityExistsAtLeast12Months.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.charityRegistered.setValidators([Validators.required]);
            this.damagedPropertyAddressForm.controls.charityProvidesCommunityBenefit.setValidators([Validators.required]);
            this.accountLegalNameLabel = "charitable organization's"
            this.accountPlaceHolderLabel = "Charitable Organization";
          }
        this.damagedPropertyAddressForm.updateValueAndValidity();
        }
      });
    });
    
    this.damagedPropertyAddressForm
      .get('addressLine1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('addressLine1').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('addressLine2')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('addressLine2').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('community')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('community').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('stateProvince')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('stateProvince').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('postalCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('postalCode').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('occupyAsPrimaryResidence')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('occupyAsPrimaryResidence').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.dontOccupyDamagedPropertyBody, "occupyAsPrimaryResidence");
        }
      });

    this.damagedPropertyAddressForm
      .get('onAFirstNationsReserve')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('onAFirstNationsReserve').reset();
        } else if (value == 'true') {
          this.damagedPropertyAddressForm.get('firstNationsReserve').setValidators([Validators.required, Validators.maxLength(100)]);
        } else if (value == 'false') {
          this.damagedPropertyAddressForm.get('firstNationsReserve').setValidators([Validators.maxLength(100)]);
        }
        this.damagedPropertyAddressForm.get('firstNationsReserve').updateValueAndValidity();
        this.damagedPropertyAddressForm.updateValueAndValidity();
      });

    this.damagedPropertyAddressForm
      .get('firstNationsReserve')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('firstNationsReserve').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('manufacturedHome')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('manufacturedHome').reset();
        }
      });

    this.damagedPropertyAddressForm
      .get('eligibleForHomeOwnerGrant')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('eligibleForHomeOwnerGrant').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('landlordGivenNames')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('landlordGivenNames').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('landlordSurname')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('landlordSurname').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('landlordPhone')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('landlordPhone').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('landlordEmail')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('landlordEmail').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('employLessThan50EmployeesAtAnyOneTime')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('employLessThan50EmployeesAtAnyOneTime').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.dontEmployLessThan50EmployeesAtAnyOneTime, "employLessThan50EmployeesAtAnyOneTime");
        }
      });

      this.damagedPropertyAddressForm
      .get('businessLegalName')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('businessLegalName').reset();
        }
      });

      this.damagedPropertyAddressForm
      .get('grossRevenues100002000000BeforeDisaster')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('grossRevenues100002000000BeforeDisaster').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.wrongGrossRevenues, "grossRevenues100002000000BeforeDisaster");
        }
      });

      this.damagedPropertyAddressForm
      .get('businessManagedByAllOwnersOnDayToDayBasis')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('businessManagedByAllOwnersOnDayToDayBasis').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.businessNotManagedByAllOwnersOnDayToDayBasis, "businessManagedByAllOwnersOnDayToDayBasis");
        }
      });

      this.damagedPropertyAddressForm
      .get('farmoperation')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('farmoperation').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.farmoperation, "farmoperation");
        }
      });

      this.damagedPropertyAddressForm
      .get('ownedandoperatedbya')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('ownedandoperatedbya').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.ownedandoperatedbya, "ownedandoperatedbya");
        }
      });

      this.damagedPropertyAddressForm
      .get('farmoperationderivesthatpersonsmajorincom')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('farmoperationderivesthatpersonsmajorincom').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.farmoperationderivesthatpersonsmajorincom, "farmoperationderivesthatpersonsmajorincom");
        }
      });

      this.damagedPropertyAddressForm
      .get('charityRegistered')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('charityRegistered').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.charityBCSocietiesAct, "charityRegistered");
        }
      });

      this.damagedPropertyAddressForm
      .get('charityExistsAtLeast12Months')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('charityExistsAtLeast12Months').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.charityno12months, "charityExistsAtLeast12Months");
        }
      });

      this.damagedPropertyAddressForm
      .get('charityProvidesCommunityBenefit')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('charityProvidesCommunityBenefit').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.charitynobenefit, "charityProvidesCommunityBenefit");
        }
      });

      this.damagedPropertyAddressForm
      .get('lossesExceed1000')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.damagedPropertyAddressForm.get('lossesExceed1000').reset();
        } else if (value === 'false') {
          this.dontContinueApplication(globalConst.lossesDontExceed1000, "lossesExceed1000");
        }
      });

    this.damagedPropertyAddressForm.get('isPrimaryAndDamagedAddressSame').setValue(false);
    this.onUseProfileAddressChoice(false);

    this.getDamagedPropertyForApplication(this.dfaApplicationMainDataService.getApplicationId());

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.damagedPropertyAddressForm.disable();
    }
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

  dontContinueApplication(content: DialogContent, controlName: string) {
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
          this.dfaApplicationMainDataService.damagedPropertyAddress.addressLine1 = this.damagedPropertyAddressForm.get('addressLine1').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.addressLine2 = this.damagedPropertyAddressForm.get('addressLine2').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.community = this.damagedPropertyAddressForm.get('community').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.firstNationsReserve = this.damagedPropertyAddressForm.get('firstNationsReserve').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.landlordEmail = this.damagedPropertyAddressForm.get('landlordEmail').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.landlordGivenNames = this.damagedPropertyAddressForm.get('landlordGivenNames').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.landlordPhone = this.damagedPropertyAddressForm.get('landlordPhone').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.landlordSurname = this.damagedPropertyAddressForm.get('landlordSurname').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.postalCode = this.damagedPropertyAddressForm.get('postalCode').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.stateProvince = this.damagedPropertyAddressForm.get('stateProvince').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.eligibleForHomeOwnerGrant = this.damagedPropertyAddressForm.get('eligibleForHomeOwnerGrant').value == 'true' ? true : (this.damagedPropertyAddressForm.get('eligibleForHomeOwnerGrant').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.lossesExceed1000 = this.damagedPropertyAddressForm.get('lossesExceed1000').value == 'true' ? true : (this.damagedPropertyAddressForm.get('lossesExceed1000').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.isPrimaryAndDamagedAddressSame = this.damagedPropertyAddressForm.get('isPrimaryAndDamagedAddressSame').value == 'true' ? true : (this.damagedPropertyAddressForm.get('isPrimaryAndDamagedAddressSame').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.manufacturedHome = this.damagedPropertyAddressForm.get('manufacturedHome').value == 'true' ? true : (this.damagedPropertyAddressForm.get('manufacturedHome').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.occupyAsPrimaryResidence = this.damagedPropertyAddressForm.get('occupyAsPrimaryResidence').value == 'true' ? true : (this.damagedPropertyAddressForm.get('occupyAsPrimaryResidence').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.onAFirstNationsReserve = this.damagedPropertyAddressForm.get('onAFirstNationsReserve').value == 'true' ? true : (this.damagedPropertyAddressForm.get('onAFirstNationsReserve').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime = this.damagedPropertyAddressForm.get('employLessThan50EmployeesAtAnyOneTime').value == 'true' ? true : (this.damagedPropertyAddressForm.get('employLessThan50EmployeesAtAnyOneTime').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster = this.damagedPropertyAddressForm.get('grossRevenues100002000000BeforeDisaster').value == 'true' ? true : (this.damagedPropertyAddressForm.get('grossRevenues100002000000BeforeDisaster').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis = this.damagedPropertyAddressForm.get('businessManagedByAllOwnersOnDayToDayBasis').value == 'true' ? true : (this.damagedPropertyAddressForm.get('businessManagedByAllOwnersOnDayToDayBasis').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.businessLegalName = this.damagedPropertyAddressForm.get('businessLegalName').value;
          this.dfaApplicationMainDataService.damagedPropertyAddress.farmoperation = this.damagedPropertyAddressForm.get('farmoperation').value == 'true' ? true : (this.damagedPropertyAddressForm.get('farmoperation').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.ownedandoperatedbya = this.damagedPropertyAddressForm.get('ownedandoperatedbya').value == 'true' ? true : (this.damagedPropertyAddressForm.get('ownedandoperatedbya').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom = this.damagedPropertyAddressForm.get('farmoperationderivesthatpersonsmajorincom').value == 'true' ? true : (this.damagedPropertyAddressForm.get('farmoperationderivesthatpersonsmajorincom').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.charityRegistered = this.damagedPropertyAddressForm.get('charityRegistered').value == 'true' ? true : (this.damagedPropertyAddressForm.get('charityRegistered').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.charityExistsAtLeast12Months = this.damagedPropertyAddressForm.get('charityExistsAtLeast12Months').value == 'true' ? true : (this.damagedPropertyAddressForm.get('charityExistsAtLeast12Months').value == 'false' ? false : null);
          this.dfaApplicationMainDataService.damagedPropertyAddress.charityProvidesCommunityBenefit = this.damagedPropertyAddressForm.get('charityProvidesCommunityBenefit').value == 'true' ? true : (this.damagedPropertyAddressForm.get('charityProvidesCommunityBenefit').value == 'false' ? false : null);
          this.submitFile();
          }
        else if (result === 'confirm') {
          this.damagedPropertyAddressForm.get(controlName).setValue("true");
        }
        else this.damagedPropertyAddressForm.get(controlName).setValue(null);
      });
  }

  submitFile(): void {
    this.applicationService
      .applicationUpdateApplication({body: this.dfaApplicationMainDataService.createDFAApplicationMainDTO()})
      .subscribe({
       next: (updateMessage) => {
          this.router.navigate(['/verified-registration/dashboard']);
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
  }

  onUseProfileAddressChoice(choice: any) {
    this.damagedPropertyAddressForm.controls.stateProvince.setValue("BC");
    if (!choice.value) return; // not a radio button change
    if (choice.value == 'true') // yes
    {
      this.damagedPropertyAddressForm.controls.addressLine1.setValue(this.profileAddress.addressLine1);
      this.damagedPropertyAddressForm.controls.addressLine2.setValue(this.profileAddress.addressLine2);
      this.damagedPropertyAddressForm.controls.community.setValue(this.profileAddress.city);
      this.damagedPropertyAddressForm.controls.stateProvince.setValue(this.profileAddress.stateProvince);
      this.damagedPropertyAddressForm.controls.postalCode.setValue(this.profileAddress.postalCode);
    } else { // no
      this.damagedPropertyAddressForm.controls.addressLine1.setValue(null);
      this.damagedPropertyAddressForm.controls.addressLine2.setValue(null);
      this.damagedPropertyAddressForm.controls.community.setValue(null);
      this.damagedPropertyAddressForm.controls.postalCode.setValue(null);
    }
  }

  /**
   * Returns the control of the form
   */
  get damagedPropertyAddressFormControl(): { [key: string]: AbstractControl } {
    return this.damagedPropertyAddressForm.controls;
  }


  notifyAddressChange(): void {
    this.dialog
      .open(AddressChangeComponent, {
        data: {
          content: globalConst.notifyBCSCAddressChangeBody
        },
        height: '300px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        //if (result === 'confirm') {
        if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
          this.damagedPropertyAddressForm.disable();
        }
        //}
      });
  }

  ngOnDestroy(): void {
    this.damagedPropertyAddressForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    // 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - new text mask provider
    NgxMaskDirective, NgxMaskPipe,
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

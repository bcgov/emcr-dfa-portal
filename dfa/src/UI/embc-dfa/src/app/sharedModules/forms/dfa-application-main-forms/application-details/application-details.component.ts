import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { MatDialog } from '@angular/material/dialog';
import { ApplicantOption, InsuranceOption, Address, SmallBusinessOption, FarmOption } from 'src/app/core/api/models';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { TextMaskModule } from 'angular2-text-mask';
import { MatInputModule } from '@angular/material/input';
import { ApplicationService, ProfileService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export default class ApplicationDetailsComponent implements OnInit, OnDestroy {
  applicationDetailsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  applicationDetailsForm$: Subscription;
  formCreationService: FormCreationService;
  private _profileAddress: Address;
  ApplicantOptions = ApplicantOption;
  InsuranceOptions = InsuranceOption;
  SmallBusinessOptions = SmallBusinessOption;
  FarmOptions = FarmOption;

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
  isNotInsured: boolean = false;
  isUnsure: boolean = false;
  isGeneral: boolean = false;
  isCorporate: boolean = false;
  isLandlord: boolean = false;
  accountLegalNameLabel: string = "";
  accountPlaceHolderLabel: string = "";
  isReadOnly: boolean = false;
  ApplicantSubCategories = [];

  applicantOption: ApplicantOption;
  insuranceOption: InsuranceOption;
  smallBusinessOption: SmallBusinessOption;
  farmOption: FarmOption;

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

    this.applicationDetailsForm$ = this.formCreationService
      .getApplicationDetailsForm()
      .subscribe((review) => {
        this.applicationDetailsForm = review;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
           if (application) {
            this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
            this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
            this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
            this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
            this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
            if (this.isSmallBusinessOwner) {
              this.isGeneral = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.General)]);
              this.isCorporate = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Corporate)]);
              this.isLandlord = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Landlord)]);
            } else if (this.isFarmOwner) {
              this.isGeneral = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.General)]);
              this.isCorporate = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.Corporate)]);
            }
            this.isNotInsured = (application.appTypeInsurance.insuranceOption == Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.No)]);
            this.isUnsure = (application.appTypeInsurance.insuranceOption == Object.keys(InsuranceOption)[Object.values(InsuranceOption).indexOf(InsuranceOption.Unsure)]);            
            this.applicantOption = application.appTypeInsurance.applicantOption;
            this.insuranceOption = application.appTypeInsurance.insuranceOption;
            this.smallBusinessOption = application.appTypeInsurance.smallBusinessOption;
            this.farmOption = application.appTypeInsurance.farmOption;
          this.applicationDetailsForm.updateValueAndValidity();
          }
        });
      });      

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
    this.applicationDetailsForm$.unsubscribe();
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
  declarations: [ApplicationDetailsComponent]
})
class DamagedPropertyAddressModule {}
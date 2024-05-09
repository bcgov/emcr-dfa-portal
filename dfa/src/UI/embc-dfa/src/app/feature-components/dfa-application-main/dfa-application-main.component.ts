import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCreationService } from '../../core/services/componentCreation.service';
import * as globalConst from '../../core/services/globalConstants';
import { ComponentMetaDataModel } from '../../core/model/componentMetaData.model';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, distinctUntilChanged, mapTo } from 'rxjs';
import { FormCreationService } from '../../core/services/formCreation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { DFAApplicationMainDataService } from './dfa-application-main-data.service';
import { DFAApplicationMainService } from './dfa-application-main.service';
import { ApplicantOption, FarmOption, InsuranceOption, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';

@Component({
  selector: 'app-dfa-application-main',
  templateUrl: './dfa-application-main.component.html',
  styleUrls: ['./dfa-application-main.component.scss']
})
export class DFAApplicationMainComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @ViewChild('dfaApplicationMainStepper') dfaApplicationMainStepper: MatStepper;
  isEditable = true;
  steps: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
  showStep = false;
  dfaApplicationMainFolderPath = 'dfa-application-main-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  stepToDisplay: number;
  currentFlow: string;
  type = 'dfa-application-main';
  dfaApplicationMainHeading: string;
  parentPageName = 'dfa-application-main';
  showLoader = false;
  isSubmitted = false;
  ApplicantOptions = ApplicantOption;
  isApplicantSigned: boolean = false;
  isSecondaryApplicantSigned: boolean = false;
  isSecondaryApplicant: boolean = false;
  secondaryApplicants: SecondaryApplicant[] = [];
  isSignaturesValid: boolean = false;
  appTypeInsuranceForm: UntypedFormGroup;
  appTypeInsuranceForm$: Subscription;
  vieworedit: string;
  editstep: string;
  ninetyDayDeadline: string;
  event: string;
  daysToApply: number;
  isResidentialTenant: boolean = false;
  isGeneral: boolean = false;
  isCorporate: boolean = false;
  isLandlord: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isFarmOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  AppOptions = ApplicantOption;
  SmallBusinessOptions = SmallBusinessOption;
  FarmOptions = FarmOption;
  signAndSubmitForm: UntypedFormGroup;
  InsuranceOptions = InsuranceOption;
  isNoInsurance: boolean = false;
  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaApplicationMainService: DFAApplicationMainService,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation !== null) {
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
    }

    this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
      if (application) {
        this.isNoInsurance = (application.appTypeInsurance.insuranceOption == Object.keys(this.InsuranceOptions)[Object.values(this.InsuranceOptions).indexOf(this.InsuranceOptions.No)]);
        this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.AppOptions)[Object.values(this.AppOptions).indexOf(this.AppOptions.ResidentialTenant)]);
        this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.AppOptions)[Object.values(this.AppOptions).indexOf(this.AppOptions.Homeowner)]);
        this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.AppOptions)[Object.values(this.AppOptions).indexOf(this.AppOptions.SmallBusinessOwner)]);
        this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.AppOptions)[Object.values(this.AppOptions).indexOf(this.AppOptions.FarmOwner)]);
        this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.AppOptions)[Object.values(this.AppOptions).indexOf(this.AppOptions.CharitableOrganization)]);
        if (this.isSmallBusinessOwner) {
          this.isGeneral = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.General)]);
          this.isCorporate = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Corporate)]);
          this.isLandlord = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Landlord)]);
        } else if (this.isFarmOwner) {
          this.isGeneral = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.General)]);
          this.isCorporate = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.Corporate)]);
        }
        if (this.isResidentialTenant) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "TenancyAgreement", "Identification"];
        } else if (this.isHomeowner) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate" ];
        } else if (this.isSmallBusinessOwner && this.isGeneral) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "T1GeneralIncomeTaxReturn", "FinancialStatements"];
        } else if (this.isSmallBusinessOwner && this.isCorporate) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "T2CorporateIncomeTaxReturn", "ProofOfOwnership", "FinancialStatements"];
        } else if (this.isSmallBusinessOwner && this.isLandlord) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "T1GeneralIncomeTaxReturn", "T776", "FinancialStatements"];
        } else if (this.isFarmOwner && this.isGeneral) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "T1GeneralIncomeTaxReturn", "FinancialStatements"];
        } else if (this.isFarmOwner && this.isCorporate) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "T2CorporateIncomeTaxReturn", "ProofOfOwnership", "FinancialStatements"];
        } else if (this.isCharitableOrganization) {
          this.dfaApplicationMainDataService.requiredDocuments = ["InsuranceTemplate", "DirectorsListing", "RegistrationProof", "StructureAndPurpose"]
        }
      }
    });
  }

  ngOnInit(): void {

    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    let applicationId = this.route.snapshot.paramMap.get('id');

    // clear old data
    this.dfaApplicationMainDataService.setApplicationId(applicationId);
    this.dfaApplicationMainDataService.cleanUpLog = null;
    this.dfaApplicationMainDataService.cleanUpLogItems = null;
    this.dfaApplicationMainDataService.damagedPropertyAddress = null;
    this.dfaApplicationMainDataService.damagedRooms = null;
    this.dfaApplicationMainDataService.fileUploads = null;
    this.dfaApplicationMainDataService.fullTimeOccupants = null;
    this.dfaApplicationMainDataService.isSubmitted = false;
    this.dfaApplicationMainDataService.otherContacts = null;
    this.dfaApplicationMainDataService.propertyDamage = null;
    this.dfaApplicationMainDataService.secondaryApplicants = null;
    this.dfaApplicationMainDataService.signAndSubmit = null;
    this.dfaApplicationMainDataService.supportingDocuments = null;
    this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
    this.formCreationService.clearCleanUpLogData();
    this.formCreationService.clearCleanUpLogItemsData();
    this.formCreationService.clearDamagedPropertyAddressData();
    this.formCreationService.clearDamagedRoomsData();
    this.formCreationService.clearFileUploadsData();
    this.formCreationService.clearFullTimeOccupantsData();
    this.formCreationService.clearOtherContactsData();
    this.formCreationService.clearPropertyDamageData();
    this.formCreationService.clearSecondaryApplicantsData();
    this.formCreationService.clearSignAndSubmitData();
    this.formCreationService.clearSupportingDocumentsData();

    this.appTypeInsuranceForm$ = this.formCreationService
      .getAppTypeInsuranceForm()
      .subscribe((appTypeInsurance) => {
        this.appTypeInsuranceForm = appTypeInsurance;
      });

    this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
      if (application) {
        this.event = application.eventName;
        if (application.id == applicationId) this.getFileUploadsForApplication(applicationId);
        this.dfaApplicationMainHeading = ApplicantOption[application.appTypeInsurance.applicantOption] + ' Application';
        this.appTypeInsuranceForm.controls.applicantOption.setValue(application.appTypeInsurance.applicantOption);
        this.appTypeInsuranceForm.controls.insuranceOption.setValue(application.appTypeInsurance.insuranceOption);
        this.appTypeInsuranceForm.controls.smallBusinessOption.setValue(application.appTypeInsurance.smallBusinessOption);
        this.appTypeInsuranceForm.controls.farmOption.setValue(application.appTypeInsurance.farmOption);
        this.formCreationService.setAppTypeInsuranceForm(this.appTypeInsuranceForm);
      }
    });

    this.steps = this.componentService.createDFAApplicationMainSteps();
    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();
    this.editstep = this.dfaApplicationMainDataService.getEditStep();

    //this.dfaApplicationMainDataService.setViewOrEdit('');
    this.formCreationService.signaturesChanged.subscribe(signAndSubmit => {
      signAndSubmit.get('applicantSignature').get('dateSigned').updateValueAndValidity();
      this.isApplicantSigned = this.formCreationService.signAndSubmitForm.value.controls.applicantSignature.valid;
      this.isSecondaryApplicantSigned = this.formCreationService.signAndSubmitForm.value.controls.secondaryApplicantSignature.valid;
      this.checkSignaturesValid();
    });

    const _secondaryApplicantsFormArray = this.formCreationService.secondaryApplicantsForm.value.get('secondaryApplicants');
    _secondaryApplicantsFormArray.valueChanges
      .pipe(
        mapTo(_secondaryApplicantsFormArray.getRawValue())
        ).subscribe(data => {
          this.secondaryApplicants = _secondaryApplicantsFormArray.getRawValue();
          if (this.secondaryApplicants.filter(x => x.deleteFlag != true)?.length > 0) {
            this.isSecondaryApplicant = true;
          } else {
            this.isSecondaryApplicant = false;
          }
          this.checkSignaturesValid();
        });

  }


  public getFileUploadsForApplication(applicationId: string) {

    this.fileUploadsService.attachmentGetAttachments({applicationId: applicationId}).subscribe({
      next: (attachments) => {
         // initialize list of file uploads
        this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(attachments);

      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  checkSignaturesValid() {
    if (this.isSecondaryApplicant == false && this.isApplicantSigned == true) this.isSignaturesValid = true; // no secondary applicant and primary applicant signature valid
    else if (this.isSecondaryApplicant == true && this.isApplicantSigned == true && this.isSecondaryApplicantSigned == true) this.isSignaturesValid = true; // secondary and primary signatures valid
    else this.isSignaturesValid = false;
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    let form$ = this.formCreationService
      .getSignAndSubmitForm()
      .subscribe((signAndSubmit)=> {
        this.signAndSubmitForm = signAndSubmit;
    });

    this.signAndSubmitForm
      .get('applicantSignature')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (this.vieworedit === 'view' || this.vieworedit === 'edit' || this.vieworedit === 'viewOnly') {
          this.dfaApplicationMainDataService.setViewOrEdit(this.vieworedit);
          for (var i = 0; i <= 7; i++) {
            this.dfaApplicationMainStepper.selected.completed = true;
            this.dfaApplicationMainStepper.next();
          }
          if (this.vieworedit === 'edit') this.dfaApplicationMainStepper.selectedIndex = Number(this.editstep);
        } else if (this.vieworedit !== 'add' && this.vieworedit !== 'update') {
          this.dfaApplicationMainStepper.selectedIndex = 0;
          if (this.signAndSubmitForm.get('applicantSignature')?.get('dateSigned')?.value) {
            this.vieworedit = "view";
            this.dfaApplicationMainDataService.setViewOrEdit("view");
            this.dfaApplicationMainDataService.isSubmitted = true;
            for (var i = 0; i <= 7; i++) {
              this.dfaApplicationMainStepper.selected.completed = true;
              this.dfaApplicationMainStepper.next();
            }
          }
          else {
            this.vieworedit = "update";
            this.dfaApplicationMainDataService.setViewOrEdit("update");
          }
        }
      });

    this.signAndSubmitForm
      .get('ninetyDayDeadline')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.ninetyDayDeadline = value;
          let date = new Date(value);
          let currentDate = new Date();
          this.daysToApply = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        }
      })
  }

  navigateToStep(stepIndex: number) {
    this.dfaApplicationMainStepper.selectedIndex = stepIndex;
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
    if (isLast && component === 'review') {
      this.dfaApplicationMainStepper.selected.completed = true;
      this.submitFile();
    } else {
      this.setFormData(component);
      let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
      this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
        // determine if step is complete
        switch (component) {
          case 'damaged-property-address':
            if (this.form.valid) stepper.selected.completed = true;
            else stepper.selected.completed = false;
            break;
          case 'property-damage':
            if (this.form.valid) stepper.selected.completed = true;
            else stepper.selected.completed = false;
            break;
          case 'occupants':
            if (this.formCreationService.otherContactsForm.value.valid && this.formCreationService.fullTimeOccupantsForm.value.valid) stepper.selected.completed = true;
            else stepper.selected.completed = false;
            break;
          case 'clean-up-log':
            stepper.selected.completed = true;
            break;
          case 'damaged-items-by-room':
            stepper.selected.completed = true;
            break;
          case 'supporting-documents':
            stepper.selected.completed = this.requiredDocumentsSupplied();
            break;
          case 'sign-and-submit':
            if (this.form.valid) stepper.selected.completed = true;
            else stepper.selected.completed = false;
            break;
          case 'review':
            stepper.selected.completed = true;
            break;
          default:
            break;
        }
        this.form$.unsubscribe();
        stepper.next();
        this.form.markAllAsTouched();
      },
      error => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      });
    }
  }

  requiredDocumentsSupplied(): boolean {
    let isInsuranceTemplateUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "InsuranceTemplate" && x.deleteFlag == false).length >= 1 ? true : false;
    let isTenancyProofUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length >= 1 ? true : false;
    let isIdentificationUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "Identification" && x.deleteFlag == false).length >= 1 ? true : false;
    let isT1GeneralIncomeTaxReturnUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "T1GeneralIncomeTaxReturn" && x.deleteFlag == false).length >= 1 ? true : false;
    let isFinancialStatementsUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "FinancialStatements" && x.deleteFlag == false).length >= 1 ? true : false;
    let isT776Uploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "T776" && x.deleteFlag == false).length >= 1 ? true : false;
    let isResidentialTenancyAgreementUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "ResidentialTenancyAgreement" && x.deleteFlag == false).length >= 1 ? true : false;
    let isT2CorporateIncomeTaxReturnUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "T2CorporateIncomeTaxReturn" && x.deleteFlag == false).length >= 1 ? true : false;
    let isProofOfOwnershipUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "ProofOfOwnership" && x.deleteFlag == false).length >= 1 ? true : false;
    let isDirectorsListingUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "DirectorsListing" && x.deleteFlag == false).length >= 1 ? true : false;
    let isRegistrationProofUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "RegistrationProof" && x.deleteFlag == false).length >= 1 ? true : false;
    let isStructureAndPurposeUploaded = this.formCreationService.fileUploadsForm.getValue().getRawValue()?.fileUploads.filter(x => x.requiredDocumentType === "StructureAndPurpose" && x.deleteFlag == false).length >= 1 ? true : false;
    if ((this.isNoInsurance == false ? isInsuranceTemplateUploaded == true : true)
      && (this.isResidentialTenant == true ? (isIdentificationUploaded == true && isTenancyProofUploaded == true) : true)
      && ((this.isSmallBusinessOwner == true  && this.isGeneral == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true) : true )
      && ((this.isSmallBusinessOwner == true  && this.isCorporate == true) ? (isT2CorporateIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true && isProofOfOwnershipUploaded) : true )
      && ((this.isSmallBusinessOwner == true  && this.isLandlord == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isT776Uploaded == true && isResidentialTenancyAgreementUploaded == true) : true )
      && ((this.isFarmOwner == true  && this.isGeneral == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true) : true )
      && ((this.isFarmOwner == true  && this.isCorporate == true) ? (isT2CorporateIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true && isProofOfOwnershipUploaded) : true )
      && ((this.isCharitableOrganization == true) ? (isDirectorsListingUploaded == true && isRegistrationProofUploaded == true && isStructureAndPurposeUploaded) : true )
      ) return true;
    else return false;
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    debugger
    switch (component) {
      case 'damaged-property-address':
        this.dfaApplicationMainDataService.damagedPropertyAddress.addressLine1 = this.form.get('addressLine1').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.addressLine2 = this.form.get('addressLine2').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.community = this.form.get('community').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.firstNationsReserve = this.form.get('firstNationsReserve').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordEmail = this.form.get('landlordEmail').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordEmail2 = this.form.get('landlordEmail2').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordGivenNames = this.form.get('landlordGivenNames').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordGivenNames2 = this.form.get('landlordGivenNames2').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordPhone = this.form.get('landlordPhone').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordPhone2 = this.form.get('landlordPhone2').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordSurname = this.form.get('landlordSurname').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.landlordSurname2 = this.form.get('landlordSurname2').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.postalCode = this.form.get('postalCode').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.stateProvince = this.form.get('stateProvince').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.eligibleForHomeOwnerGrant = this.form.get('eligibleForHomeOwnerGrant').value == 'true' ? true : (this.form.get('eligibleForHomeOwnerGrant').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.isPrimaryAndDamagedAddressSame = this.form.get('isPrimaryAndDamagedAddressSame').value == 'true' ? true : (this.form.get('isPrimaryAndDamagedAddressSame').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.manufacturedHome = this.form.get('manufacturedHome').value == 'true' ? true : (this.form.get('manufacturedHome').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.occupyAsPrimaryResidence = this.form.get('occupyAsPrimaryResidence').value == 'true' ? true : (this.form.get('occupyAsPrimaryResidence').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.onAFirstNationsReserve = this.form.get('onAFirstNationsReserve').value == 'true' ? true : (this.form.get('onAFirstNationsReserve').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.businessLegalName = this.form.get('businessLegalName').value;
        this.dfaApplicationMainDataService.damagedPropertyAddress.businessManagedByAllOwnersOnDayToDayBasis = this.form.get('businessManagedByAllOwnersOnDayToDayBasis').value == 'true' ? true : (this.form.get('businessManagedByAllOwnersOnDayToDayBasis').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.employLessThan50EmployeesAtAnyOneTime = this.form.get('employLessThan50EmployeesAtAnyOneTime').value == 'true' ? true : (this.form.get('employLessThan50EmployeesAtAnyOneTime').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.lossesExceed1000 = this.form.get('lossesExceed1000').value == 'true' ? true : (this.form.get('lossesExceed1000').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.farmoperation = this.form.get('farmoperation').value == 'true' ? true : (this.form.get('farmoperation').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.ownedandoperatedbya = this.form.get('ownedandoperatedbya').value == 'true' ? true : (this.form.get('ownedandoperatedbya').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.farmoperationderivesthatpersonsmajorincom = this.form.get('farmoperationderivesthatpersonsmajorincom').value == 'true' ? true : (this.form.get('farmoperationderivesthatpersonsmajorincom').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.grossRevenues100002000000BeforeDisaster = this.form.get('grossRevenues100002000000BeforeDisaster').value == 'true' ? true : (this.form.get('grossRevenues100002000000BeforeDisaster').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.charityRegistered = this.form.get('charityRegistered').value == 'true' ? true : (this.form.get('charityRegistered').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.charityExistsAtLeast12Months = this.form.get('charityExistsAtLeast12Months').value == 'true' ? true : (this.form.get('charityExistsAtLeast12Months').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.charityProvidesCommunityBenefit = this.form.get('charityProvidesCommunityBenefit').value == 'true' ? true : (this.form.get('charityExistsAtLeast12Months').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.damagedPropertyAddress.isDamagedAddressVerified = this.form.get('isDamagedAddressVerified').value == 'true' ? true : (this.form.get('isDamagedAddressVerified').value == 'false' ? false : null);
        break;
      case 'property-damage':
        this.dfaApplicationMainDataService.propertyDamage.briefDescription = this.form.get('briefDescription').value;
        this.dfaApplicationMainDataService.propertyDamage.damageFromDate = this.form.get('damageFromDate').value;
        this.dfaApplicationMainDataService.propertyDamage.damageToDate = this.form.get('damageToDate').value;
        this.dfaApplicationMainDataService.propertyDamage.dateReturned = this.form.get('dateReturned').value;
        this.dfaApplicationMainDataService.propertyDamage.floodDamage = this.form.get('floodDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.landslideDamage = this.form.get('landslideDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.otherDamage = this.form.get('otherDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.otherDamageText = this.form.get('otherDamageText').value;
        this.dfaApplicationMainDataService.propertyDamage.previousApplicationText = this.form.get('previousApplicationText').value;
        this.dfaApplicationMainDataService.propertyDamage.stormDamage = this.form.get('stormDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.residingInResidence = this.form.get('residingInResidence').value == 'true' ? true : (this.form.get('residingInResidence').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.propertyDamage.previousApplication = this.form.get('previousApplication').value;
        this.dfaApplicationMainDataService.propertyDamage.wereYouEvacuated = this.form.get('wereYouEvacuated').value == 'true' ? true : (this.form.get('wereYouEvacuated').value == 'false' ? false : null);
        break;
      case 'occupants':
        break;
      case 'clean-up-log':
        this.dfaApplicationMainDataService.cleanUpLog.haveInvoicesOrReceiptsForCleanupOrRepairs = this.form.get('haveInvoicesOrReceiptsForCleanupOrRepairs').value == 'true' ? true : (this.form.get('haveInvoicesOrReceiptsForCleanupOrRepairs').value == 'false' ? false : null);
        break;
      case 'damaged-items-by-room':
        break;
      case 'supporting-documents':
        this.dfaApplicationMainDataService.supportingDocuments.hasCopyOfARentalAgreementOrLease = this.form.get('hasCopyOfARentalAgreementOrLease').value == true ? true : (this.form.get('hasCopyOfARentalAgreementOrLease').value == 'false' ? false : null);
        break;
      case 'sign-and-submit':
        this.dfaApplicationMainDataService.signAndSubmit.applicantSignature.dateSigned = this.form.get('applicantSignature').get('dateSigned').value;
        this.dfaApplicationMainDataService.signAndSubmit.applicantSignature.signature = this.form.get('applicantSignature').get('signature').value;
        this.dfaApplicationMainDataService.signAndSubmit.applicantSignature.signedName = this.form.get('applicantSignature').get('signedName').value;
        this.dfaApplicationMainDataService.signAndSubmit.secondaryApplicantSignature.dateSigned = this.form.get('secondaryApplicantSignature').get('dateSigned').value;
        this.dfaApplicationMainDataService.signAndSubmit.secondaryApplicantSignature.signature = this.form.get('secondaryApplicantSignature').get('signature').value;
        this.dfaApplicationMainDataService.signAndSubmit.secondaryApplicantSignature.signedName = this.form.get('secondaryApplicantSignature').get('signedName').value;
        break;
      default:
        break;
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
        break;
      case 1:
        this.form$ = this.formCreationService
          .getDamagedPropertyAddressForm()
          .subscribe((damagedPropertyAddress) => {
            this.form = damagedPropertyAddress;
          });
        break;
      case 2:
        this.form$ = this.formCreationService
          .getPropertyDamageForm()
          .subscribe((propertyDamage) => {
            this.form = propertyDamage;
          });
        break;
      case 3:
        this.form$ = null;
      case 4:
        this.form$ = this.formCreationService
          .getCleanUpLogForm()
          .subscribe((cleanUpLog) => {
            this.form = cleanUpLog;
          });
        break;
      case 5:
        this.form$ = null;
      case 6:
        this.form$ = this.formCreationService
          .getSupportingDocumentsForm()
          .subscribe((supportingDocuments) => {
            this.form = supportingDocuments;
          });
        break;
      case 8:
        this.form$ = this.formCreationService
          .getSignAndSubmitForm()
          .subscribe((signAndSubmit)=> {
          this.form = signAndSubmit;
        });
        break;
    }
  }

  saveAndBackToDashboard() {
    this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
    let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
    this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
      this.showLoader = !this.showLoader;
      this.returnToDashboard();
    },
    error => {
      console.error(error);
      document.location.href = 'https://dfa.gov.bc.ca/error.html';
    });
  }

  returnToDashboard() {
    this.router.navigate(['/verified-registration/dashboard']);
  }

  submitFile(): void {
    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: globalConst.confirmSubmitApplicationBody
        },
        height: '350px',
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
            this.isSubmitted = !this.isSubmitted;
            this.alertService.clearAlert();
            this.dfaApplicationMainDataService.isSubmitted = true;
            this.dfaApplicationMainDataService.setViewOrEdit('view');
            this.vieworedit = 'view';
          },
          error => {
            console.error(error);
            document.location.href = 'https://dfa.gov.bc.ca/error.html';
          });
        }
      });
  }

  BackToDashboard(): void {
    this.router.navigate(['/dfa-dashboard']);
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

        //}
      });
  }
}

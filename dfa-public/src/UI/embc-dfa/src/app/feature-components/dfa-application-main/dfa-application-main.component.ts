import { ApplicationDetailsForm } from './../../core/model/dfa-application-main.model';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup, FormControl } from '@angular/forms';
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
import { ApplicantOption, ApplicationStageOptionSet, FarmOption, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAApplicationMainMappingService } from './dfa-application-main-mapping.service';
import { DFAApplicationSubmissionMsgDialogComponent } from '../../core/components/dialog-components/dfa-application-submission-msg-dialog/dfa-application-submission-msg.component';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-dfa-application-main',
  templateUrl: './dfa-application-main.component.html',
  styleUrls: ['./dfa-application-main.component.scss']
})
export class DFAApplicationMainComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
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
  isLoading = false;
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
  showStepper: boolean = false;

  // 2024-10-11 EMCRI-809 waynezen;
  applicationDetailsForm$: Subscription;
  applicationDetailsForm: UntypedFormGroup;
  applicationDetailsValid: boolean = false;
  contactsForm$: Subscription;
  contactsForm: UntypedFormGroup;
  contactsValid: boolean = false;

  /* EMCRI-1066: Authorized Representative */
  authorizedRepresentativeForm$: Subscription;
  authorizedRepresentativeForm: UntypedFormGroup;
  authorizedRepresentativeValid: boolean = false;

  primaryContactValidated: boolean = false;

  constructor(
    private router: Router,
    private componentService: ComponentCreationService,
    private route: ActivatedRoute,
    public formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaApplicationMainService: DFAApplicationMainService,
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private fileUploadsService: AttachmentService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    private loginService: LoginService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation !== null) {
      if (navigation.extras.state !== undefined) {
        const state = navigation.extras.state as { stepIndex: number };
        this.stepToDisplay = state.stepIndex;
      }
    }

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    let applicationId = this.route.snapshot.paramMap.get('id');

    if (applicationId) {
      this.dfaApplicationMainDataService.setApplicationId(applicationId);
    }
    this.formCreationService.clearApplicationDetailsData();
    // 2024-09-18 EMCRI-663 waynezen; clear Contacts form data in between Applications
    this.formCreationService.clearContactsData();
    this.formCreationService.clearOtherContactsData();

    /* EMCRI-1066: Authorized Representative */
    this.formCreationService.clearAuthorizedRepresentativeData();

    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();
    this.steps = this.componentService.createDFAApplicationMainSteps();

    //2024-10-11 EMCRI-820 waynezen;
    this.componentService.modifyDFAApplicationMainStepsforSubmitted(this.steps, this.vieworedit);

    this.editstep = this.dfaApplicationMainDataService.getEditStep();
    //this.showStepper = true;
    this.dfaApplicationMainHeading = 'Create your Application'

    // 2024-10-11 EMCRI-809 waynezen; listen for changes to validation status
    this.applicationDetailsForm$ = this.formCreationService.getApplicationDetailsForm().subscribe((applicationDetails) => {
      this.applicationDetailsForm = applicationDetails;
      this.applicationDetailsValid = this.applicationDetailsForm.valid && applicationDetails.value.legalName != null;
    });
    this.contactsForm$ = this.formCreationService.getContactsForm().subscribe((contacts) => {
      this.contactsForm = contacts;
      this.contactsValid = this.contactsForm.valid && contacts.value.primaryContactValidated != null;
    });

    /* EMCRI-1066: Authorized Representative */
    this.authorizedRepresentativeForm$ = this.formCreationService.getAuthorizedRepresentativeForm().subscribe((authorizedRepresentative) => {
      this.authorizedRepresentativeForm = authorizedRepresentative;
      this.authorizedRepresentativeValid = this.authorizedRepresentativeForm.valid && authorizedRepresentative.value
      this.validateAuthorizedRepresentative();
    })

    this.formCreationService.authorizedRepresentativeChanged.subscribe(authorizedRepresentative => {
      this.authorizedRepresentativeForm = authorizedRepresentative;
      this.authorizedRepresentativeValid = this.authorizedRepresentativeForm.valid && authorizedRepresentative.value
      this.validateAuthorizedRepresentative();
    });

    this.dfaApplicationMainDataService.authorizedRepresentativeDataChangedEvent.subscribe((changed) => {
      if (changed) {
        this.validateAuthorizedRepresentative()
      }
    });

    this.dfaApplicationMainDataService.primaryContactValidatedEvent.subscribe((verifiedornot) => {
      if (verifiedornot != null) {
        this.primaryContactValidated = verifiedornot;
      }
    });


    var appThis = this;
    const appInterval = setTimeout(function () {
      appThis.isLoading = false;
      appStopFunction();
    }, 3000);

    function appStopFunction() {
      clearInterval(appInterval);
    }

  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {

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
    let appForm = this.formCreationService.applicationDetailsForm.value;
    appForm.updateValueAndValidity();
    this.applicationDetailsValid = (appForm.disabled) ? true : appForm.valid;

    let contactForm = this.formCreationService.contactsForm.value;
    this.contactsValid = contactForm.valid;

    /* EMCRI-1066 */
    let authorizedRepresentativeForm = this.formCreationService.authorizedRepresentativeForm.value;
    this.authorizedRepresentativeValid = authorizedRepresentativeForm.valid;

    if (appForm && event.previouslySelectedIndex == 0) {
      this.setFormData('application-details');
    }

    if (contactForm && event.previouslySelectedIndex == 1) {
      this.setFormData('contacts');
    }

    if (authorizedRepresentativeForm && event.previouslySelectedIndex == 2) {
      this.setFormData('review');
    }
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

    if (component === 'application-details' || component === 'contacts') {
      this.setFormData(component);
      let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
      application.applicationDetails.appStatus = null; //to fix console error, actual status being set when user clicks submit/save button
      this.dfaApplicationMainMapping.mapDFAApplicationMain(application);

      // 2024-10-11 EMCRI-809 waynezen; force Application Details & Contacts screen to update validators
      // Modified the logic by removing if conditions as save button doesn't display
      let appForm = this.formCreationService.applicationDetailsForm.value;
      appForm.updateValueAndValidity();
      this.applicationDetailsValid = (appForm.disabled) ? true : appForm.valid;

      let contactForm = this.formCreationService.contactsForm.value;
      this.contactsValid = contactForm.valid;

      let authorizedRepresentativeForm = this.formCreationService.authorizedRepresentativeForm.value;
      this.authorizedRepresentativeValid = authorizedRepresentativeForm.valid;

      this.dfaApplicationMainStepper.selected.completed = true;
      //this.submitFile();
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else {
      this.setFormData(component);
      let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
      application.applicationDetails.appStatus = null; //to fix console error, actual status being set when user clicks submit/save button
      this.dfaApplicationMainMapping.mapDFAApplicationMain(application);

      this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {

        // determine if step is complete
        switch (component) {
          case 'application-details':
            if (this.form.valid) stepper.selected.completed = true;
            else stepper.selected.completed = false;
            break;
          case 'contacts':
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

    if (isInsuranceTemplateUploaded == true
      && (this.isResidentialTenant == true ? (isIdentificationUploaded == true && isTenancyProofUploaded == true) : true)
      && ((this.isSmallBusinessOwner == true && this.isGeneral == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true) : true)
      && ((this.isSmallBusinessOwner == true && this.isCorporate == true) ? (isT2CorporateIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true && isProofOfOwnershipUploaded) : true)
      && ((this.isSmallBusinessOwner == true && this.isLandlord == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isT776Uploaded == true && isResidentialTenancyAgreementUploaded == true) : true)
      && ((this.isFarmOwner == true && this.isGeneral == true) ? (isT1GeneralIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true) : true)
      && ((this.isFarmOwner == true && this.isCorporate == true) ? (isT2CorporateIncomeTaxReturnUploaded == true && isFinancialStatementsUploaded == true && isProofOfOwnershipUploaded) : true)
      && ((this.isCharitableOrganization == true) ? (isDirectorsListingUploaded == true && isRegistrationProofUploaded == true && isStructureAndPurposeUploaded) : true)
    ) return true;
    else return false;
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(component: string): void {
    switch (component) {
      case 'application-details':
        this.dfaApplicationMainDataService.applicationDetails.damageFromDate = this.form.get('damageFromDate').value;
        this.dfaApplicationMainDataService.applicationDetails.damageToDate = this.form.get('damageToDate').value;
        this.dfaApplicationMainDataService.applicationDetails.floodDamage = this.form.get('floodDamage').value;
        this.dfaApplicationMainDataService.applicationDetails.landslideDamage = this.form.get('landslideDamage').value;
        this.dfaApplicationMainDataService.applicationDetails.otherDamage = this.form.get('otherDamage').value;
        this.dfaApplicationMainDataService.applicationDetails.otherDamageText = this.form.get('otherDamageText').value;
        this.dfaApplicationMainDataService.applicationDetails.stormDamage = this.form.get('stormDamage').value;
        this.dfaApplicationMainDataService.applicationDetails.wildfireDamage = this.form.get('wildfireDamage').value;
        this.dfaApplicationMainDataService.applicationDetails.guidanceSupport = this.form.get('guidanceSupport').value == 'true' ? true : (this.form.get('guidanceSupport').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.applicationDetails.applicantSubtype = this.form.get('applicantSubtype').value;
        this.dfaApplicationMainDataService.applicationDetails.applicantSubSubtype = this.form.get('applicantSubSubtype').value;
        this.dfaApplicationMainDataService.applicationDetails.estimatedPercent = this.form.get('estimatedPercent').value;
        this.dfaApplicationMainDataService.applicationDetails.subtypeDFAComment = this.form.get('subtypeDFAComment').value;
        this.dfaApplicationMainDataService.applicationDetails.subtypeOtherDetails = this.form.get('subtypeOtherDetails').value;
        this.dfaApplicationMainDataService.applicationDetails.legalName = this.form.get('legalName').value;
        this.dfaApplicationMainDataService.applicationDetails.eventName = this.form.get('eventName').value;
        this.dfaApplicationMainDataService.applicationDetails.eventId = this.form.get('eventId').value;
        //this.dfaApplicationMainDataService.otherContacts = 
        //this.otherContactsForm.get('otherContact').getRawValue()
        break;
      case 'contacts':
        // 2024-09-16 EMCRI-663 waynezen; new Contacts form
        this.dfaApplicationMainDataService.contacts.doingBusinessAs = this.form.get('doingBusinessAs').value;
        this.dfaApplicationMainDataService.contacts.businessNumber = this.form.get('businessNumber').value
        this.dfaApplicationMainDataService.contacts.addressLine1 = this.form.get('addressLine1').value
        this.dfaApplicationMainDataService.contacts.addressLine2 = this.form.get('addressLine2').value
        this.dfaApplicationMainDataService.contacts.city = this.form.get('city').value
        this.dfaApplicationMainDataService.contacts.community = this.form.get('community').value
        this.dfaApplicationMainDataService.contacts.stateProvince = this.form.get('stateProvince').value
        this.dfaApplicationMainDataService.contacts.postalCode = this.form.get('postalCode').value
        this.dfaApplicationMainDataService.contacts.isDamagedAddressVerified = this.form.get('isDamagedAddressVerified').value;
        this.dfaApplicationMainDataService.contacts.primaryContactSearch = this.form.get('primaryContactSearch').value
        this.dfaApplicationMainDataService.contacts.guidanceSupport = this.form.get('guidanceSupport').value == 'true' ? true : (this.form.get('guidanceSupport').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.contacts.pcFirstName = this.form.get('pcFirstName').value
        this.dfaApplicationMainDataService.contacts.pcLastName = this.form.get('pcLastName').value
        this.dfaApplicationMainDataService.contacts.pcDepartment = this.form.get('pcDepartment').value
        this.dfaApplicationMainDataService.contacts.pcBusinessPhone = this.form.get('pcBusinessPhone').value
        this.dfaApplicationMainDataService.contacts.pcEmailAddress = this.form.get('pcEmailAddress').value
        this.dfaApplicationMainDataService.contacts.pcCellPhone = this.form.get('pcCellPhone').value
        this.dfaApplicationMainDataService.contacts.pcJobTitle = this.form.get('pcJobTitle').value
        this.dfaApplicationMainDataService.contacts.pcNotes = this.form.get('pcNotes').value;

        break;
      case 'occupants':
        break;
      //case 'review':
      default:
        this.dfaApplicationMainDataService.authorizedRepresentative.businessPhone = this.authorizedRepresentativeForm.get('businessPhone')?.value;
        this.dfaApplicationMainDataService.authorizedRepresentative.email = this.authorizedRepresentativeForm.get('email')?.value;
        this.dfaApplicationMainDataService.authorizedRepresentative.firstDeclaration = this.authorizedRepresentativeForm.get('firstDeclaration')?.value == 'true' ? true : (this.authorizedRepresentativeForm.get('firstDeclaration')?.value == 'false' ? false : null);
        this.dfaApplicationMainDataService.authorizedRepresentative.firstName = this.authorizedRepresentativeForm.get('firstName')?.value;
        this.dfaApplicationMainDataService.authorizedRepresentative.lastName = this.authorizedRepresentativeForm.get('lastName')?.value;
        this.dfaApplicationMainDataService.authorizedRepresentative.positionTitle = this.authorizedRepresentativeForm.get('positionTitle')?.value;
        this.dfaApplicationMainDataService.authorizedRepresentative.secondDeclaration = this.authorizedRepresentativeForm.get('secondDeclaration')?.value == 'true' ? true : (this.authorizedRepresentativeForm.get('secondDeclaration')?.value == 'false' ? false : null);
        break;
      //default:
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
          .getApplicationDetailsForm()
          .subscribe((applicationDetails) => {
            this.form = applicationDetails;
          });

        break;
      case 1:
        this.form$ = this.formCreationService
          .getContactsForm()
          .subscribe((contactDetails) => {
            this.form = contactDetails;
          });

        break;
    }
  }

  saveAndBackToDashboard() {

    this.isLoading = !this.isLoading;
    this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
    let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
    application.applicationDetails.appStatus = ApplicationStageOptionSet.DRAFT;
    this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
      this.isLoading = !this.isLoading;
      this.returnToDashboard();
    },
      error => {
        this.isLoading = !this.isLoading;
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      });

    //this.returnToDashboard();
  }

  returnToDashboard() {
    this.dfaApplicationMainDataService.setApplicationId(null);
    // 2024-07-22 EMCRI-301 waynezen; new dashboard
    this.router.navigate(['/dfa-dashboard']);
  }

  validateAuthorizedRepresentative(){
    let authorizedRepresentativeForm = this.formCreationService.authorizedRepresentativeForm.value;
    this.authorizedRepresentativeValid = authorizedRepresentativeForm.valid;
  }

  submitFile(): void {
    var contentDialog = globalConst.confirmSubmitApplicationBody;
    var height = '400px';
    //if (this.dfaApplicationMainDataService.getApplicationId()) {
    //  contentDialog = globalConst.confirmUpdateApplicationBody;
    //  height = '250px';
    //}

    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: contentDialog
        },
        height: height,
        width: '800px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.isLoading = !this.isLoading;
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          //this.dfaApplicationMainMapping.mapDFAApplicationMain(application);
          this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
          let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          application.applicationDetails.appStatus = ApplicationStageOptionSet.SUBMIT;
          this.dfaApplicationMainMapping.mapDFAApplicationMain(application);

          this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
            this.isLoading = !this.isLoading;
            this.isSubmitted = !this.isSubmitted;
            this.alertService.clearAlert();
            this.dfaApplicationMainDataService.isSubmitted = true;
            this.dfaApplicationMainDataService.setViewOrEdit('view');
            this.vieworedit = 'view';
            //this.returnToDashboard();
            this.MessageAfterSubmission();
          },
            error => {
              this.isLoading = !this.isLoading;
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

  MessageAfterSubmission(): void {
    this.dialog
      .open(DFAApplicationSubmissionMsgDialogComponent, {
        data: {
          content: globalConst.notifyBCSCAddressChangeBody
        },
        height: '700px',
        width: '1000px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        this.BackToDashboard();
      });
  }
}

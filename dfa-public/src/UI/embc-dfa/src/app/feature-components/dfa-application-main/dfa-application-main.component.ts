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
import { ApplicantOption, FarmOption, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmSubmitDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-submit-dialog/dfa-confirm-submit-dialog.component';
import { SecondaryApplicant } from 'src/app/core/model/dfa-application-main.model';
import { AddressChangeComponent } from 'src/app/core/components/dialog-components/address-change-dialog/address-change-dialog.component';
import { DFAApplicationMainMappingService } from './dfa-application-main-mapping.service';
import { DFAApplicationSubmissionMsgDialogComponent } from '../../core/components/dialog-components/dfa-application-submission-msg-dialog/dfa-application-submission-msg.component';

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
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';
    let applicationId = this.route.snapshot.paramMap.get('id');

    if (applicationId) {
      this.dfaApplicationMainDataService.setApplicationId(applicationId);
    }
    this.formCreationService.clearPropertyDamageData();
    this.formCreationService.clearOtherContactsData();

    this.steps = this.componentService.createDFAApplicationMainSteps();
    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();
    this.editstep = this.dfaApplicationMainDataService.getEditStep();
    //this.showStepper = true;
    this.dfaApplicationMainHeading = 'Application Details'
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
    if (isLast && component === 'property-damage') {
      this.setFormData(component);
      this.dfaApplicationMainStepper.selected.completed = true;
      //this.submitFile();
      this.form$.unsubscribe();
      stepper.next();
      this.form.markAllAsTouched();
    } else {
      this.setFormData(component);
      let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
      this.dfaApplicationMainMapping.mapDFAApplicationMain(application);

      this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {

        // determine if step is complete
        switch (component) {
          case 'property-damage':
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
    switch (component) {
      case 'property-damage':
        this.dfaApplicationMainDataService.propertyDamage.damageFromDate = this.form.get('damageFromDate').value;
        this.dfaApplicationMainDataService.propertyDamage.damageToDate = this.form.get('damageToDate').value;
        this.dfaApplicationMainDataService.propertyDamage.floodDamage = this.form.get('floodDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.landslideDamage = this.form.get('landslideDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.otherDamage = this.form.get('otherDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.otherDamageText = this.form.get('otherDamageText').value;
        this.dfaApplicationMainDataService.propertyDamage.stormDamage = this.form.get('stormDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.wildfireDamage = this.form.get('wildfireDamage').value;
        this.dfaApplicationMainDataService.propertyDamage.guidanceSupport = this.form.get('guidanceSupport').value == 'true' ? true : (this.form.get('guidanceSupport').value == 'false' ? false : null);
        this.dfaApplicationMainDataService.propertyDamage.applicantSubtype = this.form.get('applicantSubtype').value;
        this.dfaApplicationMainDataService.propertyDamage.applicantSubSubtype = this.form.get('applicantSubSubtype').value;
        this.dfaApplicationMainDataService.propertyDamage.estimatedPercent = this.form.get('estimatedPercent').value;
        this.dfaApplicationMainDataService.propertyDamage.subtypeDFAComment = this.form.get('subtypeDFAComment').value;
        this.dfaApplicationMainDataService.propertyDamage.subtypeOtherDetails = this.form.get('subtypeOtherDetails').value;
        //this.dfaApplicationMainDataService.otherContacts = 
        //this.otherContactsForm.get('otherContact').getRawValue()
        break;
      case 'occupants':
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
          .getPropertyDamageForm()
          .subscribe((propertyDamage) => {
            this.form = propertyDamage;
          });

        break;
    }
  }

  saveAndBackToDashboard() {
    //this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
    //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
    //this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
    //  this.showLoader = !this.showLoader;
    //  this.returnToDashboard();
    //},
    //error => {
    //  console.error(error);
    //  document.location.href = 'https://dfa.gov.bc.ca/error.html';
    //  });

    this.returnToDashboard();
  }

  returnToDashboard() {
    this.dfaApplicationMainDataService.setApplicationId(null);
    // 2024-07-22 EMCRI-301 waynezen; new dashboard
    this.router.navigate(['/dfa-dashboard']);
  }

  submitFile(): void {
    var contentDialog = globalConst.confirmSubmitApplicationBody;
    var height = '350px';
    if (this.dfaApplicationMainDataService.getApplicationId()) {
      contentDialog = globalConst.confirmUpdateApplicationBody;
      height = '250px';
    }

    this.dialog
      .open(DFAConfirmSubmitDialogComponent, {
        data: {
          content: contentDialog
        },
        height: height,
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          //let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          //this.dfaApplicationMainMapping.mapDFAApplicationMain(application);
          this.setFormData(this.steps[this.dfaApplicationMainStepper.selectedIndex]?.component.toString());
          let application = this.dfaApplicationMainDataService.createDFAApplicationMainDTO();
          
          this.dfaApplicationMainService.upsertApplication(application).subscribe(x => {
            this.isSubmitted = !this.isSubmitted;
            this.alertService.clearAlert();
            this.dfaApplicationMainDataService.isSubmitted = true;
            this.dfaApplicationMainDataService.setViewOrEdit('view');
            this.vieworedit = 'view';
            //this.returnToDashboard();
            this.MessageAfterSubmission();
          },
          error => {
            console.error(error);
            //document.location.href = 'https://dfa.gov.bc.ca/error.html';
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

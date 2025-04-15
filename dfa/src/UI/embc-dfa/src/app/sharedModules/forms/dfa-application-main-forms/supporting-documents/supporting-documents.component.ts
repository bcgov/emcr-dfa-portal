import { Component, OnInit, NgModule, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
  FormsModule,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { BehaviorSubject, Observable, Subscription, catchError, mapTo, throwError } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { ApplicantOption, FileCategory, FileUpload, RequiredDocumentType, SmallBusinessOption, FarmOption, InsuranceOption } from 'src/app/core/api/models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from 'src/app/core/core.module';
import { DFAApplicationMainService } from 'src/app/feature-components/dfa-application-main/dfa-application-main.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { AttachmentService } from 'src/app/core/api/services';
import { DFAApplicationStartDataService } from 'src/app/feature-components/dfa-application-start/dfa-application-start-data.service';
import { MatTab } from '@angular/material/tabs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DFAFileDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-supporting-documents',
  standalone: false,
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.scss']
})
export default class SupportingDocumentsComponent implements OnInit, OnDestroy {
  fileUploadForm: UntypedFormGroup;
  fileUploadForm$: Subscription;
  insuranceTemplateDataSource = new MatTableDataSource();
  rentalAgreementDataSource = new MatTableDataSource();
  identificationDataSource = new MatTableDataSource();
  supportingDocumentsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  supportingDocumentsForm$: Subscription;
  formCreationService: FormCreationService;
  showSupportingFileForm: boolean = false;
  supportingFilesDataSource = new MatTableDataSource();
  documentSummaryColumnsToDisplay = [ 'fileName', 'fileDescription', 'fileType', 'uploadedDate', 'icons']
  documentSummaryDataSource = new MatTableDataSource();
  isLoading: boolean = false;
  allowedFileTypes = [
    'application/pdf',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  FileCategories = FileCategory;
  RequiredDocumentTypes = RequiredDocumentType;
  showOtherDocuments: boolean = false;
  isResidentialTenant: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isGeneral: boolean = false;
  isCorporate: boolean = false;
  isLandlord: boolean = false;
  isFarmOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  AppOptions = ApplicantOption;
  SmallBusinessOptions = SmallBusinessOption;
  FarmOptions = FarmOption;
  InsuranceOptions = InsuranceOption;
  vieworedit: string = "";
  isNoInsurance: boolean = false;
  showFileUpload = {
    other: null
  }

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private dfaApplicationMainService: DFAApplicationMainService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private attachmentsService: AttachmentService,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    public _snackBar: MatSnackBar,
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.vieworedit = vieworedit;
    });

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
      }
    });
  }

  ngOnInit(): void {
    this.supportingDocumentsForm$ = this.formCreationService
      .getSupportingDocumentsForm()
      .subscribe((supportingDocuments) => {
        this.supportingDocumentsForm = supportingDocuments;
        this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(false);
      });

      this.fileUploadForm$ = this.formCreationService
      .getFileUploadsForm()
      .subscribe((fileUploads) => {
        this.fileUploadForm = fileUploads;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => { // setting these fields in fileUploadForm for validation checking
          if (application) {
            if (this.isResidentialTenant) this.fileUploadForm.get('applicantType').setValue("ResidentialTenant");
            else if (this.isHomeowner) this.fileUploadForm.get('applicantType').setValue("Homeowner");
            else if (this.isSmallBusinessOwner) {
             this.fileUploadForm.get('applicantType').setValue("SmallBusinessOwner");
             if (this.isGeneral) this.fileUploadForm.get('smallBusinessOption').setValue("General");
             if (this.isCorporate) this.fileUploadForm.get('smallBusinessOption').setValue("Corporate");
             if (this.isLandlord) this.fileUploadForm.get('smallBusinessOption').setValue("Landlord");
            }
            else if (this.isFarmOwner) {
              this.fileUploadForm.get('applicantType').setValue("FarmOwner");
              if (this.isGeneral) this.fileUploadForm.get('farmOption').setValue("General");
              if (this.isCorporate) this.fileUploadForm.get('farmOption').setValue("Corporate");
            } else if (this.isCharitableOrganization) this.fileUploadForm.get('applicantType').setValue("CharitableOrganization");
          }
        });
      });

    this.fileUploadForm.addValidators([this.validateFormRequiredDocumentTypes]);

    // subscribe to changes for document summary
    const _documentSummaryFormArray = this.formCreationService.fileUploadsForm.value.get('fileUploads');
    _documentSummaryFormArray.valueChanges
      .pipe(
        mapTo(_documentSummaryFormArray.getRawValue())
        ).subscribe(data => this.documentSummaryDataSource.data = _documentSummaryFormArray.getRawValue()?.filter(x => x.deleteFlag == false));

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.supportingDocumentsForm.disable();
      this.fileUploadForm.disable();
    }
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  validateFormRequiredDocumentTypes: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    let invalid=false
    let supportingFiles = form.get('fileUploads')?.getRawValue();
    let applicantType = form.get('applicantType').value;
    const error={};
    if ((!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "InsuranceTemplate" && x.deleteFlag == false).length <= 0) && !this.isNoInsurance ) {
      invalid = true;
      error["noInsuranceTemplate"] = true;
    }
    else {
      invalid = false;
      error["noInsuranceTemplate"] = false;
    }
    switch (applicantType) {
      case "ResidentialTenant":
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noRentalAgreement"] = true;
        }
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "Identification" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noIdentification"] = true;
        }
        break;
      case "SmallBusinessOwner":
        let smallBusinessOption = form.get('smallBusinessOption').value;
        switch (smallBusinessOption) {
          case "General":
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T1GeneralIncomeTaxReturn" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT1GeneralIncomeTaxReturn"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "FinancialStatements" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noFinancialStatements"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noTenancyAgreement"] = true;
            }
            break;
          case "Corporate":
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T2CorporateIncomeTaxReturn" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT2CorporateIncomeTaxReturn"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "ProofOfOwnership" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noProofOfOwnership"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "FinancialStatements" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noFinancialStatements"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noTenancyAgreement"] = true;
            }
            break;
          case "Landlord":
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T1GeneralIncomeTaxReturn" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT1GeneralIncomeTaxReturn"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T776" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT776"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "ResidentialTenancyAgreement" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noResidentialTenancyAgreement"] = true;
            }
            break;
          default:
            break;
        }
        break;
      case "FarmOwner":
        let farmOption = form.get('farmOption').value;
        switch (farmOption) {
          case "General":
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T1GeneralIncomeTaxReturn" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT1GeneralIncomeTaxReturn"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "FinancialStatements" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noFinancialStatements"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noTenancyAgreement"] = true;
            }
            break;
          case "Corporate":
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "T2CorporateIncomeTaxReturn" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noT2CorporateIncomeTaxReturn"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "ProofOfOwnership" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noProofOfOwnership"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "FinancialStatements" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noFinancialStatements"] = true;
            }
            if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
              invalid = true;
              error["noTenancyAgreement"] = true;
            }
            break;
          default:
            break;
        }
        break;
      case "CharitableOrganization":
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "DirectorsListing" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noDirectorsListing"] = true;
        }
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "RegistrationProof" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noRegistrationProof"] = true;
        }
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "StructureAndPurpose" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noStructureAndPurpose"] = true;
        }
        if (!supportingFiles || supportingFiles?.filter(x => x.requiredDocumentType === "TenancyAgreement" && x.deleteFlag == false).length <= 0) {
          invalid = true;
          error["noTenancyAgreement"] = true;
        }
        break;
      default:
        break;
    }
    return invalid?error:null;
  }

  saveSupportingFiles(fileUpload: FileUpload): void {
      // dont allow same filename twice
      let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
      if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
        this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
        return;
      }

    if (this.fileUploadForm.get('supportingFilesFileUpload').status === 'VALID') {
      this.isLoading = true;
      fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1) // to allow upload as byte array
      this.attachmentsService.attachmentUpsertDeleteAttachment({body: fileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [ fileUpload ];
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          this.showSupportingFileForm = !this.showSupportingFileForm;
          if (fileUpload.requiredDocumentType == Object.keys(this.RequiredDocumentTypes)[Object.values(this.RequiredDocumentTypes).indexOf(this.RequiredDocumentTypes.TenancyAgreement)])
            this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(true);
          this.isLoading = false;
          this._snackBar.open('The document was successfully uploaded', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.showFileUpload = {
            other: false
          }
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
          this._snackBar.open(
              'Unable to upload the file. Please retry the upload process.',
              'Close',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
              }
          );
          
        }
      });
    } else {
      this.fileUploadForm.get('supportingFilesFileUpload').markAllAsTouched();
    }
  }

  saveRequiredForm(fileUpload: FileUpload): void {
    // dont allow same filename twice
    let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
    if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
      this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
      return;
    }

    this.isLoading = true;
    fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1) // to allow upload as byte array
    if (fileUploads?.filter(x => x.requiredDocumentType === fileUpload.requiredDocumentType).length > 0) {
      this.attachmentsService.attachmentUpsertDeleteAttachment({body: fileUpload }).subscribe({
        next: (result) => {
          let requiredDocumentTypeFoundIndex = fileUploads.findIndex(x => x.requiredDocumentType === fileUpload.requiredDocumentType);
          fileUploads[requiredDocumentTypeFoundIndex] = fileUpload;
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          this.isLoading = false;
          this._snackBar.open('The document was successfully uploaded', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          //this.vieworedit = 'viewOnly';
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
         // document.location.href = 'https://dfa.gov.bc.ca/error.html';
          this._snackBar.open(
            'Unable to upload the file. Please retry the upload process.',
            'Close',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
        );
        }
      });
    } else {
      this.attachmentsService.attachmentUpsertDeleteAttachment({body: fileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [fileUpload];
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          if (fileUpload.requiredDocumentType == Object.keys(this.RequiredDocumentTypes)[Object.values(this.RequiredDocumentTypes).indexOf(this.RequiredDocumentTypes.TenancyAgreement)])
            this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(true);
          this.isLoading = false;
          this._snackBar.open('The document was successfully uploaded', 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          //this.vieworedit = 'viewOnly';
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
          this._snackBar.open(
            'Unable to upload the file. Please retry the upload process.',
            'Close',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
        );
        }
      });
    }
  }

  cancelSupportingFiles(): void {
    this.showSupportingFileForm = !this.showSupportingFileForm;
    this.fileUploadForm.get('addNewFileUploadIndicator').setValue(false);
  }

  confirmDeleteDocumentSummaryRow(element): void {
    this.dialog
      .open(DFAFileDeleteDialogComponent, {
        data: {
          content: "Are you sure you want to delete the supporting document:<br/>" + element.fileName + "?"
        },
        width: '350px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.deleteDocumentSummaryRow(element);
        }
      });
  }

  warningDialog(message: string) {
    this.dialog
      .open(FileUploadWarningDialogComponent, {
        data: {
          content: message
        },
        width: '350px',
        disableClose: true
      });
  }

  deleteDocumentSummaryRow(element): void {
    var form = (element.requiredDocumentType == "InsuranceTemplate" ? this.fileUploadForm :
    (element.requiredDocumentType == "Identification" ? this.fileUploadForm :
    (element.requiredDocumentType == "TenancyAgreement" ? this.fileUploadForm : null)));
    if (form != null) {
      let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
      let foundIndex = fileUploads.findIndex(x => x.requiredDocumentType === element.requiredDocumentType);
      element.deleteFlag = true;
      element.fileData = element?.fileData?.substring(element?.fileData?.indexOf(',') + 1) // to allow upload as byte array
      this.attachmentsService.attachmentUpsertDeleteAttachment({body: element}).subscribe({
        next: (result) => {
          fileUploads.splice(foundIndex, 1);
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          switch (element.requiredDocumentType) {
            case "InsuranceTemplate":
              this.initRequiredFileForm("insuranceTemplateFileUpload");
              break;
            case "Identification":
              this.initRequiredFileForm("identificationFileUpload");
              break;
            case "TenancyAgreement":
              this.initRequiredFileForm("rentalAgreementFileUpload");
              break;
            case "ResidentialTenancyAgreement":
              this.initRequiredFileForm("tenancyAgreementFileUpload");
              break;
            case "T1GeneralIncomeTaxReturn":
              this.initRequiredFileForm("T1IncomeTaxReturnFileUpload");
              break;
            case "T2CorporateIncomeTaxReturm":
              this.initRequiredFileForm("T2IncomeTaxReturnFileUpload");
              break;
            case "FinancialStatements":
              this.initRequiredFileForm("financialStatementsFileUpload");
              break;
            case "ProofOfOwnership":
              this.initRequiredFileForm("proofOfOwnershipFileUpload");
              break;
            case "T776":
              this.initRequiredFileForm("T776FileUpload");
              break;
            case "DirectorsListing":
              this.initRequiredFileForm("directorsListingFileUpload");
              break;
            case "RegistrationProof":
              this.initRequiredFileForm("registrationProofFileUpload");
              break;
            case "StructureAndPurpose":
              this.initRequiredFileForm("structureAndPurposeFileUpload");
              break;
            default:
              break;
            }
          this.fileUploadForm.updateValueAndValidity();
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else if (element.fileType === Object.keys(this.FileCategories)[Object.values(this.FileCategories).indexOf(this.FileCategories.DamagePhoto)]) {
      this.dfaApplicationMainService.deleteDamagePhoto.emit(element);
    } else if (element.fileType === this.FileCategories.Cleanup) {
      this.dfaApplicationMainService.deleteCleanupLog.emit(element);
    } else {
      let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
      let index = fileUploads?.indexOf(element);
      element.deleteFlag = true;
      element.fileData = element?.fileData?.substring(element?.fileData?.indexOf(',') + 1) // to allow upload as byte array
      this.attachmentsService.attachmentUpsertDeleteAttachment({body: element}).subscribe({
        next: (result) => {
          fileUploads[index] = element;
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          if (fileUploads?.filter(x => x.requiredDocumentType == Object.keys(this.RequiredDocumentTypes)[Object.values(this.RequiredDocumentTypes).indexOf(this.RequiredDocumentTypes.TenancyAgreement)])?.length == 0)
            this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(false);
          if (this.formCreationService.fileUploadsForm.value.get('fileUploads').value.length === 0) {
            this.fileUploadForm
              .get('addNewFileUploadIndicator')
              .setValue(false);
          }
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  initRequiredFileForm(formName: string) {
    this.fileUploadForm.get(formName).reset();
    this.fileUploadForm.get(formName).get('modifiedBy').setValue("Applicant");
    this.fileUploadForm.get(formName).get('fileType').setValue(Object.keys(this.FileCategories)[Object.values(this.FileCategories).indexOf(this.FileCategories.Insurance)]);
    this.fileUploadForm.get(formName).get('requiredDocumentType').setValue(Object.keys(this.RequiredDocumentTypes)[Object.values(this.RequiredDocumentTypes).indexOf(this.RequiredDocumentTypes.InsuranceTemplate)]);
    this.fileUploadForm.get('addNewFileUploadIndicator').setValue(true);
    this.fileUploadForm.get(formName).get('deleteFlag').setValue(false);
    this.fileUploadForm.get(formName).get('applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    this.fileUploadForm.get(formName).get('id').setValue(null);
    this.fileUploadForm.updateValueAndValidity();
  }

  updateFileUploadFormOnVisibility(form: AbstractControl): void {
    form.get('fileName').updateValueAndValidity();
    form.get('fileDescription').updateValueAndValidity();
    form.get('fileType').updateValueAndValidity();
    form.get('requiredDocumentType').updateValueAndValidity();
    form.get('uploadedDate').updateValueAndValidity();
    form.get('modifiedBy').updateValueAndValidity();
    form.get('fileData').updateValueAndValidity();
  }

  /**
   * Returns the control of the form
   */
  get fileUploadFormControl(): { [key: string]: AbstractControl} {
    return this.fileUploadForm.controls;
  }

  ngOnDestroy(): void {
    this.supportingDocumentsForm$.unsubscribe();
    this.fileUploadForm$.unsubscribe();
  }

  public onToggleOtherDocuments() {
    this.showOtherDocuments = !this.showOtherDocuments;
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  declarations: [SupportingDocumentsComponent]
})
class SupportingDocumentsModule {}

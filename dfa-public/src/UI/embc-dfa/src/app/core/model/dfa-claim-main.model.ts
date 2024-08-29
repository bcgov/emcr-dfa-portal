import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Community, Country, StateProvince } from './address';
import { CustomValidationService } from '../services/customValidation.service';
import { SignatureBlock, SecondaryApplicantTypeOption, FileCategory, RoomType, RequiredDocumentType, ProjectStageOptionSet, FileCategoryClaim, RequiredDocumentTypeClaim, ClaimStageOptionSet } from 'src/app/core/api/models';
import { Invoice } from './dfa-invoice.model';


export class RecoveryClaim {
  claimNumber?: null | string;
  claimReceivedByEMCRDate?: null | string;
  claimStatus?: null | ClaimStageOptionSet;
  isFirstClaimApproved?: null | boolean;
  isThisFinalClaim?: null | boolean;
  totalInvoicesBeingClaimed?: null | string;
  claimPST?: null | string;
  claimGrossGST?: null | string;
  totalActualClaim?: null | string;
  invoices?: null | Invoice[];
  claimEligibleGST?: null | string;
  claimTotal?: null | string;
  approvedClaimTotal?: null | string;
  firstClaimDeductible1000?: null | string;
  approvedReimbursement?: null | string;
  eligiblePayable?: null | string;
  paidClaimAmount?: null | string;
  paidClaimDate?: null | string;
  

  constructor(
    claimNumber?: null | string,
    claimReceivedByEMCRDate?: null | string,
    claimStatus?: null | ClaimStageOptionSet,
    isFirstClaimApproved?: null | boolean,
    isThisFinalClaim?: null | boolean,
    totalInvoicesBeingClaimed?: null | string,
    claimPST?: null | string,
    claimGrossGST?: null | string,
    totalActualClaim?: null | string,
    invoices?: null | Invoice[],
    claimEligibleGST?: null | string,
    claimTotal?: null | string,
    approvedClaimTotal?: null | string,
    firstClaimDeductible1000?: null | string,
    approvedReimbursement?: null | string,
    eligiblePayable?: null | string,
    paidClaimAmount?: null | string,
    paidClaimDate?: null | string
  ) { }
}

export class RecoveryClaimForm {
  claimNumber = new UntypedFormControl();
  claimReceivedByEMCRDate = new UntypedFormControl();
  claimStatus = new UntypedFormControl();
  isFirstClaimApproved = new UntypedFormControl();
  isThisFinalClaim = new UntypedFormControl();
  totalInvoicesBeingClaimed = new UntypedFormControl();
  claimPST = new UntypedFormControl();
  claimGrossGST = new UntypedFormControl();
  totalActualClaim = new UntypedFormControl();
  invoices = new UntypedFormControl();
  claimEligibleGST = new UntypedFormControl();
  claimTotal = new UntypedFormControl();
  approvedClaimTotal = new UntypedFormControl();
  firstClaimDeductible1000 = new UntypedFormControl();
  approvedReimbursement = new UntypedFormControl();
  eligiblePayable = new UntypedFormControl();
  paidClaimAmount = new UntypedFormControl();
  paidClaimDate = new UntypedFormControl();

  constructor(
    recoveryClaim: RecoveryClaim,
    customValidator: CustomValidationService
  ) {
    
    if (recoveryClaim.claimNumber) {
      this.claimNumber.setValue(recoveryClaim.claimNumber);
    }
    else {
      this.claimNumber.setValue(0);
    }
    this.claimNumber.setValidators(null);

    if (recoveryClaim.claimReceivedByEMCRDate) {
      this.claimReceivedByEMCRDate.setValue(recoveryClaim.claimReceivedByEMCRDate);
    }
    this.claimReceivedByEMCRDate.setValidators(null);

    if (recoveryClaim.claimStatus) {
      this.claimStatus.setValue(recoveryClaim.claimStatus);
    }
    this.claimStatus.setValidators(null);

    if (recoveryClaim.isFirstClaimApproved) {
      this.isFirstClaimApproved.setValue(recoveryClaim.isFirstClaimApproved);
    }
    else {
      this.isFirstClaimApproved.setValue('false');
    }
    this.isFirstClaimApproved.setValidators(null);

    if (recoveryClaim.isThisFinalClaim) {
      this.isThisFinalClaim.setValue(recoveryClaim.isThisFinalClaim);
    }
    this.isThisFinalClaim.setValidators(null);

    if (recoveryClaim.totalInvoicesBeingClaimed) {
      this.totalInvoicesBeingClaimed.setValue(recoveryClaim.totalInvoicesBeingClaimed);
    }
    else {
      this.totalInvoicesBeingClaimed.setValue(0);
    }
    this.totalInvoicesBeingClaimed.setValidators(null);

    if (recoveryClaim.claimPST) {
      this.claimPST.setValue(recoveryClaim.claimPST);
    }
    else {
      this.claimPST.setValue(0);
    }
    this.claimPST.setValidators(null);

    if (recoveryClaim.claimGrossGST) {
      this.claimGrossGST.setValue(recoveryClaim.claimGrossGST);
    }
    else {
      this.claimGrossGST.setValue(0);
    }
    this.claimGrossGST.setValidators(null);

    if (recoveryClaim.totalActualClaim) {
      this.totalActualClaim.setValue(recoveryClaim.totalActualClaim);
    }
    else {
      this.totalActualClaim.setValue(0);
    }
    this.totalActualClaim.setValidators(null);

    if (recoveryClaim.invoices) {
      this.invoices.setValue(recoveryClaim.invoices);
    }
    this.invoices.setValidators(null);

    if (recoveryClaim.claimEligibleGST) {
      this.claimEligibleGST.setValue(recoveryClaim.claimEligibleGST);
    }
    else {
      this.claimEligibleGST.setValue(0);
    }
    this.claimEligibleGST.setValidators(null);

    if (recoveryClaim.claimTotal) {
      this.claimTotal.setValue(recoveryClaim.claimTotal);
    }
    else {
      this.claimTotal.setValue(0);
    }
    this.claimTotal.setValidators(null);

    if (recoveryClaim.approvedClaimTotal) {
      this.approvedClaimTotal.setValue(recoveryClaim.approvedClaimTotal);
    }
    else {
      this.approvedClaimTotal.setValue(0);
    }
    this.approvedClaimTotal.setValidators(null);

    if (recoveryClaim.firstClaimDeductible1000) {
      this.firstClaimDeductible1000.setValue(recoveryClaim.firstClaimDeductible1000);
    }
    else {
      this.firstClaimDeductible1000.setValue(0);
    }
    this.firstClaimDeductible1000.setValidators(null);

    if (recoveryClaim.approvedReimbursement) {
      this.approvedReimbursement.setValue(recoveryClaim.approvedReimbursement);
    }
    else {
      this.approvedReimbursement.setValue(0);
    }
    this.approvedReimbursement.setValidators(null);

    if (recoveryClaim.eligiblePayable) {
      this.eligiblePayable.setValue(recoveryClaim.eligiblePayable);
    }
    else {
      this.eligiblePayable.setValue(0);
    }
    this.eligiblePayable.setValidators(null);

    if (recoveryClaim.paidClaimAmount) {
      this.paidClaimAmount.setValue(recoveryClaim.paidClaimAmount);
    }
    else {
      this.paidClaimAmount.setValue(0);
    }
    this.paidClaimAmount.setValidators(null);

    if (recoveryClaim.paidClaimDate) {
      this.paidClaimDate.setValue(recoveryClaim.paidClaimDate);
    }
    this.paidClaimDate.setValidators(null);
  }
}

export class FileUploadClaim {
  claimId?: string;
  contentType?: string;
  deleteFlag?: boolean;
  fileData?: string;
  fileDescription?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: FileCategoryClaim;
  fileTypeText?: string;
  requiredDocumentType?: RequiredDocumentTypeClaim;
  id?: null | string;
  modifiedBy?: string;
  uploadedDate?: string;
  applicantType?: string;
}

export class FileUploadsClaimForm {
  claimId = new UntypedFormControl();
  applicantType = new UntypedFormControl();
  deleteFlag = new UntypedFormControl();
  id = new UntypedFormControl();
  fileName = new UntypedFormControl();
  fileDescription = new UntypedFormControl();
  fileType = new UntypedFormControl();
  fileTypeText = new UntypedFormControl();
  requiredDocumentType = new UntypedFormControl();
  uploadedDate = new UntypedFormControl();
  modifiedBy = new UntypedFormControl();
  fileData = new UntypedFormControl();
  contentType = new UntypedFormControl();
  fileSize = new UntypedFormControl();
  invoiceUpload: UntypedFormGroup;
  generalLedgerUpload: UntypedFormGroup;
  proofOfPaymentUpload: UntypedFormGroup;
  supportingFilesFileUpload: UntypedFormGroup;
  fileUploads = new UntypedFormControl([]);
  addNewFileUploadIndicator = new UntypedFormControl(false);

  constructor(
    fileUploads: Array<FileUploadClaim>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
    this.invoiceUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      claimId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileTypeText: [
        ''
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.generalLedgerUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      claimId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileTypeText: [
        ''
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.proofOfPaymentUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      claimId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],

      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileTypeText: [
        ''
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
    this.supportingFilesFileUpload = builder.group({
      deleteFlag: [
        false,
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      claimId: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      id: [
        '',
      ],
      fileName: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileDescription: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator),
          customValidator
            .maxLengthValidator(100)
            .bind(customValidator)
        ]
      ],
      fileType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileTypeText: [
        ''
      ],
      requiredDocumentType: [
        ''
      ],
      uploadedDate: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      modifiedBy: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileData: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      contentType: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ],
      fileSize: [
        '',
        [
          customValidator
            .conditionalValidation(
              () => this.addNewFileUploadIndicator.value,
              Validators.required
            )
            .bind(customValidator)
        ]
      ]
    });
  }
}

export class SupportingDocuments {
  hasCopyOfARentalAgreementOrLease?: boolean;

  constructor(
  ) { }
}

export class SupportingDocumentsForm {
  hasCopyOfARentalAgreementOrLease = new UntypedFormControl();

  constructor(
    supportingDocuments: SupportingDocuments,
  ) {
    if (supportingDocuments.hasCopyOfARentalAgreementOrLease != null) {
      this.hasCopyOfARentalAgreementOrLease.setValue(supportingDocuments.hasCopyOfARentalAgreementOrLease);
    }
    this.hasCopyOfARentalAgreementOrLease.setValidators(null);
  }
}

/**
 * DFA Application Main
 **/
export interface DfaClaimMain {
  id?: string;
  projectId?: string;
  claim?: RecoveryClaim;
}

import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Community, Country, StateProvince } from './address';
import { CustomValidationService } from '../services/customValidation.service';
import { SignatureBlock, SecondaryApplicantTypeOption, FileCategory, RoomType, RequiredDocumentType, ProjectStageOptionSet, FileCategoryClaim, RequiredDocumentTypeClaim, ClaimStageOptionSet, RequiredDocumentTypeAmendment, FileCategoryAmendment } from 'src/app/core/api/models';
import { Invoice } from './dfa-invoice.model';

export class ProjectAmendment {
  amendmentNumber?: null | number;
  amendmentReceivedDate?: null | string;
  amendmentReason?: null | string;
  amendmentApprovedDate?: null | string;
  emcrDecisionComments?: null | string;
  requestforProjectDeadlineExtention?: null | string;
  amendedProjectDeadlineDate?: null | string;
  deadlineExtensionApproved?: null | string;
  amended18MonthDeadline?: null | string;
  requestforAdditionalProjectCost ?: null | string;
  estimatedAdditionalProjectCost ?: null | number;
  additionalProjectCostDecision ?: null | string;
  approvedAdditionalProjectCost ?: null | number;
  amendmentId?: null | string;
  amendmentDecision?: null | string;

  constructor(
    amendmentNumber?: null | number,
    amendmentReceivedDate?: null | string,
    amendmentReason?: null | string,
    amendmentApprovedDate?: null | string,
    emcrDecisionComments?: null | string,
    requestforProjectDeadlineExtention?: null | string,
    amendedProjectDeadlineDate?: null | string,
    deadlineExtensionApproved?: null | string,
    amended18MonthDeadline?: null | string,
    requestforAdditionalProjectCost?: null | string,
    estimatedAdditionalProjectCost?: null | number,
    additionalProjectCostDecision?: null | string,
    approvedAdditionalProjectCost?: null | number,
    amendmentId?: null | string,
    amendmentDecision?: null | string,
  ) { }
}

export class ProjectAmendmentForm {
  amendmentNumber = new UntypedFormControl();
  amendmentReceivedDate = new UntypedFormControl();
  amendmentReason = new UntypedFormControl();
  amendmentApprovedDate = new UntypedFormControl();
  emcrDecisionComments = new UntypedFormControl();
  requestforProjectDeadlineExtention = new UntypedFormControl();
  amendedProjectDeadlineDate = new UntypedFormControl();
  deadlineExtensionApproved = new UntypedFormControl();
  amended18MonthDeadline = new UntypedFormControl();
  requestforAdditionalProjectCost = new UntypedFormControl();
  estimatedAdditionalProjectCost = new UntypedFormControl();
  additionalProjectCostDecision = new UntypedFormControl();
  approvedAdditionalProjectCost = new UntypedFormControl();
  amendmentId = new UntypedFormControl();
  amendmentDecision = new UntypedFormControl();

  constructor(
    projectAmendment: ProjectAmendment,
  ) {
    if (projectAmendment.amendmentNumber) {
      this.amendmentNumber.setValue(projectAmendment.amendmentNumber);
    }

    if (projectAmendment.amendmentReceivedDate) {
      this.amendmentReceivedDate.setValue(projectAmendment.amendmentReceivedDate);
    }

    if (projectAmendment.amendmentReason) {
      this.amendmentReason.setValue(projectAmendment.amendmentReason);
    }

    if (projectAmendment.amendmentApprovedDate) {
      this.amendmentApprovedDate.setValue(projectAmendment.amendmentApprovedDate);
    }

    if (projectAmendment.emcrDecisionComments) {
      this.emcrDecisionComments.setValue(projectAmendment.emcrDecisionComments);
    }

    if (projectAmendment.requestforProjectDeadlineExtention) {
      this.requestforProjectDeadlineExtention.setValue(projectAmendment.requestforProjectDeadlineExtention);
    }

    if (projectAmendment.amendedProjectDeadlineDate) {
      this.amendedProjectDeadlineDate.setValue(projectAmendment.amendedProjectDeadlineDate);
    }

    if (projectAmendment.deadlineExtensionApproved) {
      this.deadlineExtensionApproved.setValue(projectAmendment.deadlineExtensionApproved);
    }

    if (projectAmendment.amended18MonthDeadline) {
      this.amended18MonthDeadline.setValue(projectAmendment.amended18MonthDeadline);
    }

    if (projectAmendment.requestforAdditionalProjectCost) {
      this.requestforAdditionalProjectCost.setValue(projectAmendment.requestforAdditionalProjectCost);
    }

    if (projectAmendment.estimatedAdditionalProjectCost) {
      this.estimatedAdditionalProjectCost.setValue(projectAmendment.estimatedAdditionalProjectCost);
    }

    if (projectAmendment.additionalProjectCostDecision) {
      this.additionalProjectCostDecision.setValue(projectAmendment.additionalProjectCostDecision);
    }

    if (projectAmendment.approvedAdditionalProjectCost) {
      this.approvedAdditionalProjectCost.setValue(projectAmendment.approvedAdditionalProjectCost);
    }

    if (projectAmendment.amendmentId) {
      this.amendmentId.setValue(projectAmendment.amendmentId);
    }

    if (projectAmendment.amendmentDecision){
      this.amendmentDecision.setValue(projectAmendment.amendmentDecision);
    }
  }
}

export class FileUploadAmendment {
  projectId?: string;
  contentType?: string;
  deleteFlag?: boolean;
  fileData?: string;
  fileDescription?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: FileCategoryAmendment;
  fileTypeText?: string;
  requiredDocumentType?: RequiredDocumentTypeAmendment;
  id?: null | string;
  modifiedBy?: string;
  uploadedDate?: string;
  applicantType?: string;
  amendmentId?: string;
}

export class FileUploadsAmendmentForm {
  projectId = new UntypedFormControl();
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
  supportingFilesFileUpload: UntypedFormGroup;
  fileUploads = new UntypedFormControl([]);
  addNewFileUploadIndicator = new UntypedFormControl(false);

  constructor(
    fileUploads: Array<FileUploadAmendment>,
    customValidator: CustomValidationService,
    builder: UntypedFormBuilder
  ) {
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
      projectId: [
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
  //hasCopyOfARentalAgreementOrLease?: boolean;

  constructor() {}
}

export class SupportingDocumentsForm {
  //hasCopyOfARentalAgreementOrLease = new UntypedFormControl();

  constructor(supportingDocuments: SupportingDocuments) {
    //if (supportingDocuments.hasCopyOfARentalAgreementOrLease != null) {
    //  this.hasCopyOfARentalAgreementOrLease.setValue(supportingDocuments.hasCopyOfARentalAgreementOrLease);
    //}
    //this.hasCopyOfARentalAgreementOrLease.setValidators(null);
  }
}

/**
 * DFA Project Amendment Main
 **/

export interface DfaProjectAmendmentMain {
  id?: string | null;
  projectAmendment?: ProjectAmendment | null;
  projectId?: string | null;
} 

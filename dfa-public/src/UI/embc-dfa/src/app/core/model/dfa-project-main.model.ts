import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Community, Country, StateProvince } from './address';
import { CustomValidationService } from '../services/customValidation.service';
import { SignatureBlock, SecondaryApplicantTypeOption, FileCategory, RoomType, RequiredDocumentType, ProjectStageOptionSet, ProjectStatusBar } from 'src/app/core/api/models';

export class ProjectAmendment {
  amendmentNumber?: null | string;
  amendmentReceivedDate?: null | string;
  amendmentReason?: null | string;
  amendmentApprovedDate?: null | string;
  emcrDecisionComments?: null | string;
  requestforProjectDeadlineExtention?: null | string;
  amendedProjectDeadlineDate?: null | string;
  deadlineExtensionApproved?: null | string;
  amended18MonthDeadline?: null | string;
  requestforAdditionalProjectCost ?: null | string;
  estimatedAdditionalProjectCost ?: null | string;
  additionalProjectCostDecision ?: null | string;
  approvedAdditionalProjectCost ?: null | string;
  amendmentId?: null | string;

  constructor(
    amendmentNumber?: null | string,
    amendmentReceivedDate?: null | string,
    amendmentReason?: null | string,
    amendmentApprovedDate?: null | string,
    emcrDecisionComments?: null | string,
    requestforProjectDeadlineExtention?: null | string,
    amendedProjectDeadlineDate?: null | string,
    deadlineExtensionApproved?: null | string,
    amended18MonthDeadline?: null | string,
    requestforAdditionalProjectCost?: null | string,
    estimatedAdditionalProjectCost?: null | string,
    additionalProjectCostDecision?: null | string,
    approvedAdditionalProjectCost?: null | string,
    amendmentId?: null | string,
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
  }
}

export class RecoveryPlan {
  sitelocationdamageFromDate?: null | string;
  sitelocationdamageToDate?: null | string;
  projectNumber?: null | string;
  projectStatus?: null | ProjectStageOptionSet;
  projectName?: null | string;
  isdamagedDateSameAsApplication?: null | boolean;
  differentDamageDatesReason?: null | string;
  siteLocation?: null | string;
  infraDamageDetails?: null | string;
  causeofDamageDetails?: null | string;
  describeDamageDetails?: null | string;
  describeDamagedInfrastructure?: null | string;
  repairWorkDetails?: null | string;
  repairDamagedInfrastructure?: null | string;
  estimatedCompletionDate?: null | string;
  estimateCostIncludingTax?: null | number;
  projectApprovedDate ?: null | string;
  project18MonthDeadline ?: null | string;
  approvedCost?: null | number;
  approvedAmendedProjectCost?: null | number;
  claimTotal?: null | number;
  approvedTotal?: null | number;
  paidProjectAmount?: null | number;
  emcrapprovalcomments?: null | string;
  projectDecision?: null | string;

  constructor(
    sitelocationdamageFromDate?: null | string,
    sitelocationdamageToDate?: null | string,
    projectNumber?: null | string,
    projectStatus?: null | ProjectStageOptionSet,
    projectName?: null | string,
    isdamagedDateSameAsApplication?: null | boolean,
    differentDamageDatesReason?: null | string,
    siteLocation?: null | string,
    infraDamageDetails?: null | string,
    causeofDamageDetails?: null | string,
    describeDamageDetails?: null | string,
    describeDamagedInfrastructure?: null | string,
    repairWorkDetails?: null | string,
    repairDamagedInfrastructure?: null | string,
    estimatedCompletionDate?: null | string,
    estimateCostIncludingTax?: null | number,
    projectApprovedDate ?: null | string,
    project18MonthDeadline ?: null | string,
    approvedCost?: null | number,
    approvedAmendedProjectCost?: null | number,
    claimTotal?: null | number,
    approvedTotal?: null | number,
    paidProjectAmount?: null | number,
    emcrapprovalcomments?: null | string,
    projectDecision?: null | string
  ) { }
}

export class RecoveryPlanForm {
  sitelocationdamageFromDate = new UntypedFormControl();
  sitelocationdamageToDate = new UntypedFormControl();
  projectNumber = new UntypedFormControl();
  projectName = new UntypedFormControl();
  projectStatus = new UntypedFormControl();
  isdamagedDateSameAsApplication = new UntypedFormControl();
  differentDamageDatesReason = new UntypedFormControl();
  siteLocation = new UntypedFormControl();
  infraDamageDetails = new UntypedFormControl();
  causeofDamageDetails = new UntypedFormControl();
  describeDamageDetails = new UntypedFormControl();
  describeDamagedInfrastructure = new UntypedFormControl();
  repairWorkDetails = new UntypedFormControl();
  repairDamagedInfrastructure = new UntypedFormControl();
  estimatedCompletionDate = new UntypedFormControl();
  estimateCostIncludingTax = new UntypedFormControl();
  projectApprovedDate = new UntypedFormControl();
  project18MonthDeadline = new UntypedFormControl();
  approvedCost = new UntypedFormControl();
  approvedAmendedProjectCost = new UntypedFormControl();
  claimTotal = new UntypedFormControl();
  approvedTotal = new UntypedFormControl();
  paidProjectAmount = new UntypedFormControl();
  emcrapprovalcomments = new UntypedFormControl();
  projectDecision = new UntypedFormControl();

  constructor(
    recoveryPlan: RecoveryPlan,
    customValidator: CustomValidationService
  ) {

    if (recoveryPlan.sitelocationdamageFromDate) {
      this.sitelocationdamageFromDate.setValue(recoveryPlan.sitelocationdamageFromDate);
    }
    this.sitelocationdamageFromDate.setValidators(null);

    if (recoveryPlan.sitelocationdamageToDate) {
      this.sitelocationdamageToDate.setValue(recoveryPlan.sitelocationdamageToDate);
    }
    this.sitelocationdamageToDate.setValidators(null);

    if (recoveryPlan.projectNumber) {
      this.projectNumber.setValue(recoveryPlan.projectNumber);
    }
    this.projectNumber.setValidators([customValidator
      .isRequired(this.projectNumber)
      .bind(customValidator)]);

    if (recoveryPlan.projectName) {
      this.projectName.setValue(recoveryPlan.projectName);
    }
    this.projectName.setValidators(null);

    if (recoveryPlan.projectStatus) {
      this.projectStatus.setValue(recoveryPlan.projectStatus);
    }
    this.projectStatus.setValidators(null);

    if (recoveryPlan.isdamagedDateSameAsApplication) {
      this.isdamagedDateSameAsApplication.setValue(recoveryPlan.isdamagedDateSameAsApplication);
    }
    this.isdamagedDateSameAsApplication.setValidators(null);

    if (recoveryPlan.differentDamageDatesReason) {
      this.differentDamageDatesReason.setValue(recoveryPlan.differentDamageDatesReason);
    }
    this.differentDamageDatesReason.setValidators(null);

    if (recoveryPlan.siteLocation) {
      this.siteLocation.setValue(recoveryPlan.siteLocation);
    }
    this.siteLocation.setValidators(null);

    if (recoveryPlan.infraDamageDetails) {
      this.infraDamageDetails.setValue(recoveryPlan.infraDamageDetails);
    }
    this.infraDamageDetails.setValidators(null);

    if (recoveryPlan.causeofDamageDetails) {
      this.causeofDamageDetails.setValue(recoveryPlan.causeofDamageDetails);
    }
    this.causeofDamageDetails.setValidators(null);

    if (recoveryPlan.describeDamageDetails) {
      this.describeDamageDetails.setValue(recoveryPlan.describeDamageDetails);
    }
    this.describeDamageDetails.setValidators(null);

    if (recoveryPlan.describeDamagedInfrastructure) {
      this.describeDamagedInfrastructure.setValue(recoveryPlan.describeDamagedInfrastructure);
    }
    this.describeDamagedInfrastructure.setValidators(null);

    if (recoveryPlan.repairWorkDetails) {
      this.repairWorkDetails.setValue(recoveryPlan.repairWorkDetails);
    }
    this.repairWorkDetails.setValidators(null);

    if (recoveryPlan.repairDamagedInfrastructure) {
      this.repairDamagedInfrastructure.setValue(recoveryPlan.repairDamagedInfrastructure);
    }
    this.repairDamagedInfrastructure.setValidators(null);

    if (recoveryPlan.estimatedCompletionDate) {
      this.estimatedCompletionDate.setValue(recoveryPlan.estimatedCompletionDate);
    }
    this.estimatedCompletionDate.setValidators(null);

    if (recoveryPlan.estimateCostIncludingTax) {
      this.estimateCostIncludingTax.setValue(recoveryPlan.estimateCostIncludingTax);
    }
    this.estimateCostIncludingTax.setValidators(null);

    if (recoveryPlan.projectApprovedDate) {
      this.projectApprovedDate.setValue(recoveryPlan.projectApprovedDate);
    }
    this.projectApprovedDate.setValidators(null);

    if (recoveryPlan.project18MonthDeadline) {
      this.project18MonthDeadline.setValue(recoveryPlan.project18MonthDeadline);
    }
    this.project18MonthDeadline.setValidators(null);

    if (recoveryPlan.approvedCost) {
      this.approvedCost.setValue(recoveryPlan.approvedCost);
    }
    this.approvedCost.setValidators(null);

    if (recoveryPlan.approvedAmendedProjectCost) {
      this.approvedAmendedProjectCost.setValue(recoveryPlan.approvedAmendedProjectCost);
    }
    this.approvedAmendedProjectCost.setValidators(null);

    if (recoveryPlan.claimTotal) {
      this.claimTotal.setValue(recoveryPlan.claimTotal);
    }
    this.claimTotal.setValidators(null);

    if (recoveryPlan.approvedTotal) {
      this.approvedTotal.setValue(recoveryPlan.approvedTotal);
    }
    this.approvedTotal.setValidators(null);

    if (recoveryPlan.paidProjectAmount) {
      this.paidProjectAmount.setValue(recoveryPlan.paidProjectAmount);
    }
    this.paidProjectAmount.setValidators(null);

    if (recoveryPlan.emcrapprovalcomments) {
      this.emcrapprovalcomments.setValue(recoveryPlan.emcrapprovalcomments);
    }
    this.emcrapprovalcomments.setValidators(null);

    if (recoveryPlan.projectDecision) {
      this.projectDecision.setValue(recoveryPlan.projectDecision);
    }
    this.projectDecision.setValidators(null);

  }
}


export class FileUpload {
  projectId?: string;
  contentType?: string;
  deleteFlag?: boolean;
  fileData?: string;
  fileDescription?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: FileCategory;
  fileTypeText?: string;
  requiredDocumentType?: RequiredDocumentType;
  id?: null | string;
  modifiedBy?: string;
  uploadedDate?: string;
  applicantType?: string;
}

export class FileUploadsForm {
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
  prevEventConditionFileUpload: UntypedFormGroup;
  postEventConditionFileUpload: UntypedFormGroup;
  supportingFilesFileUpload: UntypedFormGroup;
  fileUploads = new UntypedFormControl([]);
  addNewFileUploadIndicator = new UntypedFormControl(false);

  constructor(
    fileUploads: Array<FileUpload>,
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
    this.prevEventConditionFileUpload = builder.group({
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
    this.postEventConditionFileUpload = builder.group({
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
export interface DfaProjectMain {
  id?: string;
  applicationId?: string;
  project?: RecoveryPlan;
}

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

/**
 * DFA Amendment Main
 **/
export interface DfaAmendmentMain {
  id?: string;
  projectId?: string;
  amendment?: ProjectAmendment;
}

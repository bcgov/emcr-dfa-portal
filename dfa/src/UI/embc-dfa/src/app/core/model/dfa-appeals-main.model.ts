import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SignatureBlock } from 'src/app/core/api/models';
import { CustomValidationService } from '../services/customValidation.service';

/**
 * Appeal Reason (data class)
 **/
export class AppealReason {
  reason?: null | string;

  constructor() {
    this.reason = null;
  }
}

/**
 * Appeal Reason Form (form class)
 **/
export class AppealReasonForm {
  reason = new UntypedFormControl('', Validators.required);
  reviewedEvaluatorReport = new UntypedFormControl('', Validators.required);
  
  constructor(
    appealReason: AppealReason, 
    customValidator: CustomValidationService,
    appealType: AppealType
  ) {
    if (appealReason.reason){
      this.reason.setValue(appealReason.reason);
    }
    if (appealType === AppealType.Amount) {
      this.reviewedEvaluatorReport = new UntypedFormControl('', Validators.required);
      if ((appealReason as any).reviewedEvaluatorReport) {
        this.reviewedEvaluatorReport.setValue((appealReason as any).reviewedEvaluatorReport);
      }
    } else {
      this.reviewedEvaluatorReport = new UntypedFormControl('');
    }
  }

  get valid(): boolean {
    return this.reason.valid &&
      (this.reviewedEvaluatorReport.validator
        ? this.reviewedEvaluatorReport.valid
        : true);
  }

}

export class SignAndSubmit {
  applicantSignature?: null | SignatureBlock;
  secondaryApplicantSignature?: null | SignatureBlock;
  ninetyDayDeadline?: null | string;

  constructor() {
    this.applicantSignature = null;
    this.secondaryApplicantSignature = null;
    this.ninetyDayDeadline = null;
  }
}

export class AppealSignAndSubmitForm {
  applicantSignature: UntypedFormGroup;
  secondaryApplicantSignature: UntypedFormGroup;
  ninetyDayDeadline = new UntypedFormControl();

  constructor(
    signAndSubmit: SignAndSubmit,
    fb: UntypedFormBuilder
  ) {
    this.applicantSignature = fb.group({
      signature: [null, Validators.required],
      dateSigned: [null, Validators.required],
      signedName: [null, Validators.required]
    });
    this.applicantSignature?.controls.signature.setValue(signAndSubmit?.applicantSignature?.signature);
    this.applicantSignature?.controls.dateSigned.setValue(signAndSubmit?.applicantSignature?.dateSigned);
    this.applicantSignature?.controls.signedName.setValue(signAndSubmit?.applicantSignature?.signedName);

    this.secondaryApplicantSignature = fb.group({
      signature: null,
      dateSigned: null,
      signedName: null
    });
    this.secondaryApplicantSignature?.controls.signature.setValue(signAndSubmit?.secondaryApplicantSignature?.signature);
    this.secondaryApplicantSignature?.controls.dateSigned.setValue(signAndSubmit?.secondaryApplicantSignature?.dateSigned);
    this.secondaryApplicantSignature?.controls.signedName.setValue(signAndSubmit?.secondaryApplicantSignature?.signedName);

    this.ninetyDayDeadline.setValue(signAndSubmit.ninetyDayDeadline);
  }
}

export enum AppealType {
  Amount = 222710000,
  Eligibility = 222710001,
  Other = 222710002
}

export enum AppealStatus {
  InEApprovals = 'In eApprovals',
  InProgress = 'In Progress',
  InProgressWithLegal = 'In Progress - with legal',
  InProgressWithSME = 'In Progress - with SME',
  InProgressWithAppealsOfficer = 'In Progress - with Appeals Officer',
  InProgressWithEvaluator = 'In Progress - with Evaluator',
  Received = 'Received',
  PendingDecision = 'Pending Decision'
}

/**
 * DFA Appeals Main
 **/
export interface DfaAppeal {
  id?: string;
  caseId: string;
  type: AppealType;
  status: AppealStatus;
  reason: string;
  signAndSubmit?: SignAndSubmit;
}

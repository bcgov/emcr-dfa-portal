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
  
  constructor(
    appealReason: AppealReason, 
    customValidator: CustomValidationService
  ) {
    if (appealReason.reason){
      this.reason.setValue(appealReason.reason);
    }
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

/**
 * DFA Appeals Main
 **/
export interface DfaAppeal {
  id: string;
  caseId: string;
  appealReason: AppealReason;
  signAndSubmit: SignAndSubmit;
  status: string;
}

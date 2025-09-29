import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadAppeal, FileCategory, SignatureBlock } from 'src/app/core/api/models';
import { CustomValidationService } from '../services/customValidation.service';


/**
 * Appeal Reason Form (form class)
 **/
export class AppealReasonForm {
  reason = new UntypedFormControl('', Validators.required);
  reviewedEvaluatorReport = new UntypedFormControl(false, Validators.required);

  constructor(
    appealReason: string,
    customValidator: CustomValidationService,
    appealType: AppealType
  ) {
    if (appealReason){
      this.reason.setValue(appealReason || '');
    }
    if (appealType === AppealType.Amount) {
      this.reviewedEvaluatorReport = new UntypedFormControl('', Validators.required);
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

/**
 * A form group for a single appeal supporting document.
 *
 * @export
 * @class AppealSupportingDocumentForm
 * @extends {(FormGroup<{
 *   id: FormControl<string | null>;
 *   appealId: FormControl<string | null>;
 *   fileData: FormControl<string | null>;
 *   fileName: FormControl<string | null>;
 *   fileType: FormControl<FileCategory | null>;
 *   fileDescription: FormControl<string | null>;
 *   uploadedDate: FormControl<string | null>;
 *   fileSize: FormControl<number | null>;
 *   contentType: FormControl<string | null>;
 *   deleteFlag: FormControl<boolean | null>;
 * }>)}
 */
export class AppealSupportingDocumentForm extends FormGroup<{
  id: FormControl<string | null>;
  appealId: FormControl<string | null>;
  fileData: FormControl<string | null>;
  fileName: FormControl<string | null>;
  fileType: FormControl<FileCategory | null>;
  fileDescription: FormControl<string | null>;
  uploadedDate: FormControl<string | null>;
  fileSize: FormControl<number | null>;
  contentType: FormControl<string | null>;
  deleteFlag: FormControl<boolean | null>;
}> {
  constructor(appealSupportingDocument?: FileUploadAppeal) {
    super({
      id: new FormControl(appealSupportingDocument?.id || null),
      appealId: new FormControl(appealSupportingDocument?.appealId || null),
      fileData: new FormControl(appealSupportingDocument?.fileData || null),
      fileName: new FormControl(appealSupportingDocument?.fileName || null),
      fileDescription: new FormControl(appealSupportingDocument?.fileDescription || null),
      fileType: new FormControl(appealSupportingDocument?.fileType || null),
      uploadedDate: new FormControl(appealSupportingDocument?.uploadedDate || null),
      fileSize: new FormControl(appealSupportingDocument?.fileSize || null),
      contentType: new FormControl(appealSupportingDocument?.contentType || null),
      deleteFlag: new FormControl(appealSupportingDocument?.deleteFlag ?? null),
    });
  }
}

/**
 * A form for an array of appeal supporting documents.
 *
 * @export
 * @class AppealSupportingDocumentsForm
 * @extends {FormGroup<{
 *   files: FormArray<AppealSupportingDocumentForm>;
 * }>}
 */
export class AppealSupportingDocumentsForm extends FormGroup<{
  files: FormArray<AppealSupportingDocumentForm>;
}> {
  constructor(appealSupportingDocuments?: FileUploadAppeal[]) {
    super({
      files: new FormArray<AppealSupportingDocumentForm>(
        (appealSupportingDocuments ?? []).map((file) => new AppealSupportingDocumentForm(file))
      )
    });
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
  applicationId?: string;
  caseId: string;
  type: AppealType;
  status: AppealStatus;
  reason: string;
  signAndSubmit?: SignAndSubmit;
}

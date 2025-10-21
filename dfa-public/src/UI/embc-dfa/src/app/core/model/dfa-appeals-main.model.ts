import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUploadClaimAppeal, FileCategoryClaim, FileCategoryAppeal } from 'src/app/core/api/models';
import { CustomValidationService } from '../services/customValidation.service';

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
 *   fileType: FormControl<FileCategoryAppeal | null>;
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
  fileType: FormControl<FileCategoryAppeal | null>;
  fileDescription: FormControl<string | null>;
  uploadedDate: FormControl<string | null>;
  fileSize: FormControl<number | null>;
  contentType: FormControl<string | null>;
  deleteFlag: FormControl<boolean | null>;
}> {
  constructor(appealSupportingDocument?: FileUploadClaimAppeal) {
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
      deleteFlag: new FormControl(appealSupportingDocument?.deleteFlag || null),
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
  constructor(appealSupportingDocuments?: FileUploadClaimAppeal[]) {
    super({
      files: new FormArray<AppealSupportingDocumentForm>(
        (appealSupportingDocuments ?? []).map((file) => new AppealSupportingDocumentForm(file))
      )
    });
  }
}

export class FileUploadsClaimAppealForm {
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
    fileUploads: Array<FileUploadClaimAppeal>,
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
}

/**
 * Application statuses.
 *
 * See `Entities.cs -> ApplicationStages`.
 *
 * @export
 * @enum {number}
 */
export enum ApplicationStatus {
  Draft = 'Draft',
  Submitted = 'Submitted',
  ReviewingApplication = 'Reviewing Application',
  CreatingCaseFile = 'Creating Case File',
  CaseCreated = 'Case Created',
  CaseInProgress = 'Case In Progress',
  Closed = 'Closed',
}

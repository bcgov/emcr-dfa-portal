import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { AppealAttachmentService } from 'src/app/core/api/services';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { AppealSupportingDocumentForm, AppealSupportingDocumentsForm } from 'src/app/core/model/dfa-appeals-main.model';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';
import { DfaApplicationMain, FileUploadAppeal } from 'src/app/core/api/models';

@Component({
  selector: 'app-supporting-documents',
  standalone: false,
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.scss']
})
export default class SupportingDocumentsComponent implements OnInit {
  /**
   * Indicates whether the component is in read-only mode.
   * In read-only mode, the user cannot add or remove supporting documents.
   */
  @Input() isReadOnly: boolean = false;

  /**
   * The form for managing appeal supporting documents.
   *
   * Note: This form is largely unused, as there are no UI controls which directly bind to it, and is here for possible
   * future use.
   */
  appealSupportingDocumentsForm: AppealSupportingDocumentsForm | undefined;

  /**
   * The list of current supporting documents for the appeal to render.
   *
   * Note: This does not include files that are marked for deletion, and should not be used as the source of truth for
   * the state of the appeal supporting documents.
   */
  currentAppealSupportingDocuments: FileUploadAppeal[] = [];

  /**
   * Set to a valid FileUploadAppeal object to pre-fill the form fields with existing data.
   */
  editFileUploadFormData: FileUploadAppeal | undefined;

  /**
   * Indicates whether the application data is currently being loaded.
   */
  isLoadingApplication: boolean = true;
  /**
   * Indicates whether the file upload form should be shown.
   */
  isShowFileUpload: boolean = false;

  /**
   * The case ID guid.
   */
  caseId: string | undefined;
  appealId : string | undefined;
  /**
   * The case record.
   */

  @Input() applicationDetails: DfaApplicationMain = this.dfaAppealDataService.getFullApplication();
  @Input() caseDetails: any;

  constructor(
    private route: ActivatedRoute,
    private dfaAppealDataService: DFAAppealDataService,
    private cdr: ChangeDetectorRef,
    private appealAttachmentService: AppealAttachmentService,
    public formCreationService: FormCreationService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.caseDetails = this.dfaAppealDataService.getCaseDetails();

    this.cdr.detectChanges();

    this.route.paramMap
      .pipe(
        switchMap((routeParams) => {
          this.appealId = routeParams.get('appealId');

          return this.formCreationService.getAppealSupportingDocumentsForm().pipe(
            take(1),
            switchMap((appealSupportingDocumentsForm) => {
              this.appealSupportingDocumentsForm = appealSupportingDocumentsForm;

              if (!this.appealId) {
                // This is a new appeal, no existing documents to fetch.
                return of(new Array<FileUploadAppeal>());
              }

              // Fetch the existing appeal supporting documents, if this is an existing appeal.
              return this.appealAttachmentService
                .appealAttachmentGetAttachmentsByAppealId({ appealId: this.appealId })
                .pipe(take(1));
            })
          );
        })
      )
      .subscribe({
        next: (appealSupportingDocuments) => {
          this.currentAppealSupportingDocuments = appealSupportingDocuments;

          // Update the form state with the fetched documents.
          const formArray = this.appealSupportingDocumentsForm.get('files') as FormArray<AppealSupportingDocumentForm>;
          this.currentAppealSupportingDocuments.forEach((doc) => formArray.push(new AppealSupportingDocumentForm(doc)));
        },
        error: () => {
          this._snackBar.open(
            'Failed to load supporting documents. Please try again. If the error persists, please contact support.',
            'Close',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
        }
      });
  }

  ngOnChanges(): void {}

  /**
   * Handles the toggling of visibility of the file upload form based.
   *
   * @param {boolean} event
   * @return {*}  {void}
   */
  handleShowFileUpload(event: boolean): void {
    if (this.isShowFileUpload === event) {
      // If the current state is the same as the event, do nothing
      return;
    }

    if (event) {
      this._showFileUploadForm();
      return;
    }

    this._hideFileUploadForm();
  }

  /**
   * Shows the file upload form for adding or editing a supporting document.
   *
   */
  _showFileUploadForm(): void {
    // Reset the form data when toggling the upload form
    this.editFileUploadFormData = undefined;
    // Show or hide the file upload form based on the event
    this.isShowFileUpload = true;
  }

  /**
   * Hides the file upload form and resets the form data.
   *
   */
  _hideFileUploadForm(): void {
    // Reset the form data when toggling the upload form
    this.editFileUploadFormData = undefined;
    // Show or hide the file upload form based on the event
    this.isShowFileUpload = false;
  }

  /**
   * Handles the addition of a new supporting document.
   *
   * @param {FileUploadAppeal} fileUploadAppeal
   * @return {*}  {void}
   */
  handleAddSupportingDocument(fileUploadAppeal: FileUploadAppeal): void {
    this._hideFileUploadForm();

    // If the filename already exists, we need to prevent it and show a snackbar warning
    const existingFile = this.currentAppealSupportingDocuments.find(
      // Don't match files that are marked for deletion, as they aren't true duplicates
      (file) => file.fileName === fileUploadAppeal.fileName && !file.deleteFlag
    );

    if (existingFile) {
      this._snackBar.open('A file with the same name already exists. Please choose a different name.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Append the new file upload to the list of existing documents
    this.currentAppealSupportingDocuments = [...this.currentAppealSupportingDocuments, fileUploadAppeal];

    const formArray = this.appealSupportingDocumentsForm.get('files') as FormArray<AppealSupportingDocumentForm>;
    formArray.push(new AppealSupportingDocumentForm(fileUploadAppeal));

    // add a snack bar message to indicate that the file has been added
    this._snackBar.open('Your file has been added successfully.', 'Close', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Handles the removal of a supporting document.
   *
   * For previously persisted files, it marks the file for deletion by setting the deleteFlag to true.
   * For files that have not been persisted yet, it removes the file from the list.
   *
   * @param {FileUploadAppeal} fileUploadAppeal
   * @return {*}  {void}
   */
  handleRemoveSupportingDocument(fileUploadAppeal: FileUploadAppeal): void {
    // Either remove the file from the list or mark it for deletion
    let existingFileUploads = this.currentAppealSupportingDocuments;

    if (!existingFileUploads?.length) {
      // No existing files, nothing to remove
      return;
    }

    const indexToRemove = existingFileUploads.findIndex(
      (existingFileUpload) => existingFileUpload.fileName === fileUploadAppeal.fileName
    );

    if (indexToRemove === -1) {
      // No file found with the specified name, nothing to remove
      return;
    }

    if (fileUploadAppeal.id) {
      // File has been previously persisted, mark the file for deletion
      existingFileUploads[indexToRemove].deleteFlag = true;
    } else {
      // File has not been persisted, remove the file from the list
      existingFileUploads.splice(indexToRemove, 1);
    }

    // Update the appealSupportingDocuments with the modified list, excluding any files marked for deletion.
    this.currentAppealSupportingDocuments = [...existingFileUploads.filter((file) => !file.deleteFlag)];

    // Update the form with the modified list
    const formArray = this.appealSupportingDocumentsForm.get('files') as FormArray<AppealSupportingDocumentForm>;
    formArray.removeAt(indexToRemove);
  }

  /**
   * Handle the cancellation of the file upload form.
   *
   */
  handleCancelSupportingDocument(): void {
    this._hideFileUploadForm();
  }

  /**
   * Displays a warning dialog with the specified message.
   *
   * @param {string} message
   */
  warningDialog(message: string) {
    this.dialog.open(FileUploadWarningDialogComponent, {
      data: {
        content: message
      },
      width: '350px',
      disableClose: true
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CurrentApplication, CurrentProjectAppeal, ProjectAppealModel, RecoveryPlan } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService, ProjectAppealService, ProjectService } from 'src/app/core/api/services';
import { WarningDialogComponent } from 'src/app/core/components/dialog-components/warning-dialog/warning-dialog.component';
import { AppealDocument } from 'src/app/feature-components/appeal-main/appeal-documents/appeal-documents.component';

/**
 * Public eligibility Appeal main component.
 *
 * @export
 * @class AppealMainComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-appeal-main',
  standalone: false,
  templateUrl: './appeal-main.component.html',
  styleUrl: './appeal-main.component.scss'
})
export class AppealMainComponent implements OnInit {
  /**
   * Specify that the appeal form is read-only.
   *
   * @type {boolean}
   * @memberof AppealMainComponent
   */

  get isReadOnly(): boolean {
    return this.vieworedit === 'view';
  }

  appealForm: FormGroup;
  projectId: string;
  project: RecoveryPlan;
  application: CurrentApplication;
  appeal: ProjectAppealModel;
  documents: AppealDocument[] = [];

  isLoading: boolean = false;
  isDisabled: boolean = false;

  reasonMaxLength: number = 2000;
  reasonRemainingLength: number = 2000;

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
  vieworedit: string = 'edit';
  appealId: any;
  applicationId: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private applicationService: ApplicationService,
    private projectAppealService: ProjectAppealService,
    private attachmentsService: AttachmentService,
    private dialog: MatDialog
  ) {
    this.appealForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        reason: new FormControl(null, [Validators.required, Validators.maxLength(this.reasonMaxLength)])
      }),
      step2: this.formBuilder.group({
        documents: this.formBuilder.array<AppealDocument>([])
      })
    });
  }

  ngOnInit(): void {
    console.log('Appeal Main Component Initialized');
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'];
      this.appealId = params['appealId'];
      this.applicationId = params['applicationId'];

      console.debug('Project ID:', this.projectId);
      this.loadProjectAndAppeal(this.projectId);
      this.loadApplication(this.applicationId);

    });
  }

  /**
   * Loads the application data based on the provided application ID.
   *
   * @param {string} applicationId
   * @memberof AppealMainComponent
   */
  loadApplication(applicationId: string) {
    this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
      next: (dfaApplicationMain) => {
        this.application = dfaApplicationMain;
      }
    });
  }

  /**
   * Loads the application data based on the provided application ID.
   *
   * @param {string} applicationId
   * @memberof AppealMainComponent
   */
  loadAppeal(appealId: string) {
    this.projectAppealService.projectAppealGetProjectAppealById({ id: appealId }).subscribe({
      next: (appeal) => {
        console.debug('Appeal Data:', appeal);
        this.appeal = appeal;
        this.vieworedit = appeal?.submissionDate ? 'view' : 'edit';
        this.appealForm.get('step1.reason')?.setValue(appeal?.reason ?? '');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  /**
   * Loads the project data based on the provided project ID.
   *
   * @param {string} projectId
   * @memberof AppealMainComponent
   */
  loadProjectAndAppeal(projectId: string) {
    this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
      next: (dfaProjectMain) => {
        console.debug('Project Data:', dfaProjectMain);
        if (dfaProjectMain && dfaProjectMain.project) {
          this.project = dfaProjectMain.project;
        }

        if (dfaProjectMain && dfaProjectMain.project?.projectAppealId) {
          this.appealId = dfaProjectMain.project.projectAppealId;
          this.loadAppeal(this.appealId);
        }
        else{
          this.appealId = this._createProjectAppeal();
        }
      },
      error: (error) => {
        console.error(error);
        // TODO: redirect to error page
        // document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  loadDocuments() {
    this.attachmentsService.attachmentGetProjectAppealAttachments({ projectAppealId: this.appeal.id }).subscribe({
      next: (response) => {
        console.debug('Documents Loaded:', response);
        if (response?.length > 0) {
          this.documents = response.map((doc) => ({
            id: doc.id,
            fileName: doc.fileName,
            fileDescription: doc.fileDescription,
            fileData: doc.fileData,
            FileType: doc.fileType,
            contentType: doc.contentType,
            fileSize: doc.fileSize,
            uploadedDate: new Date(doc.uploadedDate)
          }));
        }
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.warningDialog({
          title: 'Error Loading Documents',
          content:
            'There was an error loading your documents. Please try again. If the errors persists, please contact support.'
        });
      }
    });
  }

  /**
   * Cancels the appeal process and redirects user.
   *
   * @memberof AppealMainComponent
   */
  cancel() {
    this.router.navigate(['/dfa-application/' + this.applicationId + '/projects']);
  }

  /**
   * Submits the appeal form, validating it first.
   *
   * @return {*}  {Promise<void>}
   * @memberof AppealMainComponent
   */
  async submit(): Promise<void> {
    console.debug('Form Data:', this.appealForm.value);

    if (this.isDisabled || this.isReadOnly || this.isLoading) {
      return;
    }

    if (!this.isValid()) {
      this.warningDialog({
        title: 'Cannot Submit Appeal',
        content: 'Please fill in all required fields before submitting the appeal.'
      });
      return;
    }

    this.isLoading = true;
    this.isDisabled = true;
    this.appealForm.disable({ emitEvent: false });

    if (this.appeal?.id) {
      this._updateProjectAppeal();
    } else {
      this._createProjectAppeal();
    }

    this.appealForm.enable({ emitEvent: false });
    this.isDisabled = false;
    this.isLoading = false;
  }

  /**
   * Validates the appeal form.
   *
   * @return {*}  {boolean} `true` if the form is valid, otherwise `false`.
   * @memberof AppealMainComponent
   */
  isValid(): boolean {
    return this.appealForm.valid;
  }

  /**
   * Create a new project appeal.
   *
   * @memberof AppealMainComponent
   */
  _createProjectAppeal() {
    this.projectAppealService
      .projectAppealCreateProjectAppeal({
        body: {
          caseId: this.projectId
        }
      })
      .subscribe({
        next: async (response) => {
          console.debug('Appeal Created:', response);
                },
        error: (error) => {
          console.error('Error creating appeal:', error);
          this.warningDialog({
            title: 'Error Submitting Appeal',
            content:
              'There was an error submitting your appeal. Please try again. If the errors persists, please contact support.'
          });
        }
      });
  }

  /**
   * Update an existing project appeal.
   *
   * @memberof AppealMainComponent
   */
  _updateProjectAppeal() {
    this.projectAppealService
      .projectAppealUpdateProjectAppeal({
        id: this.appeal?.id,
        body: {
          // TODO: Finalize correct properties
          id: this.appeal?.id,
          caseId: this.projectId,
          reason: this.getReason()
        }
      })
      .subscribe({
        next: async (response) => {
          console.debug('Appeal Updated:', response);
          await this.uploadDocuments();
          this.router.navigate(['/dfa-application/' + this.applicationId + '/projects']);
        },
        error: (error) => {
          console.error('Error updating appeal:', error);
          this.warningDialog({
            title: 'Error Updating Appeal',
            content:
              'There was an error updating your appeal. Please try again. If the errors persists, please contact support.'
          });
        }
      });
  }

  /**
   * Uploads the documents from the appeal form's documents array.
   *
   * @return {*}  {Promise<void>}
   * @memberof AppealMainComponent
   */
  async uploadDocuments(): Promise<void> {
    let documents: AppealDocument[] = this.appealForm.get('step2.documents').value as AppealDocument[];

    if (!documents?.length) {
      return;
    }

    // Upload documents one at a time
    for (const document of documents) {
      await this.uploadDocument(document);
    }
  }

  /**
   * Uploads a single document.
   *
   * @param {AppealDocument} document
   * @return {*}  {Promise<void>}
   * @memberof AppealMainComponent
   */
  async uploadDocument(document: AppealDocument): Promise<void> {
    // TODO: Define type with correct properties
    const documentPayload: any = {
      contentType: document.contentType,
      fileData: document.fileData,
      fileDescription: document.fileDescription,
      fileName: document.fileName,
      fileSize: document.fileSize
    };

    await firstValueFrom(this.attachmentsService.attachmentUpsertProjectAppealAttachment({ body: documentPayload }))
      .then((_fileUploadId) => {
        // TODO: Handle the response
        console.debug('Document uploaded successfully:', _fileUploadId);
      })
      .catch((error) => {
        // TODO: handle error
        console.error('Error uploading document:', error);
        this.warningDialog({
          title: 'Error Uploading Document',
          content:
            'There was an error uploading the document. Please try again. If the errors persists, please contact support.'
        });
      });
  }

  /**
   * Deletes a document, and removes it from the documents form array.
   *
   * @param {number} index
   * @memberof AppealMainComponent
   */
  deleteDocument(index: number) {
    const documents = this.appealForm.get('step2.documents') as FormArray;

    const id = documents.at(index).get('id')?.value;

    this.attachmentsService.attachmentDeleteProjectAppealAttachment({ id }).subscribe({
      next: () => {
        console.debug('Document deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting document:', error);
        this.warningDialog({
          title: 'Error Deleting Document',
          content:
            'There was an error deleting the document. Please try again. If the errors persists, please contact support.'
        });
      }
    });

    if (documents?.length > index) {
      documents.removeAt(index);
    }
  }

  /**
   * Updates the remaining character count for the appeal reason field.
   *
   * @memberof AppealMainComponent
   */
  updateReasonRemainingCharacters() {
    this.reasonRemainingLength = this.reasonMaxLength - (this.appealForm.get('step1.reason').value?.length ?? 0);
  }

  /**
   * Displays a warning dialog with the provided message.
   *
   * @param {{title: string, content: string}} options
   * @memberof AppealMainComponent
   */
  warningDialog(options: { title: string; content: string }) {
    this.dialog.open(WarningDialogComponent, {
      data: {
        title: options.title,
        content: options.content
      },
      width: '500px',
      disableClose: true
    });
  }

  /**
   * Retrieves the reason for the appeal from the form, or returns a default message if its null.
   *
   * @return {*}  {string}
   * @memberof AppealMainComponent
   */
  getReason(): string {
    const reason = this.appealForm.get('step1.reason').value;

    if (!reason) {
      return 'No rationale provided.';
    }

    return reason;
  }

  /**
   * Retrieves the list of document file names from the form, or returns a default message if no documents were
   * uploaded.
   *
   * @return {*}  {string}
   * @memberof AppealMainComponent
   */
  getDocumentFileNamesList(): string {
    const documents = this.appealForm.get('step2.documents').value;

    if (!documents?.length) {
      return 'No supporting documents provided.';
    }

    return documents.map((doc) => doc.fileName).join('\n');
  }
}

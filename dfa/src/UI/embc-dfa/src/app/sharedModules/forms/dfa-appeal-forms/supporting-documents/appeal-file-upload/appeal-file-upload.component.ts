import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FileCategory, FileUploadAppeal } from 'src/app/core/api/models';
import { AppealSupportingDocumentForm } from 'src/app/core/model/dfa-appeals-main.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Component({
  selector: 'app-appeal-file-upload',
  standalone: false,
  templateUrl: './appeal-file-upload.component.html',
  styleUrls: ['./appeal-file-upload.component.scss']
})
export class AppealFileUploadComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Description for the file upload form.
   */
  @Input() description: string;
  /**
   * Set to a valid FileUploadAppeal object to pre-fill the form fields with existing data.
   */
  @Input() editFileUpload?: FileUploadAppeal;
  /**
   * The current file uploads to display in the table.
   *
   * @type {FileUploadAppeal[]}
   */
  @Input() currentFileUploads?: FileUploadAppeal[];
  /**
   * Indicates whether the component is in read-only mode.
   */
  @Input() isReadOnly: boolean = false;
  /**
   * Indicates whether the file upload form should be shown.
   *
   * @type {boolean}
   */
  @Input() isShowFileUpload: boolean = false;
  /**
   * Emits an event when the file upload component requests to show or hide the file upload form.
   * Note: The parent must set the `isShowFileUpload` input to true or false to control visibility.
   *
   */
  @Output() onShowFileUpload = new EventEmitter<boolean>();
  /**
   * Emits an event when the user saves the file upload.
   * Note: The file is not persisted to the API; the parent component must handle persisting the file upload.
   */
  @Output() onSave = new EventEmitter<FileUploadAppeal>();
  /**
   * Emits an event when the user removes a file upload.
   * Note: The parent component must handle the actual removal of the file upload.
   */
  @Output() onRemove = new EventEmitter<FileUploadAppeal>();
  /**
   * Emits an event when the user cancels the file upload.
   *
   */
  @Output() onCancel = new EventEmitter<void>();

  formCreationService: FormCreationService;

  fileUploadForm?: AppealSupportingDocumentForm;
  fileUploadForm$?: Subscription;

  noOfAttachments: number = 10;
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
  allowedFileExtensionsList = '.pdf, .doc, .docx, .png, .jpeg, .jpg, .ppt, .pptx, .xls, .xlsx';
  fileType = FileCategory.Appeal;

  savedDocumentsTableHeaders = ['fileName', 'description', 'uploadedDate', 'deleteIcon'];
  savedDocumentsUploadsTableData: MatTableDataSource<FileUploadAppeal> = new MatTableDataSource<FileUploadAppeal>([]);

  isEditView = this.router.url.includes('/edit');

  constructor(
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private router: Router
  ) {
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    this.fileUploadForm$ = this.formCreationService.getAppealSupportingDocumentForm().subscribe((form) => {
      this.fileUploadForm = form;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileUpload']) {
      if (!this.editFileUpload) {
        this.fileUploadForm?.reset();
        return;
      }
      // If fileUpload is provided, patch the form with its values
      this.fileUploadForm?.patchValue(this.editFileUpload);
    }

    if (changes['currentFileUploads']) {
      if (!this.currentFileUploads?.length) {
        this.savedDocumentsUploadsTableData.data = [];
        return;
      }
      // If currentFileUploads are provided, update the table data
      this.savedDocumentsUploadsTableData.data = this.currentFileUploads;
    }
  }

  /**
   * Shows the file upload form.
   *
   */
  showFileUpload(): void {
    this.onShowFileUpload.emit(true);
  }

  /**
   * Hides the file upload form.
   *
   */
  hideFileUpload(): void {
    this.onShowFileUpload.emit(false);
  }

  /**
   * Saves the file upload form.
   *
   * @return {*}  {void}
   */
  saveAttachment(): void {
    if (this.fileUploadForm.status !== 'VALID') {
      this.fileUploadForm.markAllAsTouched();
      return;
    }

    this.onSave.emit(this.fileUploadForm.value);

    this.fileUploadForm.reset();

    this.hideFileUpload();
  }

  /**
   * Removes the file upload item from the list.
   *
   * @param {FileUploadAppeal} fileUploadAppeal
   */
  removeAttachment(fileUploadAppeal: FileUploadAppeal): void {
    this.onRemove.emit(fileUploadAppeal);
  }

  /**
   * Cancels the file upload form.
   *
   */
  cancelAttachment(): void {
    this.onCancel.emit();

    this.fileUploadForm.reset();

    this.hideFileUpload();
  }

  ngOnDestroy(): void {
    this.fileUploadForm$.unsubscribe();
  }

  /**
   * Reads the attachment content and updates the form controls with the file data and metadata.
   *
   * @param {File} event
   */
  setFileFormControl(event: File) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      // Convert file data into format expected by the API
      const rawFileData = reader.result.toString();
      const fileData = rawFileData?.substring(rawFileData?.indexOf(',') + 1);

      // Update the form controls with the file data
      this.fileUploadForm.get('fileData').setValue(fileData);
      this.fileUploadForm.get('fileName').setValue(event.name);
      this.fileUploadForm.get('fileDescription').setValue(event.name);
      this.fileUploadForm.get('fileType').setValue(FileCategory.Appeal);
      this.fileUploadForm.get('uploadedDate').setValue(new Date().toISOString());
      this.fileUploadForm.get('fileSize').setValue(event.size);
      this.fileUploadForm.get('contentType').setValue(event.type);
    };
  }
}

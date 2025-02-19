import { Component, OnInit, NgModule, Inject, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
} from '@angular/forms';
import { KeyValue } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { FileCategory, FileUpload, RequiredDocumentType } from 'src/app/core/api/models';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';

@Component({
  selector: 'app-dfa-attachment',
  templateUrl: './dfa-attachment.component.html',
  styleUrls: ['./dfa-attachment.component.scss']
})
export class DfaAttachmentComponent implements OnInit, OnDestroy {
  @Input() requiredDocumentType: string;
  @Input() title: string;
  @Input() description: string;
  @Input() allowedFileTypes: string[];
  @Input() allowedFileExtensionsList: string;
  @Input() fileType: string;
  @Input() excludeFileTypes: string[];
  @Input() fileUpload: UntypedFormGroup;
  @Output() showSideNote = new EventEmitter<any>();
  @Output() saveFileUpload = new EventEmitter<FileUpload>();
  @Output() cancelFileUpload = new EventEmitter<any>();
  formBuilder: UntypedFormBuilder;
  fileUploadsForm: UntypedFormGroup;
  fileUploadsForm$: Subscription;
  formCreationService: FormCreationService;
  @Input() showFileUpload: boolean = false;
  FileCategories = FileCategory;
  RequiredDocumentTypes = RequiredDocumentType;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  onToggleSideNote() {
    this.showSideNote.emit();
  }

  ngOnInit(): void {
    this.fileUploadsForm$ = this.formCreationService
      .getFileUploadsForm()
      .subscribe((fileUploads) => {
        this.fileUploadsForm = fileUploads;
        this.initFileUploadForm();
      });

    this.fileUploadsForm
      .get('addNewFileUploadIndicator')
      .valueChanges.subscribe((value) => this.updateFileUploadFormOnVisibility());
  }

  initFileUploadForm() {
    let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
    if (this.requiredDocumentType && fileUploads?.filter(x => x.requiredDocumentType === this.requiredDocumentType).length > 0) {
      let foundIndex = fileUploads.findIndex(x => x.requiredDocumentType === this.requiredDocumentType);
      this.fileUpload.setValue(fileUploads[foundIndex]);
    } else {
      this.fileUpload.reset();
      this.fileUpload.get('modifiedBy').setValue("Applicant");
      if (this.fileType) this.fileUpload.get('fileType').setValue(this.fileType); else this.fileUpload.get('fileType').setValue(null);
      if (this.requiredDocumentType) this.fileUpload.get('requiredDocumentType').setValue(this.requiredDocumentType); else this.fileUpload.get('requiredDocumentType').setValue(null);
      this.fileUpload.get('deleteFlag').setValue(false);
      this.fileUpload.get('applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
      this.fileUpload.get('id').setValue(null);
      this.fileUpload.updateValueAndValidity();
    }
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  saveAttachment(): void {
    if (this.fileUpload.status === 'VALID') {
      this.saveFileUpload.emit(this.fileUpload.value);
      
      this.showFileUpload = false;
      this.initFileUploadForm();
    } else {
      console.error(this.fileUpload);
      this.fileUpload.markAllAsTouched();
    }
  }

  cancelAttachment(): void {
    this.showFileUpload = !this.showFileUpload;
    this.cancelFileUpload.emit();
    this.initFileUploadForm();
  }

  updateFileUploadFormOnVisibility(): void {
    this.fileUpload.get('fileName').updateValueAndValidity();
    this.fileUpload.get('fileDescription').updateValueAndValidity();
    this.fileUpload.get('fileType').updateValueAndValidity();
    this.fileUpload.get('uploadedDate').updateValueAndValidity();
    this.fileUpload.get('modifiedBy').updateValueAndValidity();
    this.fileUpload.get('fileData').updateValueAndValidity();
    this.fileUpload.get('requiredDocumentType').updateValueAndValidity();
  }

  /**
   * Returns the control of the form
   */
  get filesUploadFormControl(): { [key: string]: AbstractControl } {
    return this.fileUploadsForm.controls;
  }

  ngOnDestroy(): void {
    this.fileUploadsForm$.unsubscribe();
  }

/**
 * Reads the attachment content and encodes it as base64
 *
 * @param event : Attachment drop/browse event
 */
  setFileFormControl(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    reader.onload = () => {
      this.fileUpload.get('fileName').setValue(event.name);
      this.fileUpload.get('fileDescription').setValue(event.name);
      this.fileUpload.get('fileData').setValue(reader.result);
      this.fileUpload.get('contentType').setValue(event.type);
      this.fileUpload.get('fileSize').setValue(event.size);
      this.fileUpload.get('uploadedDate').setValue(new Date());
    };
  }
}

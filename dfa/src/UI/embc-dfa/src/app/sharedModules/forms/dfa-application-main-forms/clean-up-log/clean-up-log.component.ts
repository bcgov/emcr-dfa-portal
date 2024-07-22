import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged, mapTo } from 'rxjs/operators';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { FileUpload } from 'src/app/core/model/dfa-application-main.model';
import { FileCategory, SecondaryApplicantTypeOption } from 'src/app/core/api/models';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DFAApplicationMainService } from 'src/app/feature-components/dfa-application-main/dfa-application-main.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { AttachmentService, CleanUpLogItemService } from 'src/app/core/api/services';
import { CoreModule } from 'src/app/core/core.module';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DFAFileDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';
import { DFACleanuplogDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-cleanuplog-delete-dialog/dfa-cleanuplog-delete.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-clean-up-log',
  templateUrl: './clean-up-log.component.html',
  styleUrls: ['./clean-up-log.component.scss']
})
export default class CleanUpLogComponent implements OnInit, OnDestroy {
  cleanUpLogForm: UntypedFormGroup;
  cleanUpLogForm$: Subscription;
  cleanUpLogWorkForm: UntypedFormGroup;
  cleanUpLogWorkForm$: Subscription;
  cleanUpWorkFilesForm: UntypedFormGroup;
  cleanUpWorkFilesForm$: Subscription;
  formBuilder: UntypedFormBuilder;
  formCreationService: FormCreationService;
  showCleanUpWorkForm: boolean = false;
  cleanUpWorkColumnsToDisplay = ['date', 'name','hours','description', 'deleteIcon'];
  cleanUpWorkDataSource = new BehaviorSubject([]);
  cleanUpWorkData = [];
  showCleanUpWorkFileForm: boolean = false;
  cleanUpWorkFileColumnsToDisplay = ['fileName', 'fileDescription', 'uploadedDate', 'deleteIcon'];
  cleanUpWorkFileDataSource = new MatTableDataSource();
  FileCategories = FileCategory;
  todayDate = new Date().toISOString();
  vieworedit: string = "";
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
  isLoading: boolean = false;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private dfaApplicationMainService: DFAApplicationMainService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private cleanUpLogsService: CleanUpLogItemService,
    private attachmentsService: AttachmentService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.vieworedit = vieworedit;
    })
  }

  ngOnInit(): void {

    this.cleanUpLogForm$ = this.formCreationService
      .getCleanUpLogForm()
      .subscribe((cleanUpLog) => {
        this.cleanUpLogForm = cleanUpLog;
      });

    this.cleanUpLogWorkForm$ = this.formCreationService
      .getCleanUpLogItemsForm()
      .subscribe((cleanUpLogItems) => {
        this.cleanUpLogWorkForm = cleanUpLogItems;
        this.cleanUpLogWorkForm.updateValueAndValidity();
      });

    this.dfaApplicationMainService.deleteCleanupLog.subscribe((cleanupLogFileToDelete)=> {
      this.deleteCleanupLogFileRow(cleanupLogFileToDelete);
    });

    this.cleanUpLogWorkForm
      .get('addNewCleanUpLogIndicator')
      .valueChanges.subscribe((value) => this.updateCleanupLogOnVisibility());
    this.getCleanUpLogsForApplication(this.dfaApplicationMainDataService.getApplicationId());

    this.cleanUpWorkFilesForm$ = this.formCreationService
      .getFileUploadsForm()
      .subscribe((fileUploads) => {
        this.cleanUpWorkFilesForm = fileUploads;
        this.cleanUpWorkFilesForm.updateValueAndValidity();
    });

    this.cleanUpWorkFilesForm
      .get('addNewFileUploadIndicator')
      .valueChanges.subscribe((value) => this.updateCleanupLogFileOnVisibility());

    const _cleanUpWorkFileFormArray = this.formCreationService.fileUploadsForm.value.get('fileUploads');
     _cleanUpWorkFileFormArray.valueChanges
       .pipe(
         mapTo(_cleanUpWorkFileFormArray.getRawValue())
         ).subscribe(data => this.cleanUpWorkFileDataSource.data = _cleanUpWorkFileFormArray.getRawValue()?.filter(x => x.fileType === "Cleanup" && x.deleteFlag === false));

    this.initCleanUpWorkFiles();

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.cleanUpWorkFilesForm.disable();
    }
  }

  getCleanUpLogsForApplication(applicationId: string) {

    if (applicationId === undefined) {
      applicationId = this.dfaApplicationMainDataService.getApplicationId();
      //alert("applicationId: " + applicationId)
    }

    this.cleanUpLogsService.cleanUpLogItemGetCleanUpLogItems({applicationId: applicationId}).subscribe({
      next: (cleanUpLogs) => {
        this.cleanUpWorkData = cleanUpLogs;
        this.cleanUpWorkDataSource.next(this.cleanUpWorkData);
        this.cleanUpLogWorkForm.get('cleanuplogs').setValue(this.cleanUpWorkData);
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  /**
   * Returns the control of the form
   */
  get cleanUpLogWorkFormControl(): { [key: string]: AbstractControl } {
    return this.cleanUpLogWorkForm.controls;
  }
  get cleanUpWorkFilesFormControl(): { [key: string]: AbstractControl } {
    return this.cleanUpWorkFilesForm.controls;
  }

  updateCleanupLogOnVisibility(): void {
    this.cleanUpLogWorkForm
      .get('cleanuplog.date')
      .updateValueAndValidity();
    this.cleanUpLogWorkForm
      .get('cleanuplog.name')
      .updateValueAndValidity();
    this.cleanUpLogWorkForm
      .get('cleanuplog.hours')
      .updateValueAndValidity();
    this.cleanUpLogWorkForm
      .get('cleanuplog.description')
      .updateValueAndValidity();
  }

  updateCleanupLogFileOnVisibility(): void {
    this.cleanUpWorkFilesForm
      .get('cleanupFileUpload.uploadedDate')
      .updateValueAndValidity();
    this.cleanUpWorkFilesForm
      .get('cleanupFileUpload.fileName')
      .updateValueAndValidity();
    this.cleanUpWorkFilesForm
      .get('cleanupFileUpload.fileDescription')
      .updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.cleanUpLogForm$.unsubscribe();
    this.cleanUpLogWorkForm$.unsubscribe();
    this.cleanUpWorkFilesForm$.unsubscribe();
  }

  addCleanupLog(): void {
    this.cleanUpLogWorkForm.get('cleanuplog').reset();
    this.showCleanUpWorkForm = !this.showCleanUpWorkForm;
    this.cleanUpLogWorkForm.get('addNewCleanUpLogIndicator').setValue(true);
    this.cleanUpLogWorkForm.get('cleanuplog.deleteFlag').setValue(false);
    this.cleanUpLogWorkForm.get('cleanuplog.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
  }

  initCleanUpWorkFiles(): void {
    this.cleanUpWorkFilesForm.get('cleanupFileUpload').reset();
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.fileType').setValue(this.FileCategories.Cleanup);
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.requiredDocumentType').setValue(null);
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    this.showCleanUpWorkFileForm = !this.showCleanUpWorkFileForm;
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.modifiedBy').setValue("Applicant");
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.deleteFlag').setValue(false);
    this.cleanUpWorkFilesForm.get('addNewFileUploadIndicator').setValue(true);
  }

  cancelNewCleanupLog(): void {
    this.showCleanUpWorkForm = !this.showCleanUpWorkForm;
    this.cleanUpLogWorkForm.get('addNewCleanUpLogIndicator').setValue(false);
  }

  cancelNewCleanupLogFile(): void {
    this.showCleanUpWorkFileForm = !this.showCleanUpWorkFileForm;
    this.cleanUpWorkFilesForm.get('addNewFileUploadIndicator').setValue(false);
  }

  saveNewCleanupLog(): void {
    if (this.cleanUpLogWorkForm.get('cleanuplog').status === 'VALID') {
      this.cleanUpLogsService.cleanUpLogItemUpsertDeleteCleanUpLogItem({body: this.cleanUpLogWorkForm.get('cleanuplog').getRawValue() }).subscribe({
        next: (cleanUpLogId) => {
          this.cleanUpLogWorkForm.get('cleanuplog').get('id').setValue(cleanUpLogId);
          this.cleanUpWorkData.push(this.cleanUpLogWorkForm.get('cleanuplog').value);
          this.cleanUpWorkDataSource.next(this.cleanUpWorkData);
          this.cleanUpLogWorkForm.get('cleanuplogs').setValue(this.cleanUpWorkData);
          this.showCleanUpWorkForm = !this.showCleanUpWorkForm;
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      this.cleanUpLogWorkForm.get('cleanuplog').markAllAsTouched();
    }
  }

  saveNewCleanupLogFile(fileUpload: FileUpload): void {
    // dont allow same filename twice
    let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
    if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
      this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
      return;
    }
    this.isLoading = true;
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.uploadedDate').setValue(new Date());
    this.cleanUpWorkFilesForm.get('cleanupFileUpload.fileType').setValue(this.FileCategories.Cleanup);
    if (this.cleanUpWorkFilesForm.get('cleanupFileUpload').status === 'VALID') {
      fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1) // to allow upload as byte array

      this.attachmentsService.attachmentUpsertDeleteAttachment({body: fileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [ fileUpload ];
          this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
          this.cleanUpLogForm.get('haveInvoicesOrReceiptsForCleanupOrRepairs').setValue('true');
          this.showCleanUpWorkFileForm = !this.showCleanUpWorkFileForm;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      this.cleanUpWorkFilesForm.get('cleanupFileUpload').markAllAsTouched();
      this.isLoading = false;
    }
  }

  confirmDeleteCleanuplogRow(index: number): void {
    this.dialog
      .open(DFACleanuplogDeleteDialogComponent, {
        data: {
          content: "Are you sure you want to delete the clean up log for:<br/>" + this.cleanUpWorkData[index].name + "?"
        },
        width: '350px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.deleteCleanupLogRow(index);
        }
      });
  }

  deleteCleanupLogRow(index: number): void {
    this.cleanUpWorkData[index].deleteFlag = true;
    this.cleanUpLogsService.cleanUpLogItemUpsertDeleteCleanUpLogItem({body: this.cleanUpWorkData[index]}).subscribe({
      next: (result) => {
          this.cleanUpWorkData.splice(index, 1);
          this.cleanUpWorkDataSource.next(this.cleanUpWorkData);
          this.cleanUpLogWorkForm.get('cleanuplogs').setValue(this.cleanUpWorkData);
          if (this.cleanUpWorkData.length === 0) {
            this.cleanUpLogWorkForm
              .get('addNewCleanUpLogIndicator')
              .setValue(false);
          }
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  confirmDeleteCleanupLogFileRow(element): void {
    this.dialog
      .open(DFAFileDeleteDialogComponent, {
        data: {
          content: "Are you sure you want to delete the cleanup invoice/receipt:<br/>" + element.fileName + "?"
        },
        // height: '250px',
        width: '350px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.deleteCleanupLogFileRow(element);
        }
      });
  }

  warningDialog(message: string) {
    this.dialog
      .open(FileUploadWarningDialogComponent, {
        data: {
          content: message
        },
        // height: '250px',
        width: '350px',
        disableClose: true
      });
  }

  deleteCleanupLogFileRow(element): void {
    let fileUploads = this.formCreationService.fileUploadsForm.value.get('fileUploads').value;
    let index = fileUploads.indexOf(element);
    element.deleteFlag = true;
    element.fileData = element?.fileData?.substring(element?.fileData?.indexOf(',') + 1) // to allow upload as byte array
    this.attachmentsService.attachmentUpsertDeleteAttachment({body: element}).subscribe({
      next: (result) => {
        fileUploads[index] = element;
        this.formCreationService.fileUploadsForm.value.get('fileUploads').setValue(fileUploads);
        if (this.formCreationService.fileUploadsForm.value.get('fileUploads').value?.filter(x => x.fileType == FileCategory.Cleanup).length === 0) {
          this.cleanUpLogForm.get('haveInvoicesOrReceiptsForCleanupOrRepairs').setValue('false');
          this.cleanUpWorkFilesForm
            .get('addNewFileUploadIndicator')
            .setValue(false);
        }
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    CustomPipeModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatDatepickerModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  declarations: [CleanUpLogComponent],
  providers: [
    provideNgxMask()
  ],
})
class CleanUpLogModule {}

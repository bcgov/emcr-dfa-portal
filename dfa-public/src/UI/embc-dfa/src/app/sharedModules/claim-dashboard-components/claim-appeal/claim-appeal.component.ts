import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DfaClaimMain, FileCategoryAppeal, FileCategoryClaim, FileUploadClaimAppeal, RequiredDocumentTypeClaim } from 'src/app/core/api/models';
import { CoreModule } from 'src/app/core/core.module';
import { DFAClaimMainDataService } from 'src/app/feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { InvoiceExtended } from '../claim-decision/claim-decision.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FixedCurrencyPipe } from 'src/app/core/pipe/fixedCurrency.pipe';
import InvoiceComponent from '../../forms/dfa-claim-main-forms/invoice/invoice.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { CancelConfirmationDialogComponent } from 'src/app/core/components/dialog-components/dfa-cancel-confirmation-dialog/dfa-cancel-confirmation-dialog.component';
import { AttachmentService, ClaimAppealService } from 'src/app/core/api/services';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { mapTo, Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAClaimAppealDataService } from 'src/app/feature-components/appeal-main/appeal-data.service';
import { FileUploadWarningDialogComponent } from 'src/app/core/components/dialog-components/file-upload-warning-dialog/file-upload-warning-dialog.component';
import { DfaAttachmentComponent } from 'src/app/core/components/dfa-attachment/dfa-attachment.component';
import { DFAFileDeleteDialogComponent } from 'src/app/core/components/dialog-components/dfa-file-delete-dialog/dfa-file-delete.component';

type TableRow =
  | { type: 'invoice'; data: InvoiceExtended }
  | { type: 'appealReason'; data: InvoiceExtended };

@Component({
  selector: 'app-claim-appeal',
  standalone: true,
  providers: [DfaAttachmentComponent],
  imports: [CoreModule, MatCardModule, MatTableModule, CommonModule, MatDialogModule, MatCheckboxModule, FixedCurrencyPipe, ReactiveFormsModule, FormsModule, MatStepperModule],
  templateUrl: './claim-appeal.component.html',
  styleUrl: './claim-appeal.component.scss'
})
export class ClaimAppealComponent implements OnInit {
  claimMain: DfaClaimMain | null = null;

  claimDocumentSummaryColumnsToDisplay = ['appealCheckbox', 'invoiceNumber', 'vendorName', 'invoiceDate', 'invoiceAmount', 'approvedAmount', 'paidAmount', 'appealAdjustment', 'viewInvoice'];
  appealReasonColumnsToDisplay = ['appealReasonCheckboxPlaceholder', 'appealReason'];
  claimDocumentSummaryDataSource = new MatTableDataSource<TableRow>();
  selection = new SelectionModel<InvoiceExtended>(true, []);
  selectedStepIndex: number = 4;

  attachmentComponent: DfaAttachmentComponent;
  formCreationService: FormCreationService;
  fileUploadForm: UntypedFormGroup;
  fileUploadForm$: Subscription;
  supportingDocumentsForm: UntypedFormGroup;
  supportingDocumentsForm$: Subscription;
  showSupportingFileForm: boolean = false;
  supportingFilesDataSource = new MatTableDataSource();
  claimAppealDocumentSummaryColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate']
  claimAppealDocumentSummaryDataSource = new MatTableDataSource();
  isLoading: boolean = false;
  isdisabled: string = 'false';
  isReadOnly: boolean = false;
  isformUploaddisabled: string = 'false';
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
  FileCategories = FileCategoryAppeal;
  RequiredDocumentTypes = RequiredDocumentTypeClaim;
  showOtherDocuments: boolean = false;
  vieworedit: string = "";
  appealId: string;

  constructor(
    attachmentComponent: DfaAttachmentComponent,
    private route: ActivatedRoute,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public dfaClaimMainDataService: DFAClaimMainDataService,
    public dfaClaimAppealDataService: DFAClaimAppealDataService,
    private attachmentService: AttachmentService,
    private router: Router,
    public dialog: MatDialog,
    public claimAppealService: ClaimAppealService,
    private _snackBar: MatSnackBar
  ) {
    this.attachmentComponent = attachmentComponent;

    this.formCreationService = attachmentComponent.formCreationService;

    this.vieworedit = this.dfaClaimAppealDataService.getViewOrEdit();

    this.dfaClaimAppealDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.vieworedit = vieworedit;
    });

    this.dfaClaimAppealDataService.changeDisableFileUpload.subscribe((isdisabled) => {
      this.isformUploaddisabled = isdisabled;
    });

    this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
      if (application) {
      }
    });

    this.isReadOnly = (dfaClaimAppealDataService.getViewOrEdit() === 'view'
      || dfaClaimAppealDataService.getViewOrEdit() === 'edit'
      || dfaClaimAppealDataService.getViewOrEdit() === 'viewOnly');

    this.dfaClaimAppealDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
        || vieworedit === 'edit'
        || vieworedit === 'viewOnly');
    })
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => this.appealId = params['appealId']);

    if(this.appealId) {
      this.dfaClaimAppealDataService.setAppealId(this.appealId);
      this.getFileUploadsForClaimAppeal(this.appealId);
    }

    let claimId = this.dfaClaimMainDataService.getClaimId();
    
    if (claimId) {
      this.dfaClaimMainDataService.setClaimId(claimId);
    }

    this.supportingDocumentsForm$ = this.attachmentComponent.formCreationService
      .getSupportingDocumentsForm()
      .subscribe((supportingDocuments) => {
        this.supportingDocumentsForm = supportingDocuments;
        this.supportingDocumentsForm.get('hasCopyOfARentalAgreementOrLease').setValue(false);
      });

    //this.formCreationService.clearClaimAppealFileUploadsData();

    this.fileUploadForm$ = this.attachmentComponent.formCreationService
      .getClaimAppealFileUploadsForm()
      .subscribe((fileUploads) => {
        this.fileUploadForm = fileUploads;
      });

    // subscribe to changes for document summary
    const _claimAppealDocumentSummaryFormArray = this.attachmentComponent.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads');
    _claimAppealDocumentSummaryFormArray.valueChanges
      .pipe(
        mapTo(_claimAppealDocumentSummaryFormArray.getRawValue())
    ).subscribe(
      _data =>  {
        this.claimAppealDocumentSummaryDataSource.data = _claimAppealDocumentSummaryFormArray.getRawValue()?.filter(x => x.deleteFlag == false)
    });

    if (this.dfaClaimAppealDataService.getViewOrEdit() == 'viewOnly') {
      this.supportingDocumentsForm.disable();
      this.fileUploadForm.disable();
    }

    if (!this.isReadOnly) {
      this.claimAppealDocumentSummaryColumnsToDisplay.push('icons');
    }

    this.claimMain = this.dfaClaimMainDataService.getDFAProjectMain() ?? null;
    const invoices = this.dfaClaimMainDataService.getClaimInvoices() ?? [];

    // Union invoice data + 'appealReason'
    const interleavedRows: TableRow[] = invoices.reduce<TableRow[]>((acc, invoice) => {
      acc.push({ type: 'invoice', data: invoice });
      acc.push({ type: 'appealReason', data: invoice });
      return acc;
    }, []);

    this.claimDocumentSummaryDataSource.data = interleavedRows.filter(
      row => !(row.type === 'appealReason' && row.data.emcrDecision === 'Approved Total')
    );
  }

  public getFileUploadsForClaimAppeal(appealId: string) {

    this.attachmentService.attachmentGetClaimAppealAttachments({claimAppealId: this.appealId}).subscribe({
      next: (attachments) => {
        // Filter out soft-deleted files
        const activeAttachments = attachments.filter(attachment => !attachment.deleteFlag);

        // Transform AppealFileMetadataUpload to FileUploadClaimAppeal
        const transformedAttachments = activeAttachments.map(attachment => ({
          id: attachment.id,
          fileName: attachment.fileName,
          fileDescription: attachment.fileDescription,
          fileType: attachment.fileType,
          fileTypeText: attachment.fileTypeText?.toString() || 'Appeal',
          contentType: attachment.contentType,
          fileSize: attachment.fileSize,
          uploadedDate: attachment.uploadedDate,
          appealId: attachment.appealId,
          deleteFlag: attachment.deleteFlag || false,
          fileData: null,
          modifiedBy: null,
          requiredDocumentType: null
        }));

        // initialize list of file uploads
        this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').setValue(transformedAttachments);

      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }
  
  saveSupportingFiles(fileUpload: FileUploadClaimAppeal): void {
      // dont allow same filename twice
      let fileUploads = this.attachmentComponent.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').value;
      if (fileUploads?.find(x => x.fileName === fileUpload.fileName && x.deleteFlag !== true)) {
        this.warningDialog("A file with the name " + fileUpload.fileName + " has already been uploaded.");
        this.attachmentComponent.formCreationService.fileUploadsClaimAppealForm.value.get('supportingFilesFileUpload').reset();
        return;
      }

    if (this.fileUploadForm.get('supportingFilesFileUpload').status === 'VALID') {
      this.isLoading = true;
      fileUpload.fileData = fileUpload?.fileData?.substring(fileUpload?.fileData?.indexOf(',') + 1) // to allow upload as byte array
      fileUpload.appealId = this.dfaClaimAppealDataService.getAppealId();
      fileUpload.requiredDocumentType = null;
      this.isLoading = true;

      this.attachmentService.attachmentUpsertDeleteClaimAppealAttachment({ body: fileUpload }).subscribe({
        next: (fileUploadId) => {
          fileUpload.id = fileUploadId;
          if (fileUploads) fileUploads.push(fileUpload);
          else fileUploads = [ fileUpload ];
          this.attachmentComponent.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').setValue(fileUploads);
          this.showSupportingFileForm = !this.showSupportingFileForm;
          // Reset Form feilds
          this.attachmentComponent.formCreationService.fileUploadsClaimAppealForm.value.get('supportingFilesFileUpload').reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      this.fileUploadForm.get('supportingFilesFileUpload').markAllAsTouched();
    }
  }

  cancelSupportingFiles(): void {
    this.showSupportingFileForm = !this.showSupportingFileForm;
    this.fileUploadForm.get('addNewFileUploadIndicator').setValue(false);
  }

  confirmDeleteDocumentSummaryRow(element): void {
    this.dialog
      .open(DFAFileDeleteDialogComponent, {
        data: {
          content: "Are you sure you want to delete the supporting document:<br/>" + element.fileName + "?"
        },
        width: '350px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.deleteDocumentSummaryRow(element);
        }
      });
  }

  warningDialog(message: string) {
    this.dialog
      .open(FileUploadWarningDialogComponent, {
        data: {
          content: message
        },
        width: '350px',
        disableClose: true
      });
  }

  deleteDocumentSummaryRow(element): void {
    // For the new S3 service, we use soft delete by setting deleteFlag to true
    if (element.id) {
      // Create payload for soft delete by setting deleteFlag to true
      const softDeletePayload: FileUploadClaimAppeal = {
        id: element.id,
        appealId: this.dfaClaimAppealDataService.getAppealId(),
        fileName: element.fileName,
        fileDescription: element.description,
        fileData: null, // No file data needed for soft delete
        fileSize: element.size,
        contentType: element.contentType || element.mimeType,
        uploadedDate: element.uploadedDate,
        deleteFlag: true, // Mark as deleted
        fileType: element.category
      };

      this.attachmentService.attachmentUpsertDeleteClaimAppealAttachment({ body: softDeletePayload }).subscribe({
        next: (result) => {
          // Remove from local array after successful soft delete
          let fileUploads = this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').value;
          let index = fileUploads?.indexOf(element);
          if (index > -1) {
            fileUploads.splice(index, 1);
            this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').setValue(fileUploads);
          }
          if (this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').value.length === 0) {
            this.fileUploadForm
              .get('addNewFileUploadIndicator')
              .setValue(false);
          }
        },
        error: (error) => {
          console.error('Error soft deleting amendment attachment:', error);
          this.warningDialog('Failed to delete the document. Please try again.');
        }
      });
    } else {
      // If no ID, just remove from local array (file wasn't saved yet)
      let fileUploads = this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').value;
      let index = fileUploads?.indexOf(element);
      if (index > -1) {
        fileUploads.splice(index, 1);
        this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').setValue(fileUploads);
      }
      if (this.formCreationService.fileUploadsClaimAppealForm.value.get('fileUploads').value.length === 0) {
        this.fileUploadForm
          .get('addNewFileUploadIndicator')
          .setValue(false);
      }
    }
  }

  BackToDashboard() {
    const projId = this.dfaClaimMainDataService.getProjectId();
    this.router.navigate(['/dfa-project/' + projId + '/claims']);
  }

  getYesNoNotSet(value: boolean | null | undefined): string {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'Not Set';
  }

  isInvoiceRow = (_: number, row: TableRow): boolean => row.type === 'invoice';
  isAppealReasonRow = (_: number, row: TableRow): boolean => row.type === 'appealReason';

  // highlight row and remove hair line between the invoice and appeal reason row
  getRowClass(row: TableRow, index: number): string {
    const isInvoice = row.type === 'invoice';
    const next = this.claimDocumentSummaryDataSource.data[index + 1];
    const isNextAppeal = next?.type === 'appealReason';
    const isSelected = this.selection.isSelected(row.data);
    const isDisabled = row.data.emcrDecision === 'Approved Total';
    const classes = [];

    if (isInvoice) {
      classes.push('invoice-row');
      if (isNextAppeal) {
        classes.push('no-border');
      }
    }

    if (isSelected) {
      classes.push('selected-row');
    }
    if (isDisabled) {
      classes.push('disabled-row');
    }

    return classes.join(' ');
  }

  reasonTouchedMap: { [invoiceId: string]: boolean } = {};

  onAppealCheckboxChange(invoice: InvoiceExtended): void {
    this.selection.toggle(invoice);

    if (this.selection.isSelected(invoice)) {
      this.reasonTouchedMap[invoice.invoiceId] = true;
    } else {
      this.reasonTouchedMap[invoice.invoiceId] = false;
    }
  }

  isAppealFormValid(): boolean {
    const selectedRows = this.selection.selected;

    if (!selectedRows.length) {
      return false;
    }

    return selectedRows.every(row => !!row.appealReason?.trim());
  }

  submitAppeal(): void {
    const invalidRows = this.claimDocumentSummaryDataSource.data
      .filter(row => this.selection.isSelected(row.data) && !row.data.appealReason?.trim());

    const selectedInvoices = this.selection.selected;

    if (!selectedInvoices.length) return; // safe but silent

    console.log('Submitting appeal for selected invoices:', selectedInvoices);

    // call a service method to submit these

    this.claimAppealService.claimAppealCreateInvoiceAppeal({
      body: selectedInvoices.map(invoice => ({
        claimAppealId: this.route.snapshot.params['appealId'],
        invoiceDecisionComments: invoice.appealReason,
        originInvoiceId: invoice.invoiceId
      }))
    }).subscribe({
      next: (response) => {
        console.log('Appeal submitted successfully:', response);
         // Show success snackbar
         this._snackBar.open(
          'Appeal submitted successfully!',
          'Close',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000
          }
        );
       // this.router.navigate(['/app-claim-decision/' + this.dfaClaimMainDataService.getClaimId()]);
        const projId = this.dfaClaimMainDataService.getProjectId();
        this.router.navigate(['/dfa-project/' + projId + '/claims']);
      },
      error: (error) => {
        console.error('Error submitting appeal:', error);
        // Handle error appropriately, e.g., show a notification
      }
    });

  }

  viewInvoiceRow(element, index): void {
    this.openInvoiceViewPopup(element, index);
  }

  openInvoiceViewPopup(objInvoice, _index): void {
    if (objInvoice && objInvoice.invoiceId) {
      this.dfaClaimMainDataService.setInvoiceId(objInvoice.invoiceId);
      delete (objInvoice as any).invoiceId;
    } else {
      this.dfaClaimMainDataService.setInvoiceId(null);
    }

    this.dialog
      .open(InvoiceComponent, {
        data: {
          content: objInvoice,
          invoiceId: this.dfaClaimMainDataService.getInvoiceId(),
          claimDecision: this.dfaClaimMainDataService.getClaimDecision(),
          header: 'View'
        },
        maxHeight: '90vh',
        width: '1200px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((_result) => { });
  }

  cancelAppeal(): void {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: {
        title: 'Cancel Appeal',
        subtitle: 'Are you sure you want to cancel your appeal?',
        text: "Appeals must be created and submitted in the same session.\nDrafts are not saved - any changes you've made will be lost.",
        cancelButton: 'No, go back',
        confirmButton: 'Yes, cancel appeal',
        showCloseIcon: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.selection.clear();
        this.claimDocumentSummaryDataSource.data.forEach(row => {
          if (row.data?.appealReason !== undefined) {
            row.data.appealReason = '';
          }
        });

        const claimId = this.dfaClaimMainDataService.getClaimId();
        this.router.navigate(['/app-claim-decision/' + claimId]);
      }
    });
  }
}

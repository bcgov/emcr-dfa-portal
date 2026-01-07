import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, distinctUntilChanged, mapTo } from 'rxjs';
import { FileUpload } from 'src/app/core/api/models';
import { CaptchaResponse } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { Invoice } from '../../core/model/dfa-invoice.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAApplicationMainDataService } from '../dfa-application-main/dfa-application-main-data.service';

@Component({
  selector: 'app-review-claim',
  standalone: false,
  templateUrl: './review-claim.component.html',
  styleUrls: ['./review-claim.component.scss']
})
export class ReviewClaimComponent implements OnInit {
  @Output() captchaPassed = new EventEmitter<CaptchaResponse>();
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;
  @Input() allowEdit: boolean;
  @Output() stepToNavigate = new EventEmitter<number>();
  componentToLoad: Observable<any>;
  cs: any;
  siteKey: string;
  supportingDocumentsDataSource = new MatTableDataSource<FileUpload>();
  supportingDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate'];
  requiredDocumentsDataSource = new MatTableDataSource<FileUpload>();
  requiredDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileTypeText', 'uploadedDate'];
  invoiceSummaryColumnsToDisplay = ['invoiceNumber', 'vendorName', 'invoiceDate', 'totalBeingClaimed'];
  invoiceSummaryDataSource = new MatTableDataSource<Invoice>();
  hideCard = false;
  navigationExtras: NavigationExtras;
  recoveryPlanFormAbstract: [];

  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService
  ) {}

  ngOnInit(): void {
    this.navigationExtras = { state: { parentPageName: this.parentPageName } };

    const recoveryClaimForm = this.formCreationService.recoveryClaimForm.value;
    this.recoveryPlanFormAbstract = recoveryClaimForm.getRawValue();

    // subscribe to changes in claim invoices fields
    recoveryClaimForm.valueChanges
      .pipe(mapTo(recoveryClaimForm.getRawValue()))
      .subscribe((data) => (this.recoveryPlanFormAbstract = recoveryClaimForm.getRawValue()));

    // subscribe to changes in invoices
    const _invoiceFormArray = this.formCreationService.recoveryClaimForm.value.get('invoices');
    this.invoiceSummaryDataSource.data = _invoiceFormArray.getRawValue();
    _invoiceFormArray.valueChanges.pipe(distinctUntilChanged()).subscribe((data: Invoice[]) => {
      this.invoiceSummaryDataSource.data = data;
    });

    // subscribe to changes in file uploads
    const _fileUploadsFormArray = this.formCreationService.fileUploadsClaimForm.value.get('fileUploads');
    _fileUploadsFormArray.valueChanges.pipe(mapTo(_fileUploadsFormArray.value)).subscribe((data) => {
      this.supportingDocumentsDataSource.data = _fileUploadsFormArray.value?.filter(
        (x) =>
          (x.requiredDocumentType === null || x.requiredDocumentType === '' || x.requiredDocumentType === undefined) &&
          x.deleteFlag === false
      );
      this.requiredDocumentsDataSource.data = _fileUploadsFormArray.value?.filter(
        (x) =>
          x.requiredDocumentType !== null &&
          x.requiredDocumentType !== '' &&
          x.requiredDocumentType !== undefined &&
          x.deleteFlag === false
      );
    });
  }

  navigateToStep(stepIndex: number) {
    this.stepToNavigate.emit(stepIndex);
  }

  editDetails(componentToEdit: string): void {
    let route: string;
    //if (this.currentFlow === 'dfa-dashboard') {
    //  route = '/dfa-dashboard/edit/' + componentToEdit;
    //} else {
    //  route = '/verified-registration/edit/' + componentToEdit;
    //}
    this.router.navigate([route], this.navigationExtras);
  }

  back(): void {
    this.hideCard = false;
  }

  formatPostalCode(postalCode: string): string {
    let rtnPostalCode = postalCode;
    if (postalCode.length === 6) {
      return postalCode.substring(0, 3) + ' ' + postalCode.substring(3, 6);
    }
    return rtnPostalCode;
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaPassed.emit($event);
  }
}

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
  selector: 'app-review-amendment',
  standalone: false,
  templateUrl: './review-amendment.component.html',
  styleUrls: ['./review-amendment.component.scss']
})
export class ReviewAmendmentComponent implements OnInit {
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
  invoiceSummaryColumnsToDisplay = ['invoiceNumber', 'vendorName', 'invoiceDate', 'totalBeingAmendmented'];
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
    //if (this.currentFlow === 'verified-registration') {
    //  this.captchaPassed.emit({
    //    type: CaptchaResponseType.success
    //  });
    //}

    const projectAmendmentForm = this.formCreationService.projectAmendmentForm.value;
    this.recoveryPlanFormAbstract = projectAmendmentForm.getRawValue();

    // subscribe to changes in amendment invoices fields
    projectAmendmentForm.valueChanges
      .pipe(
        mapTo(projectAmendmentForm.getRawValue())
      ).subscribe(data => this.recoveryPlanFormAbstract = projectAmendmentForm.getRawValue());

    // subscribe to changes in invoices
    const _invoiceFormArray = this.formCreationService.projectAmendmentForm.value.get('invoices');
    this.invoiceSummaryDataSource.data = _invoiceFormArray.getRawValue();
    _invoiceFormArray.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((data) => (this.invoiceSummaryDataSource.data = data));
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

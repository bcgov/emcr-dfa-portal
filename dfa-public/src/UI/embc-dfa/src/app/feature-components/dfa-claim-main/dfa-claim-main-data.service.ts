import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { DfaClaimMain, FileUploadClaim, RecoveryClaim } from '../../core/model/dfa-claim-main.model';
import { DfaInvoiceMain, Invoice } from '../../core/model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class DFAClaimMainDataService {
  private _recoveryClaim: RecoveryClaim;
  private _invoice: Invoice;
  private _fileUploads = [];
  private _dfaClaimMain: DfaClaimMain;
  private _dfaInvoiceMain: DfaInvoiceMain;
  private _isSubmitted: boolean = false;
  private _applicationId: string;
  private _projectId: string;
  private _claimId: string;
  private _invoiceId: string = null;
  private _eligibleGST: boolean;
  private _vieworedit: string;
  private _stepselected: string;
  private _isdisabled: string;
  private _editstep: string;
  private _requiredDocuments = [];
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();
  public changeDisableFileUpload: EventEmitter<string> = new EventEmitter<string>();
  public stepSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cacheService: CacheService,
    private fileUploadsService: AttachmentService,
    private applicationService: ApplicationService
  ) {
  }

  public get invoice(): Invoice {
    return this._invoice;
  }

  public set invoice(value: Invoice) {
    this._invoice = value;
  }

  public get recoveryClaim(): RecoveryClaim {
    return this._recoveryClaim;
  }

  public set recoveryClaim(value: RecoveryClaim) {
    this._recoveryClaim = value;
  }

  public get requiredDocuments(): Array<string> {
    return this._requiredDocuments;
  }

  public set requiredDocuments(value: Array<string>) {
    this._requiredDocuments = value;
  }

  public get fileUploads(): Array<FileUploadClaim> {
    return this._fileUploads;
  }
  public set fileUploads(value: Array<FileUploadClaim>) {
    this._fileUploads = value;
  }

  public getDFAProjectMain(): DfaClaimMain {
    if (this._dfaClaimMain === null || undefined) {
      this._dfaClaimMain = JSON.parse(this.cacheService.get('dfa-claim-main'));
    }
    return this._dfaClaimMain;
  }

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }
  public set isSubmitted(value: boolean) {
    this._isSubmitted = value;
  }

  public setDFAClaimMain(dfaClaimMain: DfaClaimMain): void {
    this._dfaClaimMain = dfaClaimMain;
    this.cacheService.set('dfa-claim-main', dfaClaimMain);
  }

  public setDFAInvoiceMain(dfaInvoiceMain: DfaInvoiceMain): void {
    this._dfaInvoiceMain = dfaInvoiceMain;
    this.cacheService.set('dfa-invoice-main', dfaInvoiceMain);
  }

  public createInvoiceMain(dfaInvoiceMain: DfaInvoiceMain): void {
    this._dfaInvoiceMain = dfaInvoiceMain;
    this.cacheService.set('dfa-invoice-main', dfaInvoiceMain);
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;
  }

  public getApplicationId(): string {
    return this._applicationId;
  }

  public setProjectId(projectId: string): void {
    this._projectId = projectId;
  }

  public getProjectId(): string {
    return this._projectId;
  }

  public setClaimId(claimId: string): void {
    this._claimId = claimId;
  }

  public getClaimId(): string {
    return this._claimId;
  }

  public setInvoiceId(invoiceId: string): void {
    this._invoiceId = invoiceId;
  }

  public getInvoiceId(): string {
    return this._invoiceId;
  }

  public setEligibleGST(eligibleGST: boolean): void {
    this._eligibleGST = eligibleGST;
  }

  public getEligibleGST(): boolean {
    return this._eligibleGST;
  }

  public setViewOrEdit(vieworedit: string): void {
    this._vieworedit = vieworedit;
    this.changeViewOrEdit.emit(vieworedit);
  }
  public getViewOrEdit(): string {
    return this._vieworedit;
  }

  public setCurrentStepSelected(step: string): void {
    this._stepselected = step;
    this.stepSelected.emit(step);
  }
  public getCurrentStepSelected(): string {
    return this._stepselected;
  }

  public setDisableFileUpload(isdisabled: string): void {
    this._isdisabled = isdisabled;
    this.changeDisableFileUpload.emit(isdisabled);
  }
  public getDisableFileUpload(): string {
    return this._isdisabled;
  }

  public setEditStep(editstep: string): void {
    this._editstep = editstep;
  }
  public getEditStep(): string {
    return this._editstep;
  }

   public createDFAClaimMainDTO(): DfaClaimMain {
    return {
      id: this._claimId,
      projectId: this._projectId,
      claim: this._recoveryClaim
    };
  }

  public createDFAInvoiceDTO(): DfaInvoiceMain {
    return {
      id: this._invoiceId,
      claimId: this._claimId,
      invoice: this._invoice
    };
  }
}

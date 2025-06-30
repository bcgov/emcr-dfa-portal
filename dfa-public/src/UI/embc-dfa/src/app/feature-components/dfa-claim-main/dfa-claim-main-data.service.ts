import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { DfaClaimMain, FileUploadClaim, RecoveryClaim } from '../../core/model/dfa-claim-main.model';
import { DfaInvoiceMain, Invoice } from '../../core/model/dfa-invoice.model';
import { InvoiceExtended } from 'src/app/sharedModules/claim-dashboard-components/claim-decision/claim-decision.component';

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
  private _stage: string;
  private _claimDecision: string;
  private _requiredDocuments = [];
  private _dfaClaimInvoices: InvoiceExtended[] = [];
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();
  public changeDisableFileUpload: EventEmitter<string> = new EventEmitter<string>();
  public stepSelected: EventEmitter<string> = new EventEmitter<string>();
  public changeClaimId: EventEmitter<string> = new EventEmitter<string>();

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
    this.cacheService.set('applicationId', applicationId);
  }

  public getApplicationId(): string {
    if (this._applicationId === null || this._applicationId === undefined) {
      this._applicationId = this.cacheService.get('applicationId');
    }

    return this._applicationId;
  }

  public setProjectId(projectId: string): void {
    this._projectId = projectId;
    this.cacheService.set('projectId', projectId);
  }

  public getProjectId(): string {
    if (this._projectId === null || this._projectId === undefined) {
      this._projectId = this.cacheService.get('projectId');
    }

    return this._projectId;
  }

  public setClaimId(claimId: string): void {
    this._claimId = claimId;
    this.cacheService.set('claimId', claimId);
    this.changeClaimId.emit(claimId);
  }

  public getClaimId(): string {
    if (this._claimId === null || this._claimId === undefined) {
      this._claimId = this.cacheService.get('claimId');
    }

    return this._claimId;
  }

  public setInvoiceId(invoiceId: string): void {
    this._invoiceId = invoiceId;
    this.cacheService.set('invoiceId', invoiceId);
  }

  public getInvoiceId(): string {
    if (this._invoiceId === null || this._invoiceId === undefined) {
      this._invoiceId = this.cacheService.get('invoiceId');
    }

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
    this.cacheService.set('vieworedit', vieworedit);
  }
  public getViewOrEdit(): string {
    if (this._vieworedit === null || this._vieworedit === undefined) {
      this._vieworedit = this.cacheService.get('vieworedit');
    }

    return this._vieworedit;
  }

  public setCurrentStepSelected(step: string): void {
    this._stepselected = step;
    this.stepSelected.emit(step);
    this.cacheService.set('step', step);
  }
  public getCurrentStepSelected(): string {
    if (this._stepselected === null || this._stepselected === undefined) {
      this._stepselected = this.cacheService.get('step');
    }

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
  
  public setStage(stage: string): void {
    this._stage = stage;
  }
  public getStage(): string {
    return this._stage;
  }

  public setClaimDecision(claimDecision: string): void {
    this._claimDecision = claimDecision;
  }
  public getClaimDecision(): string {
    return this._claimDecision;
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

  public setClaimInvoices(dfaClaimInvoices: InvoiceExtended[]): void {
    this._dfaClaimInvoices = dfaClaimInvoices;
    this.cacheService.set('dfa-claim-invoices', JSON.stringify(dfaClaimInvoices));
  }

  public getClaimInvoices(): InvoiceExtended[] {
    if (this._dfaClaimInvoices === null || this._dfaClaimInvoices === undefined) {
      const cached = this.cacheService.get('dfa-claim-invoices');
      if (cached) {
        this._dfaClaimInvoices = JSON.parse(cached) as InvoiceExtended[];
      }
    }
    return this._dfaClaimInvoices;
  }
  
}

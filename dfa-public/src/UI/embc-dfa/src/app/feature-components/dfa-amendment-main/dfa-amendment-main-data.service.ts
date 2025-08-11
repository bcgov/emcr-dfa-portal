import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { DfaProjectMain, FileUpload } from '../../core/model/dfa-project-main.model';
import { ProjectAmendment } from 'src/app/core/model/dfa-amendment-main.model';
import { CurrentProjectAmendment, DfaProjectAmendmentMain } from 'src/app/core/api/models';

@Injectable({ providedIn: 'root' })
export class DFAAmendmentMainDataService {
  private _projectAmendment: ProjectAmendment;
  private _fileUploads = [];
  private _dfaAmendmentMain: DfaProjectAmendmentMain;
  private _dfaProjectMain: DfaProjectMain;
  private _isSubmitted: boolean = false;
  private _applicationId: string;
  private _projectId: string;
  private _amendmentId: string = null;
  private _invoiceId: string = null;
  private _eligibleGST: boolean;
  private _vieworedit: string;
  private _stepselected: string;
  private _isdisabled: string;
  private _editstep: string;
  private _stage: string;
  private _amendmentDecision: string;
  private _requiredDocuments = [];
  private _isNewAmendment: boolean = false; // Track if this is a newly created amendment
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();
  public changeDisableFileUpload: EventEmitter<string> = new EventEmitter<string>();
  public stepSelected: EventEmitter<string> = new EventEmitter<string>();
  public changeAmendmentId: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cacheService: CacheService,
    private fileUploadsService: AttachmentService,
    private applicationService: ApplicationService
  ) {
  }

  public get amendment(): ProjectAmendment {
    return this._projectAmendment;
  }

  public set amendment(value: ProjectAmendment) {
    this._projectAmendment = value;
  }

  public get requiredDocuments(): Array<string> {
    return this._requiredDocuments;
  }

  public set requiredDocuments(value: Array<string>) {
    this._requiredDocuments = value;
  }

  public get fileUploads(): Array<FileUpload> {
    return this._fileUploads;
  }
  public set fileUploads(value: Array<FileUpload>) {
    this._fileUploads = value;
  }

  public getDFAProjectMain(): DfaProjectMain {
    if (this._dfaAmendmentMain === null || undefined) {
      this._dfaAmendmentMain = JSON.parse(this.cacheService.get('dfa-amendment-main'));
    }
    return this._dfaAmendmentMain;
  }

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }
  public set isSubmitted(value: boolean) {
    this._isSubmitted = value;
  }

  public setDFAAmendmentMain(dfaAmendmentMain: DfaProjectAmendmentMain): void {
    this._dfaAmendmentMain = dfaAmendmentMain;
    this.cacheService.set('dfa-amendment-main', dfaAmendmentMain);
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

  public setAmendmentId(amendmentId: string): void {
    this._amendmentId = amendmentId;
    this.cacheService.set('amendmentId', amendmentId);
    this.changeAmendmentId.emit(amendmentId);
  }

  public getAmendmentId(): string {
    if (this._amendmentId === null || this._amendmentId === undefined) {
      this._amendmentId = this.cacheService.get('amendmentId');
    }

    return this._amendmentId;
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

  public setIsNewAmendment(isNew: boolean): void {
    this._isNewAmendment = isNew;
    this.cacheService.set('isNewAmendment', isNew);
  }

  public getIsNewAmendment(): boolean {
    if (this._isNewAmendment === null || this._isNewAmendment === undefined) {
      this._isNewAmendment = this.cacheService.get('isNewAmendment') === 'true';
    }

    return this._isNewAmendment;
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

  public setAmendmentDecision(amendmentDecision: string): void {
    this._amendmentDecision = amendmentDecision;
  }
  public getAmendmentDecision(): string {
    return this._amendmentDecision;
  }

   public createDFAAmendmentMainDTO(): DfaProjectAmendmentMain {
    return {
      id: this._amendmentId,
      projectId: this._projectId,
      projectAmendment: this._projectAmendment
    };
  }
}

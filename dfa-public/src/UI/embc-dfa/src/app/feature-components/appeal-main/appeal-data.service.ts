import { EventEmitter, Injectable } from '@angular/core';
import { FileUploadClaimAppeal } from 'src/app/core/api/models';
import { AppealType, DfaAppeal } from '../../core/model/dfa-appeals-main.model';
import { CacheService } from '../../core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class DFAClaimAppealDataService {
  private _fileUploads: FileUploadClaimAppeal[] = [];
  private _dfaAppeal: DfaAppeal;
  private _applicationId: string;
  private _claimId: string;
  private _appealId: string;
  private _appealType: AppealType;
  private _vieworedit: string;
  private _isdisabled: string;
  public changeAppealId: EventEmitter<string> = new EventEmitter<string>();
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();
  public changeDisableFileUpload: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private cacheService: CacheService) {}

  public get dfaAppeal(): DfaAppeal {
    return this._dfaAppeal;
  }

  public set dfaAppeal(dfaAppeal: DfaAppeal) {
    this._dfaAppeal = dfaAppeal;
  }

  public get fileUploads(): FileUploadClaimAppeal[] {
    return this._fileUploads;
  }

  public set fileUploads(supportingDocuments: FileUploadClaimAppeal[]) {
    this._fileUploads = supportingDocuments;
  }

  public setFileUploads(supportingDocuments: FileUploadClaimAppeal[]): void {
    this._fileUploads = supportingDocuments;
  }

  public get appealType(): AppealType {
    return this._appealType;
  }

  public set appealType(value: AppealType) {
    this._appealType = value;
  }

  public setAppealType(appealType: AppealType): void {
    this._appealType = appealType;
  }

  public getApplicationId(): string {
    return this._applicationId;
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;
  }

  public setClaimId(claimId: string): void {
    this._claimId = claimId;
    this.cacheService.set('claimId', claimId);
  }

  public getClaimId(): string {
    if (this._claimId === null || this._claimId === undefined) {
      this._claimId = this.cacheService.get('claimId');
    }

    return this._claimId;
  }

  public setAppealId(appealId: string): void {
    this._appealId = appealId;
    this.cacheService.set('appealId', appealId);
    this.changeAppealId.emit(appealId);
  }

  public getAppealId(): string {
    if (this._appealId === null || this._appealId === undefined) {
      this._appealId = this.cacheService.get('appealId');
    }

    return this._appealId;
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

  public setDisableFileUpload(isdisabled: string): void {
    this._isdisabled = isdisabled;
    this.changeDisableFileUpload.emit(isdisabled);
  }
  public getDisableFileUpload(): string {
    return this._isdisabled;
  }

  public clearAppealData(): void {
  }

}

import { Injectable } from '@angular/core';
import { AppealReason, DfaAppeal, SignAndSubmit } from '../../core/model/dfa-appeals-main.model';
import { CacheService } from '../../core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class DFAAppealDataService {
  private _appealReason: AppealReason;
  private _signAndSubmit: SignAndSubmit;
  private _dfaAppeal: DfaAppeal;
  private _applicationId: string;
  private _caseDetails: any;

  constructor(
    private cacheService: CacheService
  ) {}

  public setDFAAppeal(dfaAppeal: DfaAppeal): void {
    this._dfaAppeal = dfaAppeal;
    this.cacheService.set('dfa-appeal', dfaAppeal);
  }

  public get appealReason(): AppealReason {
    return this._appealReason;
  }

  public set appealReason(appealReason: AppealReason) {
    this._appealReason = appealReason;
  }

  public setAppealReason(appealReason: AppealReason): void {
    this._appealReason = appealReason;
  }

  public get signAndSubmit(): SignAndSubmit {
    return this._signAndSubmit;
  }

  public set signAndSubmit(signAndSubmit: SignAndSubmit) {
    this._signAndSubmit = signAndSubmit;
  }

  public setSignAndSubmit(signAndSubmit: SignAndSubmit): void {
    this._signAndSubmit = signAndSubmit;
  }

  public getApplicationId(): string {
    return this._applicationId;
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;
  }

  public setCaseDetails(caseDetails: any): void {
    this._caseDetails = caseDetails;
  }

  public getCaseDetails(): any {
    return this._caseDetails;
  }

  public createAppealDTO(): DfaAppeal {
    return {
      id: this._applicationId,
      caseId: this._dfaAppeal?.caseId ?? '',
      status: this._dfaAppeal?.status ?? '',
      appealReason: this._appealReason,
      signAndSubmit: this._signAndSubmit
    };
  }
}




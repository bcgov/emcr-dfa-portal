import { Injectable } from '@angular/core';
import {
  AppealReason,
  AppealStatus,
  AppealType,
  DfaAppeal,
  SignAndSubmit
} from '../../core/model/dfa-appeals-main.model';
import { CacheService } from '../../core/services/cache.service';
import { DfaApplicationMain } from 'src/app/core/api/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DFAAppealDataService {
  private _appealReason: AppealReason;
  private _signAndSubmit: SignAndSubmit;
  private _dfaAppeal: DfaAppeal;
  private _applicationId: string;
  private _caseDetails: any;
  private _fullApplication: BehaviorSubject<DfaApplicationMain> = new BehaviorSubject<DfaApplicationMain>(null);
  private _fullApplication$: Observable<DfaApplicationMain> = this._fullApplication.asObservable();
  private _appealType: AppealType;

  constructor(private cacheService: CacheService) {}

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

  public get appealType(): AppealType {
    return this._appealType;
  }
  
  public set appealType(value: AppealType) {
    this._appealType = value;
  }
  
  public setAppealType(appealType: AppealType): void {
    this._appealType = appealType;
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

  setFullApplication(app: any) {
    this._fullApplication.next(app);
  }

  getFullApplication() {
    return this._fullApplication$;
  }

  public createAppealDTO(): DfaAppeal {
    return {
      id: this._applicationId,
      caseId: this._caseDetails?.caseId ?? '',
      type: this._appealType,
      status: AppealStatus.InProgress,
      reason: this._appealReason?.reason ?? '',
      ...(this._signAndSubmit ? { signAndSubmit: this._signAndSubmit } : {}) // only include if present
    };
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppealFileUpload, DfaApplicationMain } from 'src/app/core/api/models';
import { AppealStatus, AppealType, DfaAppeal, SignAndSubmit } from '../../core/model/dfa-appeals-main.model';
import { CacheService } from '../../core/services/cache.service';

@Injectable({ providedIn: 'root' })
export class DFAAppealDataService {
  private _appealReason: string;
  private _appealSupportingDocuments: AppealFileUpload[] = [];
  private _signAndSubmit: SignAndSubmit;
  private _dfaAppeal: DfaAppeal;
  private _applicationId: string;
  private _caseDetails: any;
  private _fullApplication: BehaviorSubject<DfaApplicationMain> = new BehaviorSubject<DfaApplicationMain>(null);
  private _fullApplication$: Observable<DfaApplicationMain> = this._fullApplication.asObservable();
  private _appealType: AppealType;
  private readonly CASE_DETAILS_KEY = 'dfa-appeal-case-details';
  private readonly FULL_APPLICATION_KEY = 'dfa-appeal-full-application';

  constructor(private cacheService: CacheService) {}

  public get dfaAppeal(): DfaAppeal {
    return this._dfaAppeal;
  }

  public set dfaAppeal(dfaAppeal: DfaAppeal) {
    this._dfaAppeal = dfaAppeal;
  }

  public get appealReason(): string {
    return this._appealReason;
  }

  public set appealReason(appealReason: string) {
    this._appealReason = appealReason;
  }

  public setAppealReason(appealReason: string): void {
    this._appealReason = appealReason;
  }

  public get appealSupportingDocuments(): AppealFileUpload[] {
    return this._appealSupportingDocuments;
  }

  public set appealSupportingDocuments(supportingDocuments: AppealFileUpload[]) {
    this._appealSupportingDocuments = supportingDocuments;
  }

  public setAppealSupportingDocuments(supportingDocuments: AppealFileUpload[]): void {
    this._appealSupportingDocuments = supportingDocuments;
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
    sessionStorage.setItem(this.CASE_DETAILS_KEY, JSON.stringify(caseDetails));
  }

  public getCaseDetails(): any {
    const stored = sessionStorage.getItem(this.CASE_DETAILS_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  public setFullApplication(app: DfaApplicationMain): void {
    sessionStorage.setItem(this.FULL_APPLICATION_KEY, JSON.stringify(app));
  }

  public getFullApplication(): DfaApplicationMain | null {
    const stored = sessionStorage.getItem(this.FULL_APPLICATION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  public clearAppealData(): void {
    sessionStorage.removeItem(this.CASE_DETAILS_KEY);
    sessionStorage.removeItem(this.FULL_APPLICATION_KEY);
  }

  public createAppealDTO(): DfaAppeal {
    return {
      applicationId: this._applicationId,
      caseId: this._caseDetails?.caseId ?? '',
      type: this._appealType,
      status: AppealStatus.Received,
      reason: this._appealReason ?? '',
      ...(this._signAndSubmit ? { signAndSubmit: this._signAndSubmit } : {})
    };
  }
}

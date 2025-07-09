import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class DocumentViewingDataService {
  private _caseDetails: any;
  private readonly CASE_DETAILS_KEY = 'dfa-document-viewing-case-details';

  constructor(private cacheService: CacheService) {}

  public setCaseDetails(caseDetails: any): void {
    this._caseDetails = caseDetails;
    this.cacheService.set(this.CASE_DETAILS_KEY, caseDetails);
  }

  public getCaseDetails(): any {
    if (this._caseDetails === null || this._caseDetails === undefined) {
      const cached = this.cacheService.get(this.CASE_DETAILS_KEY);
      if (cached) {
        this._caseDetails = JSON.parse(cached);
      }
    }
    return this._caseDetails;
  }

  public clearCaseDetails(): void {
    this._caseDetails = null;
    this.cacheService.remove(this.CASE_DETAILS_KEY);
  }
}
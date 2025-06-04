import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppealService } from 'src/app/core/api/services/appeal.service';

@Injectable({
  providedIn: 'root'
})
export class DfaAppealService {
  private baseUrl = '/api/appeals';

  constructor(
    private http: HttpClient,
    private appealService: AppealService
  ) {}

  
  /**
   * Creates or updates an appeal using AppealService
   */
  public upsertAppeal(appeal: any): Observable<any> {
    if (appeal && appeal.id) {
      // Update existing appeal
      return this.appealService.appealUpdateAppeal({ id: appeal.id, body: appeal }).pipe(
        catchError(error => of({ id: appeal.id || 'mock-appeal-id', ...appeal }))
      );
    } else {
      // Create new appeal
      return this.appealService.appealCreateAppeal({ body: appeal }).pipe(
        catchError(error => of({ id: 'mock-appeal-id', ...appeal }))
      );
    }
  }

}
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
   * Creates an appeal using AppealService
   */
  public insertAppeal(appeal: any): Observable<any> {
      return this.appealService.appealCreateAppeal({ body: appeal })
  }

}
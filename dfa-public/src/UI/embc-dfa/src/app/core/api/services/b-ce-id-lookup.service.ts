/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { BCeIdBusiness } from '../models/b-ce-id-business';

@Injectable({
  providedIn: 'root',
})
export class BCeIdLookupService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation bCeIdLookupGetBCeIdSelfInfo
   */
  static readonly BCeIdLookupGetBCeIdSelfInfoPath = '/api/bceid/self';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `bCeIdLookupGetBCeIdSelfInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  bCeIdLookupGetBCeIdSelfInfo$Response(params?: {
  }): Observable<StrictHttpResponse<BCeIdBusiness>> {

    const rb = new RequestBuilder(this.rootUrl, BCeIdLookupService.BCeIdLookupGetBCeIdSelfInfoPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BCeIdBusiness>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `bCeIdLookupGetBCeIdSelfInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  bCeIdLookupGetBCeIdSelfInfo(params?: {
  }): Observable<BCeIdBusiness> {

    return this.bCeIdLookupGetBCeIdSelfInfo$Response(params).pipe(
      map((r: StrictHttpResponse<BCeIdBusiness>) => r.body as BCeIdBusiness)
    );
  }

  /**
   * Path part for operation bCeIdLookupGetBCeIdOtherInfo
   */
  static readonly BCeIdLookupGetBCeIdOtherInfoPath = '/api/bceid/other';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `bCeIdLookupGetBCeIdOtherInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  bCeIdLookupGetBCeIdOtherInfo$Response(params?: {
    userId?: string;
  }): Observable<StrictHttpResponse<BCeIdBusiness>> {

    const rb = new RequestBuilder(this.rootUrl, BCeIdLookupService.BCeIdLookupGetBCeIdOtherInfoPath, 'get');
    if (params) {
      rb.query('userId', params.userId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BCeIdBusiness>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `bCeIdLookupGetBCeIdOtherInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  bCeIdLookupGetBCeIdOtherInfo(params?: {
    userId?: string;
  }): Observable<BCeIdBusiness> {

    return this.bCeIdLookupGetBCeIdOtherInfo$Response(params).pipe(
      map((r: StrictHttpResponse<BCeIdBusiness>) => r.body as BCeIdBusiness)
    );
  }

}

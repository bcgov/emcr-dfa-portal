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

import { CurrentInvoice } from '../models/current-invoice';
import { CurrentProject } from '../models/current-project';
import { DfaClaimMain } from '../models/dfa-claim-main';
import { DfaInvoiceMain } from '../models/dfa-invoice-main';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation invoiceGetDfaInvoices
   */
  static readonly InvoiceGetDfaInvoicesPath = '/api/invoices/dfainvoices';

  /**
   * get dfa invoices.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoiceGetDfaInvoices()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetDfaInvoices$Response(params?: {

    /**
     * The claim Id.
     */
    claimId?: string;
  }): Observable<StrictHttpResponse<Array<CurrentInvoice>>> {

    const rb = new RequestBuilder(this.rootUrl, InvoiceService.InvoiceGetDfaInvoicesPath, 'get');
    if (params) {
      rb.query('claimId', params.claimId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CurrentInvoice>>;
      })
    );
  }

  /**
   * get dfa invoices.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoiceGetDfaInvoices$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetDfaInvoices(params?: {

    /**
     * The claim Id.
     */
    claimId?: string;
  }): Observable<Array<CurrentInvoice>> {

    return this.invoiceGetDfaInvoices$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CurrentInvoice>>) => r.body as Array<CurrentInvoice>)
    );
  }

  /**
   * Path part for operation invoiceUpsertInvoice
   */
  static readonly InvoiceUpsertInvoicePath = '/api/invoices/update';

  /**
   * create or update invoice.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoiceUpsertInvoice()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoiceUpsertInvoice$Response(params: {

    /**
     * The invoice information
     */
    body: DfaInvoiceMain
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, InvoiceService.InvoiceUpsertInvoicePath, 'put');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * create or update invoice.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoiceUpsertInvoice$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoiceUpsertInvoice(params: {

    /**
     * The invoice information
     */
    body: DfaInvoiceMain
  }): Observable<string> {

    return this.invoiceUpsertInvoice$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation invoiceDeleteInvoice
   */
  static readonly InvoiceDeleteInvoicePath = '/api/invoices/delete';

  /**
   * delete invoice.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoiceDeleteInvoice()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoiceDeleteInvoice$Response(params: {

    /**
     * The invoice information
     */
    body: DfaInvoiceMain
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, InvoiceService.InvoiceDeleteInvoicePath, 'put');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * delete invoice.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoiceDeleteInvoice$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  invoiceDeleteInvoice(params: {

    /**
     * The invoice information
     */
    body: DfaInvoiceMain
  }): Observable<string> {

    return this.invoiceDeleteInvoice$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation invoiceGetProjectMain
   */
  static readonly InvoiceGetProjectMainPath = '/api/invoices/appmain/byId';

  /**
   * Get project main by Id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoiceGetProjectMain()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetProjectMain$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<DfaClaimMain>> {

    const rb = new RequestBuilder(this.rootUrl, InvoiceService.InvoiceGetProjectMainPath, 'get');
    if (params) {
      rb.query('projectId', params.projectId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<DfaClaimMain>;
      })
    );
  }

  /**
   * Get project main by Id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoiceGetProjectMain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetProjectMain(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<DfaClaimMain> {

    return this.invoiceGetProjectMain$Response(params).pipe(
      map((r: StrictHttpResponse<DfaClaimMain>) => r.body as DfaClaimMain)
    );
  }

  /**
   * Path part for operation invoiceGetProjectDetailsForClaim
   */
  static readonly InvoiceGetProjectDetailsForClaimPath = '/api/invoices/dfaprojectbyID';

  /**
   * get dfa project details.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `invoiceGetProjectDetailsForClaim()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetProjectDetailsForClaim$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<CurrentProject>> {

    const rb = new RequestBuilder(this.rootUrl, InvoiceService.InvoiceGetProjectDetailsForClaimPath, 'get');
    if (params) {
      rb.query('projectId', params.projectId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CurrentProject>;
      })
    );
  }

  /**
   * get dfa project details.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `invoiceGetProjectDetailsForClaim$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  invoiceGetProjectDetailsForClaim(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<CurrentProject> {

    return this.invoiceGetProjectDetailsForClaim$Response(params).pipe(
      map((r: StrictHttpResponse<CurrentProject>) => r.body as CurrentProject)
    );
  }

}

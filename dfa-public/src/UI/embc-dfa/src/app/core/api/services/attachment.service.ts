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

import { FileUpload } from '../models/file-upload';
import { FileUploadClaim } from '../models/file-upload-claim';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation attachmentDeleteProjectAttachment
   */
  static readonly AttachmentDeleteProjectAttachmentPath = '/api/attachments';

  /**
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `attachmentDeleteProjectAttachment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentDeleteProjectAttachment$Response(params: {

    /**
     * The attachment information
     */
    body: FileUpload
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, AttachmentService.AttachmentDeleteProjectAttachmentPath, 'post');
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
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `attachmentDeleteProjectAttachment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentDeleteProjectAttachment(params: {

    /**
     * The attachment information
     */
    body: FileUpload
  }): Observable<string> {

    return this.attachmentDeleteProjectAttachment$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation attachmentUpsertDeleteProjectAttachment
   */
  static readonly AttachmentUpsertDeleteProjectAttachmentPath = '/api/attachments/projectdocument';

  /**
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `attachmentUpsertDeleteProjectAttachment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentUpsertDeleteProjectAttachment$Response(params: {

    /**
     * The attachment information
     */
    body: FileUpload
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, AttachmentService.AttachmentUpsertDeleteProjectAttachmentPath, 'post');
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
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `attachmentUpsertDeleteProjectAttachment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentUpsertDeleteProjectAttachment(params: {

    /**
     * The attachment information
     */
    body: FileUpload
  }): Observable<string> {

    return this.attachmentUpsertDeleteProjectAttachment$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation attachmentUpsertDeleteClaimAttachment
   */
  static readonly AttachmentUpsertDeleteClaimAttachmentPath = '/api/attachments/claimdocument';

  /**
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `attachmentUpsertDeleteClaimAttachment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentUpsertDeleteClaimAttachment$Response(params: {

    /**
     * The attachment information
     */
    body: FileUploadClaim
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, AttachmentService.AttachmentUpsertDeleteClaimAttachmentPath, 'post');
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
   * Create / update / delete a file attachment.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `attachmentUpsertDeleteClaimAttachment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  attachmentUpsertDeleteClaimAttachment(params: {

    /**
     * The attachment information
     */
    body: FileUploadClaim
  }): Observable<string> {

    return this.attachmentUpsertDeleteClaimAttachment$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation attachmentGetProjectAttachments
   */
  static readonly AttachmentGetProjectAttachmentsPath = '/api/attachments/byProjectIdId';

  /**
   * Get a list of attachments by project Id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `attachmentGetProjectAttachments()` instead.
   *
   * This method doesn't expect any request body.
   */
  attachmentGetProjectAttachments$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<Array<FileUpload>>> {

    const rb = new RequestBuilder(this.rootUrl, AttachmentService.AttachmentGetProjectAttachmentsPath, 'get');
    if (params) {
      rb.query('projectId', params.projectId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FileUpload>>;
      })
    );
  }

  /**
   * Get a list of attachments by project Id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `attachmentGetProjectAttachments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  attachmentGetProjectAttachments(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<Array<FileUpload>> {

    return this.attachmentGetProjectAttachments$Response(params).pipe(
      map((r: StrictHttpResponse<Array<FileUpload>>) => r.body as Array<FileUpload>)
    );
  }

  /**
   * Path part for operation attachmentGetClaimAttachments
   */
  static readonly AttachmentGetClaimAttachmentsPath = '/api/attachments/byclaimId';

  /**
   * Get a list of attachments by claim Id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `attachmentGetClaimAttachments()` instead.
   *
   * This method doesn't expect any request body.
   */
  attachmentGetClaimAttachments$Response(params?: {

    /**
     * The claim Id.
     */
    claimId?: string;
  }): Observable<StrictHttpResponse<Array<FileUploadClaim>>> {

    const rb = new RequestBuilder(this.rootUrl, AttachmentService.AttachmentGetClaimAttachmentsPath, 'get');
    if (params) {
      rb.query('claimId', params.claimId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<FileUploadClaim>>;
      })
    );
  }

  /**
   * Get a list of attachments by claim Id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `attachmentGetClaimAttachments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  attachmentGetClaimAttachments(params?: {

    /**
     * The claim Id.
     */
    claimId?: string;
  }): Observable<Array<FileUploadClaim>> {

    return this.attachmentGetClaimAttachments$Response(params).pipe(
      map((r: StrictHttpResponse<Array<FileUploadClaim>>) => r.body as Array<FileUploadClaim>)
    );
  }

}

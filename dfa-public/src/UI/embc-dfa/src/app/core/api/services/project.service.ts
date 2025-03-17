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

import { CurrentProject } from '../models/current-project';
import { CurrentProjectAmendment } from '../models/current-project-amendment';
import { DfaProjectMain } from '../models/dfa-project-main';
import { ProjectTypes } from '../models/project-types';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation projectGetDfaProjects
   */
  static readonly ProjectGetDfaProjectsPath = '/api/projects/dfaprojects';

  /**
   * get dfa applications.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectGetDfaProjects()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetDfaProjects$Response(params?: {

    /**
     * The application Id.
     */
    applicationId?: string;
  }): Observable<StrictHttpResponse<Array<CurrentProject>>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectGetDfaProjectsPath, 'get');
    if (params) {
      rb.query('applicationId', params.applicationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CurrentProject>>;
      })
    );
  }

  /**
   * get dfa applications.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `projectGetDfaProjects$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetDfaProjects(params?: {

    /**
     * The application Id.
     */
    applicationId?: string;
  }): Observable<Array<CurrentProject>> {

    return this.projectGetDfaProjects$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CurrentProject>>) => r.body as Array<CurrentProject>)
    );
  }

  /**
   * Path part for operation projectUpsertProject
   */
  static readonly ProjectUpsertProjectPath = '/api/projects/update';

  /**
   * create or update project.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectUpsertProject()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  projectUpsertProject$Response(params: {

    /**
     * The project information
     */
    body: DfaProjectMain
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectUpsertProjectPath, 'put');
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
   * create or update project.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `projectUpsertProject$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  projectUpsertProject(params: {

    /**
     * The project information
     */
    body: DfaProjectMain
  }): Observable<string> {

    return this.projectUpsertProject$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation projectGetProjectMain
   */
  static readonly ProjectGetProjectMainPath = '/api/projects/appmain/byId';

  /**
   * Get project main by Id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectGetProjectMain()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectMain$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<DfaProjectMain>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectGetProjectMainPath, 'get');
    if (params) {
      rb.query('projectId', params.projectId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<DfaProjectMain>;
      })
    );
  }

  /**
   * Get project main by Id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `projectGetProjectMain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectMain(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<DfaProjectMain> {

    return this.projectGetProjectMain$Response(params).pipe(
      map((r: StrictHttpResponse<DfaProjectMain>) => r.body as DfaProjectMain)
    );
  }

  /**
   * Path part for operation projectGetProjectDetailsForClaim
   */
  static readonly ProjectGetProjectDetailsForClaimPath = '/api/projects/dfaprojectbyID';

  /**
   * get dfa project details.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectGetProjectDetailsForClaim()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectDetailsForClaim$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<CurrentProject>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectGetProjectDetailsForClaimPath, 'get');
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
   * To access the full response (for headers, for example), `projectGetProjectDetailsForClaim$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectDetailsForClaim(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<CurrentProject> {

    return this.projectGetProjectDetailsForClaim$Response(params).pipe(
      map((r: StrictHttpResponse<CurrentProject>) => r.body as CurrentProject)
    );
  }

  /**
   * Path part for operation projectGetDfaProjectAmendments
   */
  static readonly ProjectGetDfaProjectAmendmentsPath = '/api/projects/dfaprojectamendments';

  /**
   * get dfa project amendments.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectGetDfaProjectAmendments()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetDfaProjectAmendments$Response(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<StrictHttpResponse<Array<CurrentProjectAmendment>>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectGetDfaProjectAmendmentsPath, 'get');
    if (params) {
      rb.query('projectId', params.projectId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CurrentProjectAmendment>>;
      })
    );
  }

  /**
   * get dfa project amendments.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `projectGetDfaProjectAmendments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetDfaProjectAmendments(params?: {

    /**
     * The project Id.
     */
    projectId?: string;
  }): Observable<Array<CurrentProjectAmendment>> {

    return this.projectGetDfaProjectAmendments$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CurrentProjectAmendment>>) => r.body as Array<CurrentProjectAmendment>)
    );
  }

  /**
   * Path part for operation projectGetProjectTypes
   */
  static readonly ProjectGetProjectTypesPath = '/api/projects/projecttypes';

  /**
   * Get the applicant subtype records.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `projectGetProjectTypes()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectTypes$Response(params?: {
  }): Observable<StrictHttpResponse<Array<ProjectTypes>>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.ProjectGetProjectTypesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ProjectTypes>>;
      })
    );
  }

  /**
   * Get the applicant subtype records.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `projectGetProjectTypes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  projectGetProjectTypes(params?: {
  }): Observable<Array<ProjectTypes>> {

    return this.projectGetProjectTypes$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ProjectTypes>>) => r.body as Array<ProjectTypes>)
    );
  }

}

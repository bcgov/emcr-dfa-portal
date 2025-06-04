import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { DFAApplicationStartDataService } from '../dfa-application-start/dfa-application-start-data.service';
import { CleanUpLog, DfaApplicationMain, DamagedPropertyAddress, PropertyDamage, SupportingDocuments, SignAndSubmit, FullTimeOccupant, OtherContact, SecondaryApplicant, DamagedRoom, FileUpload, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DFAClaimDataService {
  private _propertyDamage: PropertyDamage;
  private _supportingDocuments: SupportingDocuments;
  private _fileUploads = [];
  private _dfaApplicationMain: DfaApplicationMain;
  private _isSubmitted: boolean = false;
  private _applicationId: string;
  private _vieworedit: string;
  private _editstep: string;
  private _requiredDocuments = [];
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cacheService: CacheService
  ) {
  }
  public get requiredDocuments(): Array<string> {
    return this._requiredDocuments;
  }

  public set requiredDocuments(value: Array<string>) {
    this._requiredDocuments = value;
  }

  public get fileUploads(): Array<FileUpload> {
    return this._fileUploads;
  }
  public set fileUploads(value: Array<FileUpload>) {
    this._fileUploads = value;
  }

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }
  public set isSubmitted(value: boolean) {
    this._isSubmitted = value;
  }

  public setDFAApplicationMain(dfaApplicationMain: DfaApplicationMain): void {
    this._dfaApplicationMain = dfaApplicationMain;
    this.cacheService.set('dfa-application-main', dfaApplicationMain);
  }

  public get supportingDocuments(): SupportingDocuments {
    return this._supportingDocuments;
  }

  public set supportingDocuments(value: SupportingDocuments) {
    this._supportingDocuments = value;
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;

    if (applicationId) {
      //this.applicationService.applicationGetApplicationStart({ applicationId: applicationId })
      //  .subscribe({
      //    next: (application) => {
      //      this.setDfaApplicationStart(application);
      //    },
      //    error: (error) => {
      //      document.location.href = 'https://dfa.gov.bc.ca/error.html';
      //    }
      //  });
    }
  }

  public getApplicationId(): string {
    return this._applicationId;
  }

  public setViewOrEdit(vieworedit: string): void {
    this._vieworedit = vieworedit;
    this.changeViewOrEdit.emit(vieworedit);
  }
  public getViewOrEdit(): string {
    return this._vieworedit;
  }

  public setEditStep(editstep: string): void {
    this._editstep = editstep;
  }
  public getEditStep(): string {
    return this._editstep;
  }

}

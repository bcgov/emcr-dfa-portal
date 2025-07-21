import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { DfaApplicationStart,  } from 'src/app/core/api/models';
import { DFAApplicationStartDataService } from '../dfa-application-start/dfa-application-start-data.service';
import { CleanUpLog, DfaApplicationMain, DamagedPropertyAddress, PropertyDamage, SupportingDocuments, SignAndSubmit, FullTimeOccupant, OtherContact, SecondaryApplicant, DamagedRoom, FileUpload, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DFAApplicationMainDataService {
  private _damagedPropertyAddress: DamagedPropertyAddress;
  private _propertyDamage: PropertyDamage;
  private _cleanUpLog: CleanUpLog;
  private _supportingDocuments: SupportingDocuments;
  private _signAndSubmit: SignAndSubmit;
  private _fullTimeOccupants: Array<FullTimeOccupant>;
  private _otherContacts: Array<OtherContact>;
  private _secondaryApplicants: Array<SecondaryApplicant>;
  private _cleanUpLogItems: Array<CleanUpLogItem>;
  private _damagedRooms: Array<DamagedRoom>;
  private _fileUploads = [];
  private _dfaApplicationMain: DfaApplicationMain;
  private _dfaApplicationStart: BehaviorSubject<DfaApplicationStart> = new BehaviorSubject<DfaApplicationStart>(null);
  private _dfaApplicationStart$: Observable<DfaApplicationStart> = this._dfaApplicationStart.asObservable();
  private _isSubmitted: boolean = false;
  private _applicationId: string;
  private _vieworedit: string;
  private _contactonly: string;
  private _editstep: string;
  private _requiredDocuments = [];
  private _onlyOccupantInHome: boolean = false;
  private _onlyOtherContact: boolean = false;
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cacheService: CacheService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private fileUploadsService: AttachmentService,
    private applicationService: ApplicationService
  ) {
  }
  public get requiredDocuments(): Array<string> {
    return this._requiredDocuments;
  }

  public set requiredDocuments(value: Array<string>) {
    this._requiredDocuments = value;
  }

  public get fullTimeOccupants(): Array<FullTimeOccupant> {
    return this._fullTimeOccupants;
  }
  public set fullTimeOccupants(value: Array<FullTimeOccupant>) {
    this._fullTimeOccupants = value;
  }

  public get otherContacts(): Array<OtherContact> {
    return this._otherContacts;
  }
  public set otherContacts(value: Array<OtherContact>) {
    this._otherContacts = value;
  }

  public get secondaryApplicants(): Array<SecondaryApplicant> {
    return this._secondaryApplicants;
  }
  public set secondaryApplicants(value: Array<SecondaryApplicant>) {
    this._secondaryApplicants = value;
  }

  public get cleanUpLogItems(): Array<CleanUpLogItem> {
    return this._cleanUpLogItems;
  }
  public set cleanUpLogItems(value: Array<CleanUpLogItem>) {
    this._cleanUpLogItems = value;
  }

  public get damagedRooms(): Array<DamagedRoom> {
    return this._damagedRooms;
  }
  public set damagedRooms(value: Array<DamagedRoom>) {
    this._damagedRooms = value;
  }

  public get fileUploads(): Array<FileUpload> {
    return this._fileUploads;
  }
  public set fileUploads(value: Array<FileUpload>) {
    this._fileUploads = value;
  }

  public getDFAApplicationMain(): DfaApplicationMain {
    if (this._dfaApplicationMain === null || undefined) {
      this._dfaApplicationMain = JSON.parse(this.cacheService.get('dfa-application-main'));
    }
    return this._dfaApplicationMain;
  }

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }
  public set isSubmitted(value: boolean) {
    this._isSubmitted = value;
  }

  public getDfaApplicationStart(): Observable<DfaApplicationStart> {
    return this._dfaApplicationStart$;
  }

  public setDfaApplicationStart(application: DfaApplicationStart) {
    this._dfaApplicationStart.next(application);
  }

  public setDFAApplicationMain(dfaApplicationMain: DfaApplicationMain): void {
    this.setIsOnlyOccupantInHome(dfaApplicationMain.onlyOccupantInHome);
    this.setIsOnlyOtherContact(dfaApplicationMain.onlyOtherContact);
    this._dfaApplicationMain = dfaApplicationMain;
    this.cacheService.set('dfa-application-main', dfaApplicationMain);
  }

  public get damagedPropertyAddress(): DamagedPropertyAddress {
    return this._damagedPropertyAddress;
  }

  public set damagedPropertyAddress(value: DamagedPropertyAddress) {
    this._damagedPropertyAddress = value;
  }

  public get supportingDocuments(): SupportingDocuments {
    return this._supportingDocuments;
  }

  public set supportingDocuments(value: SupportingDocuments) {
    this._supportingDocuments = value;
  }

  public get signAndSubmit(): SignAndSubmit {
    return this._signAndSubmit;
  }

  public set signAndSubmit(value: SignAndSubmit) {
    this._signAndSubmit = value;
  }

  public get propertyDamage(): PropertyDamage {
    return this._propertyDamage;
  }

  public set propertyDamage(value: PropertyDamage) {
    this._propertyDamage = value;
  }

  public get cleanUpLog(): CleanUpLog {
    return this._cleanUpLog;
  }

  public set cleanUpLog(value: CleanUpLog) {
    this._cleanUpLog = value;
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;
    this.applicationService.applicationGetApplicationStart({ applicationId: applicationId })
      .subscribe({
        next: (application) => {
          this.setDfaApplicationStart(application);
        },
        error: (error) => {
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
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

  public setContactOnlyView(contactonly: string): void {
    this._contactonly = contactonly;
    this.changeViewOrEdit.emit(contactonly);
  }
  public getContactOnlyView(): string {
    return this._contactonly;
  }

  public setEditStep(editstep: string): void {
    this._editstep = editstep;
  }
  public getEditStep(): string {
    return this._editstep;
  }

  public getIsOnlyOccupantInHome(): boolean {
    return this._onlyOccupantInHome;
  }
  public setIsOnlyOccupantInHome(value: boolean): void {
    this._onlyOccupantInHome = value;
  }

  public getIsOnlyOtherContact(): boolean {
    return this._onlyOtherContact;
  }

  public setIsOnlyOtherContact(value: boolean): void {
    this._onlyOtherContact = value;
  }

  public createDFAApplicationMainDTO(): DfaApplicationMain {
    return {
      id: this._applicationId,
      cleanUpLog: this.cleanUpLog,
      damagedPropertyAddress: this._damagedPropertyAddress,
      propertyDamage: this._propertyDamage,
      supportingDocuments: this._supportingDocuments,
      signAndSubmit: this._signAndSubmit,
      deleteFlag: false,
      onlyOccupantInHome: this._onlyOccupantInHome,
      onlyOtherContact: this._onlyOtherContact,
    };
  }

  public resetApplicationState(): void {
    this._onlyOtherContact = false;
    this._onlyOccupantInHome = false;
    this._dfaApplicationMain = null;
    this._fullTimeOccupants = [];
    this._otherContacts = [];
    this._secondaryApplicants = [];
    this._cleanUpLogItems = [];
    this._damagedRooms = [];
    this._fileUploads = [];
    this._requiredDocuments = [];
    this._isSubmitted = false;
  
    this.cacheService.remove('dfa-application-main');
  }

  public loadApplicationById(applicationId: string): Observable<DfaApplicationStart> {
    return this.applicationService.applicationGetApplicationMain({ applicationId }).pipe(
      tap((application: DfaApplicationMain) => {
        this.setDFAApplicationMain(application);
      }),
      map(app => app) // keep the original response
    );
  }
}

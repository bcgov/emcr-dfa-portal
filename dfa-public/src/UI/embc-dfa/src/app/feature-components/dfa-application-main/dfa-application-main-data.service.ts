import { EventEmitter, Injectable } from '@angular/core';
import { CacheService } from 'src/app/core/services/cache.service';
import { DfaApplicationStart, ApplicationContacts } from 'src/app/core/api/models';
import { DFAApplicationStartDataService } from '../dfa-application-start/dfa-application-start-data.service';
import { CleanUpLog, DfaApplicationMain, DamagedPropertyAddress, ApplicationDetails, Contacts, SupportingDocuments, SignAndSubmit, FullTimeOccupant, OtherContact, SecondaryApplicant, DamagedRoom, CleanUpLogItem, AuthorizedRepresentative } from 'src/app/core/model/dfa-application-main.model';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { DFAApplicationStartService } from '../dfa-application-start/dfa-application-start.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DFAApplicationMainDataService {
  private _damagedPropertyAddress: DamagedPropertyAddress;
  private _applicationDetails: ApplicationDetails;
  private _contacts: Contacts;
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
  private _loadComplete: string;
  private _editstep: string;
  private _requiredDocuments = [];
  private _business: string;
  private _doingBusinessAs: string;
  private _businessNumber: string;
  private _authorizedRepresentative: AuthorizedRepresentative;
  public changeViewOrEdit: EventEmitter<string> = new EventEmitter<string>();
  public changeAppId: EventEmitter<string> = new EventEmitter<string>();
  public isApplicationLoadComplete: EventEmitter<string> = new EventEmitter<string>();

  // 2024-10-02 EMCRI-663 waynezen; publish event for Canada Post verified message on BcAddressComponent
  public canadaPostVerified: EventEmitter<string> = new EventEmitter<string>();

  // 2024-10-11 EMCRI-809 waynezen; publish events for key validation fields on Contacts form
  public dfaApplicationMainCachedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public primaryContactValidatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public otherContactsDataChangedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public authorizedRepresentativeDataChangedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private cacheService: CacheService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
    private fileUploadsService: AttachmentService,
    private applicationService: ApplicationService,
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
    this._dfaApplicationMain = dfaApplicationMain;
    this.cacheService.set('dfa-application-main', dfaApplicationMain);
    this.dfaApplicationMainCachedEvent.emit(true);
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

  public get applicationDetails(): ApplicationDetails {
    return this._applicationDetails;
  }

  public set applicationDetails(value: ApplicationDetails) {
    this._applicationDetails = value;
  }

  // 2024-09-03 EMCRI-663 waynezen; new Contacts form
  public get contacts(): Contacts {
    return this._contacts;
  }

  public set contacts(value: Contacts) {
    this._contacts = value;
  }

  /* EMCRI-1066: Authorized Representative */
  public get authorizedRepresentative(): AuthorizedRepresentative {
    return this._authorizedRepresentative;
  }
  public set authorizedRepresentative(value: AuthorizedRepresentative) {
    this._authorizedRepresentative = value;
  }

  public get cleanUpLog(): CleanUpLog {
    return this._cleanUpLog;
  }

  public set cleanUpLog(value: CleanUpLog) {
    this._cleanUpLog = value;
  }

  public setApplicationId(applicationId: string): void {
    this._applicationId = applicationId;
    if (applicationId) {
      this.cacheService.set('applicationId', applicationId);
      this.changeAppId.emit(applicationId);
    }
    else {
      this.cacheService.remove('applicationId');
    }

    if (applicationId) {
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
  }

  public getApplicationId(): string {
    if (this._applicationId === null || this._applicationId === undefined) {
      this._applicationId = this.cacheService.get('applicationId');
    }

    return this._applicationId;
  }

  public setBusiness(busName: string): void {
    this.cacheService.set('business-number', busName);
    this._business = busName;
  }

  public getBusiness(): string {
    if (!this._business) {
      this._business = this.cacheService.get('business-number');
    }
    return this._business;
  }

  public setDoingBusinessAs(busName: string): void {
    this.cacheService.set('doingbusinessas', busName);
    this._doingBusinessAs = busName;
  }

  public getDoingBusinessAs(): string {
    if (!this._doingBusinessAs) {
      this._doingBusinessAs = this.cacheService.get('doingbusinessas');
    }
    return this._doingBusinessAs;
  }

  public setBusinessNumber(busNumber: string): void {
    this.cacheService.set('businessnumber', busNumber);
    this._businessNumber = busNumber;
  }

  public getBusinessNumber(): string {
    if (!this._businessNumber) {
      this._businessNumber = this.cacheService.get('businessnumber');
    }
    return this._businessNumber;
  }

  public setViewOrEdit(vieworedit: string): void {
    this._vieworedit = vieworedit;
    this.changeViewOrEdit.emit(vieworedit);
    this.cacheService.set('vieworedit', vieworedit);
  }

  public getViewOrEdit(): string {
    if (this._vieworedit === null || this._vieworedit === undefined) {
      this._vieworedit = this.cacheService.get('vieworedit');
    }

    return this._vieworedit;
  }

  public setApplicationLoadComplete(loadComplete: string): void {
    this._loadComplete = loadComplete;
    this.changeViewOrEdit.emit(loadComplete);
    this.cacheService.set('loadComplete', loadComplete);
  }

  public getApplicationLoadComplete(): string {
    if (this._loadComplete === null || this._loadComplete === undefined) {
      this._loadComplete = this.cacheService.get('loadComplete');
    }

    return this._loadComplete;
  }

  public setEditStep(editstep: string): void {
    this._editstep = editstep;
  }
  public getEditStep(): string {
    return this._editstep;
  }

  public setCanadaPostVerified(verifiedornot: string) : void {

    this._contacts.isDamagedAddressVerified = verifiedornot;
    this.canadaPostVerified.emit(verifiedornot);
  }

   public createDFAApplicationMainDTO(): DfaApplicationMain {

    // 2024-09-16 EMCRI-663 waynezen; assign non-homogeneous fields to Contacts form
    let primaryContact: ApplicationContacts = this._contacts;
    return {
      id: this._applicationId,
      applicationDetails: this._applicationDetails,
      applicationContacts: primaryContact,
      otherContact: this._otherContacts,
      authorizedRepresentative: this._authorizedRepresentative,
      deleteFlag: false
    };
  }
}

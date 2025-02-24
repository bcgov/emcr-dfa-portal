import { EventEmitter, Injectable } from '@angular/core';
import { FullTimeOccupant, DfaApplicationMain, OtherContact, SecondaryApplicant, AuthorizedRepresentative } from 'src/app/core/model/dfa-application-main.model';
import { DFAApplicationMainMappingService } from './dfa-application-main-mapping.service';
import { DFAApplicationMainDataService } from './dfa-application-main-data.service';
import { Observable } from 'rxjs';
import { ApplicationService } from 'src/app/core/api/services';

@Injectable({ providedIn: 'root' })
export class DFAApplicationMainService {
  private _fullTimeOccupants: Array<FullTimeOccupant> = [];
  private _otherContacts: Array<OtherContact> = [];
  private _secondaryApplicants: Array<SecondaryApplicant> = [];
  private _authorizedRepresentative: AuthorizedRepresentative;

  constructor(
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private applicationService: ApplicationService
  ) {}

  public get fullTimeOccupants(): Array<FullTimeOccupant> {
    return this._fullTimeOccupants;
  }

  public set fullTimeOccupants(value: Array<FullTimeOccupant>) {
    this._fullTimeOccupants = value;
  }

  public setFullTimeOccupants(fullTimeOccupants: Array<FullTimeOccupant>): void {
    const fullTimeOccupantsArray: Array<FullTimeOccupant> = [];
    for (const occupant of fullTimeOccupants) {
      const fullTimeOccupant: FullTimeOccupant = {
        firstName: occupant.firstName,
        lastName: occupant.lastName,
        relationship: occupant.relationship,
        id: occupant.id,
        applicationId: occupant.applicationId,
        deleteFlag: occupant.deleteFlag
      };
      fullTimeOccupantsArray.push(fullTimeOccupant);
    }
    this.dfaApplicationMainDataService.fullTimeOccupants = fullTimeOccupants;
  }

  public get otherContacts(): Array<OtherContact> {
    return this._otherContacts;
  }

  public set otherContacts(value: Array<OtherContact>) {
    this._otherContacts = value;
  }

  public setOtherContacts(otherContacts: OtherContact[]): void {
    const otherContactsArray: Array<OtherContact> = [];
    for (const contact of otherContacts) {
      const otherContact: OtherContact = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        id: contact.id,
        applicationId: contact.applicationId,
        deleteFlag: contact.deleteFlag
      };

      otherContactsArray.push(otherContact);
    }
    this.otherContacts = otherContactsArray;
    this.dfaApplicationMainDataService.otherContacts = this.otherContacts;
  }

  public get secondaryApplicants(): Array<SecondaryApplicant> {
    return this._secondaryApplicants;
  }

  public set secondaryApplicants(value: Array<SecondaryApplicant>) {
    this._secondaryApplicants = value;
  }

  public setSecondaryApplicants(contacts: SecondaryApplicant[]): void {
    const secondaryApplicantsArray: Array<SecondaryApplicant> = [];
    for (const contact of contacts) {
      const secondaryApplicant: SecondaryApplicant = {
        applicantType: contact.applicantType,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        id: contact.id,
        applicationId: contact.applicationId,
        deleteFlag: contact.deleteFlag
      };

      secondaryApplicantsArray.push(secondaryApplicant);
    }
    this.secondaryApplicants = secondaryApplicantsArray;
    this.dfaApplicationMainDataService.secondaryApplicants = this.secondaryApplicants;
  }

  /* EMCRI-1066: Authorized Representative */
  public get authorizedRepresentative(): AuthorizedRepresentative {
    return this._authorizedRepresentative;
  }

  public set authorizedRepresentative(value: AuthorizedRepresentative) {
    this._authorizedRepresentative = value;
  } 

  public setAuthorizedRepresentative(authorizedRep: AuthorizedRepresentative): void {
    const authorizedRepresentative: AuthorizedRepresentative = {
      firstName: authorizedRep.firstName,
      lastName: authorizedRep.lastName,
      email: authorizedRep.email,
      businessPhone: authorizedRep.businessPhone,
      positionTitle: authorizedRep.positionTitle,
      firstDeclaration: authorizedRep.firstDeclaration,
      secondDeclaration: authorizedRep.secondDeclaration
    };
    this.authorizedRepresentative = authorizedRepresentative;
    this.dfaApplicationMainDataService.authorizedRepresentative = this.authorizedRepresentative;
  }
  
  public upsertApplication(updatedApplication: DfaApplicationMain): Observable<string> {
    return this.applicationService.applicationUpdateApplication({ body: updatedApplication });
  }
}

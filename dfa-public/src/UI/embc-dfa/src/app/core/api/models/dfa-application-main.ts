/* tslint:disable */
/* eslint-disable */
import { ApplicationContacts } from './application-contacts';
import { ApplicationDetails } from './application-details';
import { AuthorizedRepresentative } from './authorized-representative';
import { OtherContact } from './other-contact';
import { ProfileVerification } from './profile-verification';
export interface DfaApplicationMain {
  applicationContacts?: ApplicationContacts;
  applicationDetails?: null | ApplicationDetails;
  authorizedRepresentative?: null | AuthorizedRepresentative;
  deleteFlag?: boolean;
  id?: null | string;
  notifyUser?: boolean;
  otherContact?: null | Array<OtherContact>;
  profileVerification?: null | ProfileVerification;
}

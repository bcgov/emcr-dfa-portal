/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { ContactDetails } from './contact-details';
import { PersonDetails } from './person-details';

/**
 * User's profile
 */
export interface Profile {
  bCeIDBusinessGuid?: string;
  /** @deprecated */bcServiceCardId?: null | string;
  contactDetails?: ContactDetails;
  id?: null | string;
  isMailingAddressSameAsPrimaryAddress?: string;
  isMailingAddressVerified?: null | boolean;
  lastUpdatedDateBCSC?: null | string;
  mailingAddress?: Address;
  personalDetails?: PersonDetails;
  primaryAddress?: Address;
}

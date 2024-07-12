/* tslint:disable */
/* eslint-disable */
import { StatusBar } from './status-bar';
export interface CurrentApplication {
  applicationId?: string;
  applicationType?: string;
  caseNumber?: string;
  damagedAddress?: string;
  dateFileClosed?: string;
  dateOfDamage?: string;
  eventId?: string;
  isErrorInStatus?: boolean;
  primaryApplicantSignedDate?: string;
  status?: string;
  statusBar?: Array<StatusBar>;
  statusLastUpdated?: string;
}

/* tslint:disable */
/* eslint-disable */
import { Invoice } from './invoice';
export type CurrentInvoice = Invoice & {
'applicationId'?: string;
'projectId'?: string;
'claimId'?: string;
'invoiceId'?: string;
'status'?: string;
'statusLastUpdated'?: string;
'isErrorInStatus'?: boolean;
'isHidden'?: boolean;
'statusColor'?: string;
};

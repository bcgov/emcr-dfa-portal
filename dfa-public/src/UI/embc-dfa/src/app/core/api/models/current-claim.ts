/* tslint:disable */
/* eslint-disable */
import { ClaimStatusBar } from './claim-status-bar';
export interface CurrentClaim {
  applicationId?: string;
  approvedClaimTotal?: string;
  approvedReimbursePercent?: string;
  claimId?: string;
  claimNumber?: string;
  claimTotal?: string;
  createdDate?: string;
  eligiblePayable?: string;
  finalClaim?: boolean;
  firstClaim?: boolean;
  isErrorInStatus?: boolean;
  isHidden?: boolean;
  lessFirst1000?: string;
  paidClaimAmount?: string;
  paidClaimDate?: string;
  projectId?: string;
  stage?: string;
  status?: string;
  statusBar?: Array<ClaimStatusBar>;
  statusColor?: string;
  statusLastUpdated?: string;
  submittedDate?: string;
}

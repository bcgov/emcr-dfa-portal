/* tslint:disable */
/* eslint-disable */
import { ClaimStageOptionSet } from './claim-stage-option-set';
import { Invoice } from './invoice';
export interface RecoveryClaim {
  approvedClaimTotal?: null | string;
  approvedReimbursement?: null | string;
  claimDecision?: null | string;
  claimEligibleGST?: null | string;
  claimGrossGST?: null | string;
  claimNumber?: null | string;
  claimPST?: null | string;
  claimReceivedByEMCRDate?: null | string;
  claimStatus?: null | ClaimStageOptionSet;
  claimTotal?: null | string;
  eligiblePayable?: null | string;
  invoices?: null | Array<Invoice>;
  isFirstClaimApproved?: null | boolean;
  isThisFinalClaim?: null | boolean;
  lessFirst1000?: null | string;
  paidClaimAmount?: null | string;
  paidClaimDate?: null | string;
  stage?: null | string;
  status?: null | string;
  totalActualClaim?: null | string;
  totalInvoicesBeingClaimed?: null | string;
}

/* tslint:disable */
/* eslint-disable */
import { ClaimStageOptionSet } from './claim-stage-option-set';
import { Invoice } from './invoice';
export interface RecoveryClaim {
  approvedClaimTotal?: null | string;
  approvedReimbursement?: null | string;
  claimEligibleGST?: null | string;
  claimGrossGST?: null | string;
  claimNumber?: null | string;
  claimPST?: null | string;
  claimReceivedByEMCRDate?: null | string;
  claimStatus?: null | ClaimStageOptionSet;
  claimTotal?: null | string;
  eligiblePayable?: null | string;
  firstClaimDeductible1000?: null | string;
  invoices?: null | Array<Invoice>;
  isFirstClaimApproved?: null | boolean;
  isThisFinalClaim?: null | boolean;
  paidClaimAmount?: null | string;
  paidClaimDate?: null | string;
  totalActualClaim?: null | string;
  totalInvoicesBeingClaimed?: null | string;
}

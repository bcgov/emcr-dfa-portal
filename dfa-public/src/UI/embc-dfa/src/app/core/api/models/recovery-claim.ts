/* tslint:disable */
/* eslint-disable */
import { ClaimStageOptionSet } from './claim-stage-option-set';
import { Invoice } from './invoice';
export interface RecoveryClaim {
  claimGrossGST?: null | string;
  claimNumber?: null | string;
  claimPST?: null | string;
  claimStatus?: null | ClaimStageOptionSet;
  invoices?: null | Array<Invoice>;
  isFirstClaimApproved?: null | boolean;
  isThisFinalClaim?: null | boolean;
  totalActualClaim?: null | string;
  totalInvoicesBeingClaimed?: null | string;
}

import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaClaimMain, RecoveryClaimForm } from '../../core/model/dfa-claim-main.model';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAClaimMainDataService } from './dfa-claim-main-data.service';

@Injectable({ providedIn: 'root' })
export class DFAClaimMainMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaClaimMainDataService: DFAClaimMainDataService
  ) {}

  mapDFAClaimMain(dfaClaimMain: DfaClaimMain): void {
    this.dfaClaimMainDataService.setDFAClaimMain(dfaClaimMain);
    this.setExistingDFAClaimMain(dfaClaimMain);
  }

  setExistingDFAClaimMain(dfaClaimMain: DfaClaimMain): void {
    this.setClaimDetails(dfaClaimMain);
  }

  private setClaimDetails(dfaClaimMain: DfaClaimMain): void {
    let formGroup: FormGroup<RecoveryClaimForm>;
    this.formCreationService
      .getRecoveryClaimForm()
      .pipe(first())
      .subscribe((claim: FormGroup<RecoveryClaimForm>) => {
        claim.patchValue({
          approvedClaimTotal: dfaClaimMain.claim.approvedClaimTotal,
          claimEligibleGST: dfaClaimMain.claim.claimEligibleGST,
          claimNumber: dfaClaimMain.claim.claimNumber,
          claimGrossGST: dfaClaimMain.claim.claimGrossGST,
          approvedReimbursement: dfaClaimMain.claim.approvedReimbursement,
          claimPST: dfaClaimMain.claim.claimPST,
          claimReceivedDate: dfaClaimMain.claim.claimReceivedDate,
          claimStatus: dfaClaimMain.claim.claimStatus,
          claimTotal: dfaClaimMain.claim.claimTotal,
          eligiblePayable: dfaClaimMain.claim.eligiblePayable,
          // TODO: consider removing invoices from DTO as they are handled separately and are never a part of returned DTO
          // invoices: dfaClaimMain.claim.invoices,
          lessFirst1000: dfaClaimMain.claim.lessFirst1000,
          paidClaimAmount: dfaClaimMain.claim.paidClaimAmount,
          paidClaimDate: dfaClaimMain.claim.paidClaimDate,
          totalActualClaim: dfaClaimMain.claim.totalActualClaim,
          totalInvoicesBeingClaimed: dfaClaimMain.claim.totalInvoicesBeingClaimed,
          isFirstClaimApproved: dfaClaimMain.claim.isFirstClaimApproved === true ? 'true' : (dfaClaimMain.claim.isFirstClaimApproved === false ? 'false' : null),
          isThisFinalClaim: dfaClaimMain.claim.isThisFinalClaim === true ? 'true' : (dfaClaimMain.claim.isThisFinalClaim === false ? 'false' : null),
          advancedDrawdownAmount: dfaClaimMain.claim.advancedDrawdownAmount
        });
        formGroup = claim;
      });

    this.dfaClaimMainDataService.recoveryClaim = dfaClaimMain.claim;
  }

  mapDFAInvoiceMain(dfaInvoiceMain: DfaInvoiceMain): void {
    this.dfaClaimMainDataService.setDFAInvoiceMain(dfaInvoiceMain);
    this.setExistingDFAInvoiceMain(dfaInvoiceMain);
  }

  setExistingDFAInvoiceMain(dfaInvoiceMain: DfaInvoiceMain): void {
    this.setInvoiceDetails(dfaInvoiceMain);
  }

  private setInvoiceDetails(dfaInvoiceMain: DfaInvoiceMain): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getInvoiceForm()
      .pipe(first())
      .subscribe((invoice) => {
        invoice.setValue({
          ...dfaInvoiceMain.invoice,
          pst: isNaN(dfaInvoiceMain.invoice.pst) ? null : Number(dfaInvoiceMain.invoice.pst),
          grossGST: isNaN(dfaInvoiceMain.invoice.grossGST) ? null : Number(dfaInvoiceMain.invoice.grossGST),
          netInvoiceBeingClaimed: isNaN(dfaInvoiceMain.invoice.netInvoiceBeingClaimed) ? null : Number(dfaInvoiceMain.invoice.netInvoiceBeingClaimed),
          isGoodsReceivedonInvoiceDate: dfaInvoiceMain.invoice.isGoodsReceivedonInvoiceDate === true ? 'true' : (dfaInvoiceMain.invoice.isGoodsReceivedonInvoiceDate === false ? 'false' : null),
          isClaimforPartofTotalInvoice: dfaInvoiceMain.invoice.isClaimforPartofTotalInvoice === true ? 'true' : (dfaInvoiceMain.invoice.isClaimforPartofTotalInvoice === false ? 'false' : null),
        });
        formGroup = invoice;
      });
    this.dfaClaimMainDataService.invoice = dfaInvoiceMain.invoice;
  }
}

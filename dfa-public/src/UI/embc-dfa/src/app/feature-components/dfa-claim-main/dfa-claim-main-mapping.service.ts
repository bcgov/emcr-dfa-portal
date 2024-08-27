import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaApplicationMain, FullTimeOccupant, SecondaryApplicant, OtherContact, DamagedRoom, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DfaClaimMain } from '../../core/model/dfa-claim-main.model';
import { DFAClaimMainDataService } from './dfa-claim-main-data.service';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class DFAClaimMainMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
  ) { }

  mapDFAClaimMain(dfaClaimMain: DfaClaimMain): void {
    this.dfaClaimMainDataService.setDFAClaimMain(dfaClaimMain);
    this.setExistingDFAClaimMain(dfaClaimMain);
  }

  setExistingDFAClaimMain(dfaClaimMain: DfaClaimMain): void {
    this.setClaimDetails(dfaClaimMain);
  }

  private setClaimDetails(dfaClaimMain: DfaClaimMain): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getRecoveryClaimForm()
      .pipe(first())
      .subscribe((claim) => {
        claim.setValue({
          ...dfaClaimMain.claim,
          isFirstClaimApproved: dfaClaimMain.claim.isFirstClaimApproved === true ? 'true' : (dfaClaimMain.claim.isFirstClaimApproved === false ? 'false' : null),
          isThisFinalClaim: dfaClaimMain.claim.isThisFinalClaim === true ? 'true' : (dfaClaimMain.claim.isThisFinalClaim === false ? 'false' : null),
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
          isGoodsReceivedonInvoiceDate: dfaInvoiceMain.invoice.isGoodsReceivedonInvoiceDate === true ? 'true' : (dfaInvoiceMain.invoice.isGoodsReceivedonInvoiceDate === false ? 'false' : null),
          isClaimforPartofTotalInvoice: dfaInvoiceMain.invoice.isClaimforPartofTotalInvoice === true ? 'true' : (dfaInvoiceMain.invoice.isClaimforPartofTotalInvoice === false ? 'false' : null),
        });
        formGroup = invoice;
      });
    this.dfaClaimMainDataService.invoice = dfaInvoiceMain.invoice;
  }

}

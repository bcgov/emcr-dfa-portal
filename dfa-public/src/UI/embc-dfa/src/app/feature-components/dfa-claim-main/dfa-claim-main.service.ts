import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClaimService, InvoiceService } from 'src/app/core/api/services';
import { DfaClaimMain } from '../../core/model/dfa-claim-main.model';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class DFAClaimMainService {

  constructor(
    private claimService: ClaimService,
    private invoiceService: InvoiceService
  ) {}

  public upsertClaim(updatedClaim: DfaClaimMain): Observable<string> {
    return this.claimService.claimUpsertClaim({ body: updatedClaim });
  }

  public upsertInvoice(updatedInvoice: DfaInvoiceMain): Observable<string> {
    return this.invoiceService.invoiceUpsertInvoice({ body: updatedInvoice });
  }

  public deleteInvoice(updatedInvoice: DfaInvoiceMain): Observable<string> {
    return this.invoiceService.invoiceDeleteInvoice({ body: updatedInvoice });
  }
}

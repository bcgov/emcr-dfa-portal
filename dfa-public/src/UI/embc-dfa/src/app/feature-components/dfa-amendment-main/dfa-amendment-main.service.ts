import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectAmendmentService, ProjectService } from 'src/app/core/api/services';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';
import { CurrentProjectAmendment, DfaProjectAmendmentMain } from 'src/app/core/api/models';

@Injectable({ providedIn: 'root' })
export class DFAAmendmentMainService {

  constructor(
    private projectAmendmentService: ProjectAmendmentService
  ) {}

  public upsertProjectAmendment(updatedProjectAmendment: DfaProjectAmendmentMain): Observable<string> {
    return this.projectAmendmentService.projectAmendmentUpsertProjectAmendment({ body: updatedProjectAmendment });
  }

  public deleteProjectAmendment(amendmentId: string): Observable<boolean> {
    return this.projectAmendmentService.projectAmendmentDeleteProjectAmendment({ amendmentId: amendmentId });
  }

}

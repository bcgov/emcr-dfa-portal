import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/app/core/api/services';
import { DfaAmendmentMain } from '../../core/model/dfa-amendment-main.model';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class DFAAmendmentMainService {

  constructor(
    private projectService: ProjectService
  ) {}

  public upsertAmendment(updatedAmendment: DfaAmendmentMain): Observable<string> {
    return this.projectService.projectUpsertProject({ body: updatedAmendment });
  }

}

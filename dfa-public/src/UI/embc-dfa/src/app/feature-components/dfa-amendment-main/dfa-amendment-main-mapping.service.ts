import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaApplicationMain, FullTimeOccupant, SecondaryApplicant, OtherContact, DamagedRoom, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { ProjectAmendmentForm } from '../../core/model/dfa-amendment-main.model';
import { DFAAmendmentMainDataService } from './dfa-amendment-main-data.service';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';
import { CurrentProjectAmendment } from 'src/app/core/api/models';

@Injectable({ providedIn: 'root' })
export class DFAAmendmentMainMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaAmendmentMainDataService: DFAAmendmentMainDataService,
  ) { }

  mapDFAAmendmentMain(dfaAmendment: CurrentProjectAmendment): void {
    this.dfaAmendmentMainDataService.setDFAAmendmentMain(dfaAmendment);
    this.setExistingDFAAmendmentMain(dfaAmendment);
  }

  setExistingDFAAmendmentMain(dfaAmendment: CurrentProjectAmendment): void {
    this.setAmendmentDetails(dfaAmendment);
  }

  private setAmendmentDetails(dfaAmendment: CurrentProjectAmendment): void {
    let formGroup: FormGroup<ProjectAmendmentForm>;
    this.formCreationService
      .getProjectAmendmentForm()
      .pipe(first())
      .subscribe((amendment: FormGroup<ProjectAmendmentForm>) => {
        // Convert date strings to Date objects for datepicker compatibility
        const convertToDate = (dateString: string) => {
          if (!dateString || dateString === '') return null;
          return new Date(dateString);
        };

        amendment.setValue({
          additionalProjectCostDecision: dfaAmendment.additionalProjectCostDecision,
          amended18MonthDeadline: convertToDate(dfaAmendment.amended18MonthDeadline),
          amendedProjectDeadlineDate: convertToDate(dfaAmendment.amendedProjectDeadlineDate),
          amendmentApprovedDate: convertToDate(dfaAmendment.amendmentApprovedDate),
          amendmentId: dfaAmendment.amendmentId,
          amendmentNumber: dfaAmendment.amendmentNumber,
          amendmentReason : dfaAmendment.amendmentReason,
          amendmentReceivedDate: convertToDate(dfaAmendment.amendmentReceivedDate),
          approvedAdditionalProjectCost: dfaAmendment.approvedAdditionalProjectCost,
          deadlineExtensionApproved: dfaAmendment.deadlineExtensionApproved,
          emcrDecisionComments: dfaAmendment.emcrDecisionComments,
          estimatedAdditionalProjectCost: dfaAmendment.estimatedAdditionalProjectCost,
          requested18MonthDate: convertToDate(dfaAmendment.requested18MonthDate),
          requestforAdditionalProjectCost: dfaAmendment.requestforAdditionalProjectCost,
          requestforProjectDeadlineExtention: dfaAmendment.requestforProjectDeadlineExtention,
          amendmentDecision: dfaAmendment.amendmentDecision,
          //isFirstAmendmentApproved: dfaAmendmentMain.amendment.isFirstAmendmentApproved === true ? 'true' : (dfaAmendmentMain.amendment.isFirstAmendmentApproved === false ? 'false' : null),
        });
        formGroup = amendment;
      });
      
    this.dfaAmendmentMainDataService.amendment = dfaAmendment;
  }

}

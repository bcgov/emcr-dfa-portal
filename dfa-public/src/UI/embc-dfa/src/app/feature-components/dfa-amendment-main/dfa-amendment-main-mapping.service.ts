import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaApplicationMain, FullTimeOccupant, SecondaryApplicant, OtherContact, DamagedRoom, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DfaAmendmentMain, ProjectAmendmentForm } from '../../core/model/dfa-amendment-main.model';
import { DFAAmendmentMainDataService } from './dfa-amendment-main-data.service';
import { DfaInvoiceMain } from '../../core/model/dfa-invoice.model';

@Injectable({ providedIn: 'root' })
export class DFAAmendmentMainMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaAmendmentMainDataService: DFAAmendmentMainDataService,
  ) { }

  mapDFAAmendmentMain(dfaAmendmentMain: DfaAmendmentMain): void {
    this.dfaAmendmentMainDataService.setDFAAmendmentMain(dfaAmendmentMain);
    this.setExistingDFAAmendmentMain(dfaAmendmentMain);
  }

  setExistingDFAAmendmentMain(dfaAmendmentMain: DfaAmendmentMain): void {
    this.setAmendmentDetails(dfaAmendmentMain);
  }

  private setAmendmentDetails(dfaAmendmentMain: DfaAmendmentMain): void {
    let formGroup: FormGroup<ProjectAmendmentForm>;
    this.formCreationService
      .getProjectAmendmentForm()
      .pipe(first())
      .subscribe((amendment: FormGroup<ProjectAmendmentForm>) => {
        amendment.setValue({
          additionalProjectCostDecision: dfaAmendmentMain.amendment.additionalProjectCostDecision,
          amended18MonthDeadline: dfaAmendmentMain.amendment.amended18MonthDeadline,
          amendedProjectDeadlineDate: dfaAmendmentMain.amendment.amendedProjectDeadlineDate,
          amendmentApprovedDate: dfaAmendmentMain.amendment.amendmentApprovedDate,
          amendmentId: dfaAmendmentMain.amendment.amendmentId,
          amendmentNumber: dfaAmendmentMain.amendment.amendmentNumber,
          amendmentReason : dfaAmendmentMain.amendment.amendmentReason,
          amendmentReceivedDate: dfaAmendmentMain.amendment.amendmentReceivedDate,
          approvedAdditionalProjectCost: dfaAmendmentMain.amendment.approvedAdditionalProjectCost,
          deadlineExtensionApproved: dfaAmendmentMain.amendment.deadlineExtensionApproved,
          emcrDecisionComments: dfaAmendmentMain.amendment.emcrDecisionComments,
          estimatedAdditionalProjectCost: dfaAmendmentMain.amendment.estimatedAdditionalProjectCost,
          requestforAdditionalProjectCost: dfaAmendmentMain.amendment.requestforAdditionalProjectCost,
          requestforProjectDeadlineExtention: dfaAmendmentMain.amendment.requestforProjectDeadlineExtention
          //isFirstAmendmentApproved: dfaAmendmentMain.amendment.isFirstAmendmentApproved === true ? 'true' : (dfaAmendmentMain.amendment.isFirstAmendmentApproved === false ? 'false' : null),
        });
        formGroup = amendment;
      });
      
    this.dfaAmendmentMainDataService.amendment = dfaAmendmentMain.amendment;
  }

}

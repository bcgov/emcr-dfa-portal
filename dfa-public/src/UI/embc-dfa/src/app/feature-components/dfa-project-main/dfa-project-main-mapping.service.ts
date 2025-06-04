import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaApplicationMain, FullTimeOccupant, SecondaryApplicant, OtherContact, DamagedRoom, CleanUpLogItem } from 'src/app/core/model/dfa-application-main.model';
import { DFAProjectMainDataService } from './dfa-project-main-data.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DfaProjectMain } from '../../core/model/dfa-project-main.model';
import { ProjectAmendment } from 'src/app/core/model/dfa-amendment-main.model';

@Injectable({ providedIn: 'root' })
export class DFAProjectMainMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
  ) {}

  mapDFAProjectMain(dfaProjectMain: DfaProjectMain): void {
    this.dfaProjectMainDataService.setDFAProjectMain(dfaProjectMain);
    this.setExistingDFAProjectMain(dfaProjectMain);
  }

  mapDFAProjectAmendment(dfaProjectAmendment: ProjectAmendment): void {
    this.setProjectAmendmentDetails(dfaProjectAmendment);
  }

  setExistingDFAProjectMain(dfaProjectMain: DfaProjectMain): void {
    this.setProjectDetails(dfaProjectMain);
  }

  private setProjectDetails(dfaProjectMain: DfaProjectMain): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getRecoveryPlanForm()
      .pipe(first())
      .subscribe((project) => {
        project.setValue({
          ...dfaProjectMain.project,
          isdamagedDateSameAsApplication: dfaProjectMain.project.isdamagedDateSameAsApplication === true ? 'true' : (dfaProjectMain.project.isdamagedDateSameAsApplication === false ? 'false' : null),
        });
        formGroup = project;
      });
    this.dfaProjectMainDataService.recoveryPlan = dfaProjectMain.project;
  }

  private setProjectAmendmentDetails(dfaAmendment: ProjectAmendment): void {
    let formGroup: UntypedFormGroup;
    this.formCreationService
      .getProjectAmendmentForm()
      .pipe(first())
      .subscribe((projectAmendment) => {
        projectAmendment.setValue({
          amendmentNumber: dfaAmendment.amendmentNumber,
          amendmentReceivedDate: dfaAmendment.amendmentReceivedDate,
          amendmentReason: dfaAmendment.amendmentReason,
          amendmentApprovedDate: dfaAmendment.amendmentApprovedDate,
          emcrDecisionComments: dfaAmendment.emcrDecisionComments,
          requestforProjectDeadlineExtention: dfaAmendment.requestforProjectDeadlineExtention,
          amendedProjectDeadlineDate: dfaAmendment.amendedProjectDeadlineDate,
          deadlineExtensionApproved: dfaAmendment.deadlineExtensionApproved,
          amended18MonthDeadline: dfaAmendment.amended18MonthDeadline,
          requestforAdditionalProjectCost: dfaAmendment.requestforAdditionalProjectCost,
          estimatedAdditionalProjectCost: dfaAmendment.estimatedAdditionalProjectCost,
          additionalProjectCostDecision: dfaAmendment.additionalProjectCostDecision,
          approvedAdditionalProjectCost: dfaAmendment.approvedAdditionalProjectCost,
          amendmentId: dfaAmendment.amendmentId,
        });
        formGroup = projectAmendment;
      });
    //this.dfaProjectMainDataService.recoveryPlan = dfaProjectAmendment;
  }

}

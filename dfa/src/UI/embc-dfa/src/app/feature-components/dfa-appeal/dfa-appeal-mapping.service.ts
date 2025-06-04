import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaAppeal } from 'src/app/core/model/dfa-appeals-main.model';
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAAppealDataService } from './dfa-appeal-data.service';

@Injectable({ providedIn: 'root' })
export class DFAAppealMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaAppealDataService: DFAAppealDataService,
  ) {}

  mapDFAAppeal(dfaAppeal: DfaAppeal): void {
    this.dfaAppealDataService.setDFAAppeal(dfaAppeal);
    this.setExistingDFAAppeal(dfaAppeal);
  }

  setExistingDFAAppeal(dfaAppeal: DfaAppeal): void {
    this.setAppealReasonDetails(dfaAppeal);
    this.setSignAndSubmitDetails(dfaAppeal);
  }

  private setAppealReasonDetails(dfaAppeal: DfaAppeal): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getAppealReasonForm()
      .pipe(first())
      .subscribe((appealReason) => {
        appealReason.setValue({
          ...dfaAppeal.appealReason
        });
        formGroup = appealReason;
      });
    this.dfaAppealDataService.appealReason = dfaAppeal.appealReason;
  }

  private setSignAndSubmitDetails(dfaAppeal: DfaAppeal): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getAppealSignAndSubmitForm()
      .pipe(first())
      .subscribe((signAndSubmit) => {
        signAndSubmit.setValue({
          ...dfaAppeal.signAndSubmit
        });
        formGroup = signAndSubmit;
      });
    this.dfaAppealDataService.signAndSubmit = dfaAppeal.signAndSubmit;
  }
}
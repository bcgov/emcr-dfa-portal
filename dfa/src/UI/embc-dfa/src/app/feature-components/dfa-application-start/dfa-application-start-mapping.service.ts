import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaApplicationStart } from 'src/app/core/api/models';
import { DFAApplicationStartDataService } from './dfa-application-start-data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Injectable({ providedIn: 'root' })
export class DFAApplicationStartMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaApplicationStartDataService: DFAApplicationStartDataService,
  ) {}

   private setAppTypeInsuranceDetails(dfaApplicationStart: DfaApplicationStart): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getAppTypeInsuranceForm()
      .pipe(first())
      .subscribe((appTypeInsurance) => {
        appTypeInsurance.setValue({
          ...dfaApplicationStart
        });
        formGroup = appTypeInsurance;
      });
    this.dfaApplicationStartDataService.applicantOption = dfaApplicationStart.appTypeInsurance.applicantOption;
    this.dfaApplicationStartDataService.insuranceOption = dfaApplicationStart.appTypeInsurance.insuranceOption;
    this.dfaApplicationStartDataService.smallBusinessOption = dfaApplicationStart.appTypeInsurance.smallBusinessOption;
    this.dfaApplicationStartDataService.farmOption = dfaApplicationStart.appTypeInsurance.farmOption;
  }
}

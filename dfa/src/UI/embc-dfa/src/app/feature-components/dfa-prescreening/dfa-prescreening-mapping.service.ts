import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DfaPrescreening } from 'src/app/core/model/dfa-prescreening.model';
import { DFAPrescreeningDataService } from './dfa-prescreening-data.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';

@Injectable({ providedIn: 'root' })
export class DFAAPrescreeningMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private dfaPrescreeningDataService: DFAPrescreeningDataService,
  ) {}

  mapDFAPrescreening(dfaPrescreening: DfaPrescreening): void {
    this.dfaPrescreeningDataService.dfaPrescreening = dfaPrescreening;
    this.setExistingDFAPrescreening(dfaPrescreening);
  }

  setExistingDFAPrescreening(dfaPrescreening: DfaPrescreening): void {
    this.setDFAPrescreeningDetails(dfaPrescreening);
  }

  private setDFAPrescreeningDetails(dfaPrescreening: DfaPrescreening): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getDfaPrescreeningForm()
      .pipe(first())
      .subscribe((dfaPrescreeningSub) => {
        dfaPrescreeningSub.setValue({
          ...dfaPrescreening,
          isPrimaryAndDamagedAddressSame: dfaPrescreening.isPrimaryAndDamagedAddressSame === true ? 'true' : (dfaPrescreening.isPrimaryAndDamagedAddressSame === false ? 'false' : null),
          lossesExceed1000: dfaPrescreening.lossesExceed1000 === true ? 'true' : (dfaPrescreening.lossesExceed1000 === false ? 'false' : null),
          damageCausedByDisaster: dfaPrescreening.damageCausedByDisaster === true? 'true' : (dfaPrescreening.damageCausedByDisaster === false ? 'false' : null),
        });
      });
    this.dfaPrescreeningDataService.dfaPrescreening = dfaPrescreening;
  }
}

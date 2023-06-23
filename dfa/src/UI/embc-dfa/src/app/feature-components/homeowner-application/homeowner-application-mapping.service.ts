import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HomeOwnerApplication } from 'src/app/core/model/homeowner-application.model';
import { HomeOwnerApplicationDataService } from './homeowner-application-data.service';
import { FormCreationService } from '../../core/services/formCreation.service';
import { ConflictManagementService } from '../../sharedModules/components/conflict-management/conflict-management.service';

@Injectable({ providedIn: 'root' })
export class HomeOwnerApplicationMappingService {
  constructor(
    private formCreationService: FormCreationService,
    private homeOwnerApplicationDataService: HomeOwnerApplicationDataService,
    private conflictService: ConflictManagementService,
  ) {}

  mapHomeOwnerApplication(homeOwnerApplication: HomeOwnerApplication): void {
    this.homeOwnerApplicationDataService.setHomeOwnerApplicationId(homeOwnerApplication.id);
    this.homeOwnerApplicationDataService.setHomeOwnerApplication(homeOwnerApplication);
    this.setExistingHomeOwnerApplication(homeOwnerApplication);
  }

  setExistingHomeOwnerApplication(homeOwnerApplication: HomeOwnerApplication): void {
    this.setDamagedPropertyAddressDetails(homeOwnerApplication);
  }

  private setDamagedPropertyAddressDetails(homeOwnerApplication: HomeOwnerApplication): void {
    let formGroup: UntypedFormGroup;

    this.formCreationService
      .getDamagedPropertyAddressForm()
      .pipe(first())
      .subscribe((damagedPropertyAddress) => {
        damagedPropertyAddress.setValue({
          ...homeOwnerApplication
        });
        formGroup = damagedPropertyAddress;
      });
    this.homeOwnerApplicationDataService.damagedPropertyAddress = homeOwnerApplication.damagedPropertyAddress;
  }
}
import {
  Component,
  OnInit,
  NgModule,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { FormCreationService } from '../../../../core/services/formCreation.service';
import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import * as globalConst from '../../../../core/services/globalConstants';
import {
  Country,
  LocationService
} from 'src/app/core/services/location.service';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export default class AddressComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  primaryAddressForm: UntypedFormGroup;
  primaryAddressForm$: Subscription;
  radioOption: string[] = ['Yes', 'No', 'I don\'t have a mailing address right now'];
  formBuilder: UntypedFormBuilder;
  formCreationService: FormCreationService;
  filteredOptions: Observable<Country[]>;
  mailingFilteredOptions: Observable<Country[]>;
  countries: Country[] = [];

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    private locationService: LocationService,
    private cd: ChangeDetectorRef
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
  }

  ngOnInit(): void {
    //this.countries = this.locationService.getActiveCountriesList();
    this.primaryAddressForm$ = this.formCreationService
      .getAddressForm()
      .subscribe((primaryAddress) => {
        this.primaryAddressForm = primaryAddress;
      });

    //this.filteredOptions = this.primaryAddressForm
    //  .get('address.country')
    //  .valueChanges.pipe(
    //    startWith(''),
    //    map((value) => (value ? this.filter(value) : this.countries.slice()))
    //  );

    //this.mailingFilteredOptions = this.primaryAddressForm
    //  .get('mailingAddress.country')
    //  .valueChanges.pipe(
    //    startWith(''),
    //    map((value) => (value ? this.filter(value) : this.countries.slice()))
    //  );

    //this.primaryAddressForm
    //  .get('address.country')
    //  .valueChanges.subscribe((value) => {
    //    this.primaryAddressForm
    //      .get('address.stateProvince')
    //      .updateValueAndValidity();
    //  });

    //this.primaryAddressForm
    //  .get('mailingAddress.country')
    //  .valueChanges.subscribe((value) => {
    //    this.primaryAddressForm
    //      .get('mailingAddress.stateProvince')
    //      .updateValueAndValidity();
    //  });

    //this.primaryAddressForm
    //  .get('isBcAddress')
    //  .valueChanges.subscribe((value) => {
    //    this.updateOnVisibility();
    //  });

    this.primaryAddressForm
      .get('isNewMailingAddress')
      .valueChanges.subscribe((value) => {
        this.updateOnVisibilityMailingAddress();
      });

    //this.primaryAddressForm
    //  .get('mailingAddress.addressLine2')
    //  .valueChanges.subscribe((value) => {
    //    this.updateOnVisibilityMailingAddress();
    //  });

    this.primaryAddressForm.get('address').valueChanges.subscribe((value) => {
      
      if (this.primaryAddressForm.get('isNewMailingAddress').value === 'Yes') {
        const primaryAddress = this.primaryAddressForm.getRawValue().address;
        this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  validateCountry(control: AbstractControl): boolean {
    const currentCountry = control.value;
    let invalidCountry = false;
    if (currentCountry !== null && currentCountry.name === undefined) {
      invalidCountry = !invalidCountry;
      control.setErrors({ invalidCountry: true });
    }
    return invalidCountry;
  }

  /**
   * Returns the control of the form
   */
  get primaryAddressFormControl(): { [key: string]: AbstractControl } {
    return this.primaryAddressForm.controls;
  }

  setCountryConfig(event: MatAutocompleteSelectedEvent): void {
    this.primaryAddressForm.get('address.addressLine1').reset();
    this.primaryAddressForm.get('address.addressLine2').reset();
    this.primaryAddressForm.get('address.community').reset();
    this.primaryAddressForm.get('address.stateProvince').reset();
    this.primaryAddressForm.get('address.postalCode').reset();
    this.updateOnVisibility();
  }

  setMailingCountryConfig(event: MatAutocompleteSelectedEvent): void {
    this.primaryAddressForm.get('mailingAddress.addressLine1').reset();
    this.primaryAddressForm.get('mailingAddress.addressLine2').reset();
    this.primaryAddressForm.get('mailingAddress.community').reset();
    this.primaryAddressForm.get('mailingAddress.stateProvince').reset();
    this.primaryAddressForm.get('mailingAddress.postalCode').reset();
    this.updateOnVisibility();
  }

  primaryAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm.get('address').reset();
    if (event.value === 'Yes') {
      this.primaryAddressForm
        .get('address.stateProvince')
        .setValue(globalConst.defaultProvince.name);
      this.primaryAddressForm
        .get('address.country')
        .setValue(globalConst.defaultCountry);
    }
  }

  mailingAddressChange(event: MatRadioChange): void {
    this.primaryAddressForm.get('mailingAddress').reset();
    if (event.value === 'Yes') {
      this.primaryAddressForm
        .get('mailingAddress.stateProvince')
        .setValue(globalConst.defaultProvince);
      this.primaryAddressForm
        .get('mailingAddress.country')
        .setValue(globalConst.defaultCountry);
    }
  }

  updateOnVisibility(): void {
    this.primaryAddressForm
      .get('address.addressLine1')
      .updateValueAndValidity();
    this.primaryAddressForm.get('address.community').updateValueAndValidity();
    this.primaryAddressForm
      .get('address.stateProvince')
      .updateValueAndValidity();
    this.primaryAddressForm.get('address.country').updateValueAndValidity();
    this.primaryAddressForm.get('address.postalCode').updateValueAndValidity();
  }

  updateOnVisibilityMailingAddress(): void {
    this.primaryAddressForm
      .get('mailingAddress')
      .updateValueAndValidity();
    this.primaryAddressForm
      .get('mailingAddress.addressLine1')
      .updateValueAndValidity();
    this.primaryAddressForm
      .get('mailingAddress.addressLine2')
      .updateValueAndValidity();
    this.primaryAddressForm.get('mailingAddress.community').updateValueAndValidity();
    this.primaryAddressForm
      .get('mailingAddress.stateProvince')
      .updateValueAndValidity();
    //this.primaryAddressForm.get('mailingAddress.country').updateValueAndValidity();
    this.primaryAddressForm.get('mailingAddress.postalCode').updateValueAndValidity();
  }

  sameAsPrimary(event: MatRadioChange): void {
    
    //this.updateOnVisibilityMailingAddress();
    if (event.value === 'Yes') {
      const primaryAddress = this.primaryAddressForm.getRawValue().address;
      this.primaryAddressForm.get('mailingAddress').setValue(primaryAddress);
      this.primaryAddressForm.get('mailingAddress.addressLine1').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.community').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.postalCode').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.stateProvince').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.postalCode').setValidators(null);
    } else if (event.value === 'No') {
      this.primaryAddressForm.get('mailingAddress').reset();
      this.primaryAddressForm.get('isBcMailingAddress').reset();
      this.primaryAddressForm.get('mailingAddress.addressLine1').setValidators([Validators.required]);
      this.primaryAddressForm.get('mailingAddress.community').setValidators([Validators.required]);
      this.primaryAddressForm.get('mailingAddress.postalCode').setValidators([Validators.required]);
      this.primaryAddressForm.get('mailingAddress.stateProvince').setValidators([Validators.required]);
    }
    else {
      this.primaryAddressForm.get('mailingAddress').reset();
      this.primaryAddressForm.get('isBcMailingAddress').reset();
      this.primaryAddressForm.get('mailingAddress.addressLine1').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.community').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.postalCode').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.stateProvince').setValidators(null);
      this.primaryAddressForm.get('mailingAddress.postalCode').setValidators(null);
    }

    this.updateOnVisibilityMailingAddress();
  }

  countryDisplayFn(country: Country): string {
    if (country) {
      return country.name;
    }
  }

  ngOnDestroy(): void {
    this.primaryAddressForm$.unsubscribe();
  }

  /**
   * Filters the coutry list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): Country[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.countries.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    AddressFormsModule,
    MatAutocompleteModule
  ],
  declarations: [AddressComponent]
})
class AddressModule {}

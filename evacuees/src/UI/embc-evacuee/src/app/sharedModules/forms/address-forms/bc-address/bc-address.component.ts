import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as globalConst from '../../../../core/services/globalConstants';
import { Community, LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-bc-address',
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit, AfterViewChecked {

  @Input() addressForm: FormGroup;
  filteredOptions: Observable<Community[]>;
  city: Community[] = [];
  province = [globalConst.defaultProvince];

  constructor(private locationService: LocationService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.city = this.locationService.getCommunityList();

    this.filteredOptions = this.addressForm.get('jurisdiction').valueChanges.pipe(
      startWith(''),
      map(value => value ? this.filter(value) : this.city.slice())
    );
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl; } {
    return this.addressForm.controls;
  }

  /**
   * Checks if the city value exists in the list
   */
  validateCity(): boolean {
    const currentCity = this.addressForm.get('jurisdiction').value;
    let invalidCity = false;
    if (currentCity !== null && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.addressForm.get('jurisdiction').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  // validateCity(): boolean {
  //   const currentCity = this.addressForm.get('jurisdiction').value;
  //   let invalidCity = false;
  //   if (currentCity && this.city.length > 0) {
  //    //this.city.findIndex()
  //    console.log(currentCity.name)
  //    // this.compareObjects(currentCity, )
  //     if (this.city.indexOf(currentCity) === -1) {
  //       console.log('owlman')
  //       invalidCity = !invalidCity;
  //       this.addressForm.get('jurisdiction').setErrors({ invalidCity: true });
  //     }
  //   }
  //   return invalidCity;
  // }

  compareObjects<T extends Community>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }

  /**
   * Filters the city list for autocomplete field
   * @param value : User typed value
   */
  private filter(value?: string): Community[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  /**
   * Returns the display value of autocomplete
   * @param city : Selected city object
   */
  cityDisplayFn(city: Community): string {
    if (city) { return city.name; }
  }

}

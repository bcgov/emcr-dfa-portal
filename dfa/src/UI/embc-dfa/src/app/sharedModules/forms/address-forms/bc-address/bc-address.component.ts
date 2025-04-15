import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  AfterViewChecked,
  Renderer2,
  ViewChild,
  ElementRef
} from '@angular/core';
import { UntypedFormGroup, AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, filter, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as globalConst from '../../../../core/services/globalConstants';
import {
  Community,
  LocationService
} from 'src/app/core/services/location.service';
import { ScriptService } from "../../../../core/services/scriptServices";
import { AsyncPipe } from '@angular/common';
import { AreaCommunity } from '../../../../core/api/models';
//import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { MatInputModule } from '@angular/material/input';
//import { MatFormFieldModule } from '@angular/material/form-field';

const SCRIPT_PATH = 'http://ws1.postescanada-canadapost.ca/js/addresscomplete-2.30.min.js?key=ea53-hg74-kb59-ym41';


@Component({
  selector: 'app-bc-address',
  standalone: false,
  templateUrl: './bc-address.component.html',
  styleUrls: ['./bc-address.component.scss']
})
export class BcAddressComponent implements OnInit, AfterViewChecked {
  @Input() addressForm: UntypedFormGroup;
  @Input() primaryAddressWarning: boolean;
  @Input() readOnly: boolean;
  filteredOptions: Observable<AreaCommunity[]>;
  city: AreaCommunity[] = [];
  province = [globalConst.defaultProvince];
  addressMatchResponse = '';
  @ViewChild('divAddressMatchResponse') addressRespHTML: ElementRef<HTMLDivElement>;
  myControl = new FormControl('');
  myControlAddr = new FormControl('');
  filteredAddress: Observable<string[]>;
  isCanadaPostValidated = null;
  selectedAddress = '';

  //countries: string[] = [
  //  "Afghanistan",
  //  "Albania",
  //  "Algeria",
  //  "Andorra" ];
  address: string[] = [];

  suggestions: string[] = [];

  suggest() {
    this.suggestions = this.address
      .filter(c => c.startsWith(''))
      .slice(0, 5);
  }

  constructor(
    private locationService: LocationService,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private scriptService: ScriptService
  ) { }

  ngOnInit(): void {
    this.addressMatchResponse = '';
    this.city = this.locationService.getCommunityList();
    this.myControlAddr.setValue(this.addressFormControl.addressLine1.value);
    //this.addressCompleteCanadaPost();

    //const scriptElement = this.scriptService.loadJsScript(this.renderer, SCRIPT_PATH);
    //scriptElement.onload = (obj) => {
    //  console.log('Canada post script loaded');
    //  console.log(JSON.stringify(obj));

    //  // Load the JavaScript client library.
    //  // (the init() method has been omitted for brevity)
    //  //this.gapi.load('client', init);
    //}
    //scriptElement.onerror = () => {
    //  console.log('Could not load the Google API Script!');
    //}

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (value ? this.filter(value) : this.city.slice()))
    );

    //this.filteredCountries = this.myControlAddr.valueChanges.pipe(
    //  startWith(''),
    //  map((value) => (value ? this._filter(value) : this.countries.slice()))
    //);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.address;
    return this.address.filter(option => option.toLowerCase().includes(filterValue));

  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Returns the control of the form
   */
  get addressFormControl(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

  /**
   * Checks if the city value exists in the list
   */
  validateCity(): boolean {
    const currentCity = this.addressForm.get('community').value;
    let invalidCity = false;
    if (currentCity !== null && currentCity.name === undefined) {
      invalidCity = !invalidCity;
      this.addressForm.get('community').setErrors({ invalidCity: true });
    }
    return invalidCity;
  }

  /**
   * Returns the display value of autocomplete
   *
   * @param city : Selected city object
   */
  cityDisplayFn(city: Community): string {
    if (city) {
      return city.name;
    }
  }

  compareObjects<T extends Community>(c1: T, c2: T): boolean {
    if (c1 === null || c2 === null || c1 === undefined || c2 === undefined) {
      return null;
    }
    return c1.code === c2.code;
  }

  /**
   * Filters the city list for autocomplete field
   *
   * @param value : User typed value
   */
  private filter(value?: string): AreaCommunity[] {
    if (value !== null && value !== undefined && typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.city.filter((option) =>
        option.name.toLowerCase().includes(filterValue)
      );
    }
  }

  callback2(resVal) {
    this.addressMatchResponse = resVal;
  }

  public SelectCity(optionObj, inputText): void {
    var textVal = inputText == 'input' ? optionObj.srcElement.value : optionObj.name;
    //console.log('optionObj.name: ' + optionObj.name)
    this.addressFormControl.community?.setValue(textVal);
    this.addressFormControl.city?.setValue(textVal);
  }

  public selectOption(objSelectedVal, objResponseText): void {
    this.checkCanadaPostAddressById(objSelectedVal.id, true, null);
  }

  public checkCanadaPostAddress(addr1, addr2, city, province, postCode, responseHtml): void {
    this.addressFormControl.addressLine1.setValue(addr1.value);
    if (!this.primaryAddressWarning) {
      var searchstring = ((addr1.value == null ? "" : addr1.value + " ")
        + (addr2.value == null ? "" : addr2.value + " ")
        + (city.value == null ? "" : city.value + " ")
        //+ (province.value == null ? "" : province.value + " ")
        + (postCode.value == null ? "" : postCode.value + " ")).trim();

      var inputText = ((addr1.value == null ? "" : addr1.value + " ")
        + (addr2.value == null ? "" : addr2.value + " ")
        + (city.value == null ? "" : city.value + " ")
        + (province.value == null ? "" : province.value + " ")
        + (postCode.value == null ? "" : postCode.value + " ")).trim();

      //console.log(searchstring.length + "::::" + searchstring);

      //console.log('JSON.stringify(obj): ' + JSON.stringify(addr1.value));
      var url = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Find/v2.10/json3.ws';
      var params = '';
      params += "&Key=" + encodeURIComponent('JX95-NK22-WG59-ND87');
      params += "&SearchTerm=" + encodeURIComponent(searchstring);
      params += "&LastId=" + encodeURIComponent('');
      params += "&SearchFor=" + encodeURIComponent('Everything');
      params += "&Country=" + encodeURIComponent('CAN');
      params += "&LanguagePreference=" + encodeURIComponent('EN');
      params += "&MaxSuggestions=" + encodeURIComponent('10');
      params += "&MaxResults=" + encodeURIComponent('10');
      //params += "&Origin=" + encodeURIComponent(Origin);
      //params += "&Bias=" + encodeURIComponent(Bias);
      //params += "&Filters=" + encodeURIComponent(Filters);
      //params += "&GeoFence=" + encodeURIComponent(GeoFence);

      if (searchstring != '' && searchstring.length > 5 &&
        (this.selectedAddress.replace(/ /g, '') != inputText.replace(/ /g, ''))) {
        var self = this;
        var http = new XMLHttpRequest();
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function () {

          if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            var response = JSON.parse(http.responseText);
            // Test for an error
            if (response.Items.length == 1 && typeof (response.Items[0].Error) != "undefined") {
              // Show the error message
              //alert(response.Items[0].Description);
              responseHtml = response.Items[0].Description;
            }
            else {
              // Check if there were any items found
              if (response.Items.length == 0)
                //alert("Sorry, Canada Post couldn't find a matching address");
                responseHtml = "Sorry, Canada Post couldn't find a matching address";
              else if (response.Items.length > 0) {

                self.addressMatchResponse = responseHtml;
                self.address = response.Items;
                var addrItems = [];


                self.isCanadaPostValidated = null;
                for (var i = 0; i < response.Items.length; i++) {
                  if (response.Items[i].Next != 'Find') {
                    addrItems.push({
                      name: response.Items[i].Text + ", " + response.Items[i].Description,
                      id: response.Items[i].Id
                    })

                    if (self.isCanadaPostValidated != 'true') {
                      self.checkCanadaPostAddressById(response.Items[i].Id, false, inputText);
                    }
                  }
                }

                if (self.isCanadaPostValidated != 'true') {
                  //self.myControl.setValue("");
                  //self.addressFormControl.community.setValue("");
                  //self.addressFormControl.myControl.setValue('');
                  if (self.addressMatchResponse != 'Unable to validate the address') {
                    self.myControl.setValue("");
                  }
                  //} else if (self.addressMatchResponse == 'Unable to validate the address') {
                  //  self.myControl.setValue("");
                  //}

                  self.addressFormControl.isDamagedAddressVerified.setValue('false');
                  self.isCanadaPostValidated = 'false';
                  self.addressMatchResponse = "Unable to validate the address";
                }

                self.address = addrItems;
                self.filteredAddress = self.myControlAddr.valueChanges.pipe(
                  startWith(''),
                  map((value) => (value ? self._filter(value) : self.address.slice()))
                );

              }
            }

          }
        }

        http.send(params);
      }
    }
  }

  public checkCanadaPostAddressById(IdVal, isPopulate, inputTextVal): void {

    //console.log(IdVal.length + "::::" + IdVal);

    //console.log('JSON.stringify(obj): ' + JSON.stringify(IdVal));
    var url = 'https://ws1.postescanada-canadapost.ca/AddressComplete/Interactive/Retrieve/v2.11/json3.ws';
    var params = '';
    params += "&Key=" + encodeURIComponent('JX95-NK22-WG59-ND87');
    params += "&Id=" + encodeURIComponent(IdVal);
    var self = this;
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200) {

        var response = JSON.parse(http.responseText);
        console.log('Id response: ' + http.responseText)
        // Test for an error
        if (response.Items.length == 1 && typeof (response.Items[0].Error) != "undefined") {
          // Show the error message
          alert(response.Items[0].Description);
        }
        else {
          // Check if there were any items found
          if (response.Items.length == 0)
            alert("Sorry, there were no results");
          else {
            var responeAddress = ((response.Items[0].Line1 == null ? "" : response.Items[0].Line1 + " ")
              + (response.Items[0].Line2 == null ? "" : response.Items[0].Line2 + " ")
              + (response.Items[0].City == null ? "" : response.Items[0].City + " ")
              + (response.Items[0].Province == null ? "" : response.Items[0].Province + " ")
              + (response.Items[0].PostalCode == null ? "" : response.Items[0].PostalCode + " ")).trim();

            if (isPopulate == true) {
              self.addressMatchResponse = "Validated against Canada Post";
              self.addressFormControl.addressLine1.setValue(response.Items[0].Line1);
              self.addressFormControl.addressLine2.setValue(response.Items[0].Line2);
              self.addressFormControl.community.setValue(response.Items[0].City);
              self.addressFormControl.stateProvince.setValue(response.Items[0].Province);
              self.addressFormControl.postalCode.setValue(response.Items[0].PostalCode);
              self.selectedAddress = responeAddress;
              self.addressFormControl.isDamagedAddressVerified.setValue('true');

              self.isCanadaPostValidated = 'true';
              self.addressMatchResponse = "Validated against Canada Post";
            }
            else {

              if (responeAddress.replace(/ /g, '') == inputTextVal.replace(/ /g, '') && self.isCanadaPostValidated != 'true') {
                self.isCanadaPostValidated = 'true';
                self.addressFormControl.isDamagedAddressVerified.setValue('true');
                self.addressMatchResponse = "Validated against Canada Post";
              }
              //else if (!self.isCanadaPostValidated) {
              //  self.isCanadaPostValidated = 'false';
              //  self.addressMatchResponse = "Unable to validate the address";
              //}
            }
          }
        }
      }
    }
    http.send(params);
  }


}

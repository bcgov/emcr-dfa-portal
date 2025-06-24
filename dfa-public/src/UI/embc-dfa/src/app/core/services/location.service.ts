import { Injectable } from '@angular/core';
import { forkJoin, lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommunityType, CommunityCode, Code, Address, AreaCommunity } from '../api/models';
import { ConfigurationService } from '../api/services';
import { RegAddress } from '../model/address';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';
import * as globalConst from './globalConstants';

export interface Country {
  code?: string;
  name?: string;
  isActive?: boolean;
}

export interface StateProvince {
  code?: string;
  countryCode?: string;
  name?: string;
  isActive?: boolean;
}

export interface Community {
  code?: string;
  countryCode?: string;
  districtName?: string;
  name?: string;
  stateProvinceCode?: string;
  type?: CommunityType;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private communityList: AreaCommunity[];
  private stateProvinceList: StateProvince[];
  private countriesList: Country[];
  private regionalDistricts: string[];
  private supportCategoryVal: Code[] = [];
  private supportSubCategoryVal: Code[] = [];

  constructor(
    private configService: ConfigurationService,
    private cacheService: CacheService,
    private alertService: AlertService
  ) {}

  public getCommunityList(): AreaCommunity[] {
    return this.communityList
      ? this.communityList
      : JSON.parse(this.cacheService.get('communityList'))
      ? JSON.parse(this.cacheService.get('communityList'))
      : this.getCommunities();
  }

  //public getActiveCommunityList(): Community[] {
  //  return this.getCommunityList().filter((c) => c.isActive);
  //}

  public getStateProvinceList(): StateProvince[] {
    return this.stateProvinceList
      ? this.stateProvinceList
      : JSON.parse(this.cacheService.get('stateProvinceList'))
      ? JSON.parse(this.cacheService.get('stateProvinceList'))
      : this.getStateProvinces();
  }

  public getActiveStateProvinceList(): Community[] {
    return this.getStateProvinceList().filter((sp) => sp.isActive);
  }

  public getCountriesList(): Country[] {
    return this.countriesList
      ? this.countriesList
      : JSON.parse(this.cacheService.get('countriesList'))
      ? JSON.parse(this.cacheService.get('countriesList'))
      : this.getCountries();
  }

  public getActiveCountriesList(): Community[] {
    return this.getCountriesList().filter((c) => c.isActive);
  }

  public getRegionalDistricts(): string[] {
    return this.regionalDistricts
      ? this.regionalDistricts
      : JSON.parse(this.cacheService.get('regionalDistrictsList'));
  }

  get supportCategory(): Code[] {
    // If supportCategoryVal is populated, return it
    if (this.supportCategoryVal.length > 0) {
      return this.supportCategoryVal;
    }
  
    // If cached data is available, return it after parsing
    const cachedCategory = this.cacheService.get('supportCategory');
    if (cachedCategory) {
      return JSON.parse(cachedCategory);
    }
  
    // Fetch data asynchronously if no data is available
    this.getCategoryList().subscribe((categories) => {
      this.supportCategoryVal = categories;  // Assign fetched data
      this.cacheService.set('supportCategory', JSON.stringify(categories));
    });
  
    // Return empty array while the data is being fetched
    return [];
  }

  set supportCategory(supportCategoryVal: Code[]) {
    this.supportCategoryVal = supportCategoryVal;
    this.cacheService.set('supportCategory', supportCategoryVal);
  }

  set supportSubCategory(supportSubCategoryVal: Code[]) {
    this.supportSubCategoryVal = supportSubCategoryVal;
    this.cacheService.set('supportSubCategory', supportSubCategoryVal);
  }

  get supportSubCategory(): Code[] {
    // If the supportSubCategoryVal is populated, return it
    if (this.supportSubCategoryVal.length > 0) {
      return this.supportSubCategoryVal;
    }

    // If cached data is available, return it after parsing
    const cachedSubCategory = this.cacheService.get('supportSubCategory');
    if (cachedSubCategory) {
      return JSON.parse(cachedSubCategory);
    }

    // If no cached data, fetch data asynchronously
    this.getSubCategoryList().subscribe((subCategories) => {
      this.supportSubCategoryVal = subCategories;  // Assign fetched data
      this.cacheService.set('supportSubCategory', JSON.stringify(subCategories));
    });

    // Return empty array while the data is being fetched
    return [];
  }

  public loadSupportCodes() {
    this.getCategoryList();
    this.getSubCategoryList();
  }

  public async loadStaticLocationLists(): Promise<void> {
    const community = this.configService.configurationGetCommunities();
    const province = this.configService.configurationGetStateProvinces();
    const country = this.configService.configurationGetCountries();
    //const community = null;
    //const province = null;
    //const country = null;

    return await lastValueFrom(
      forkJoin([community, province, country]).pipe(
        map((results) => {
          this.setCountriesList(
            [...results[2]].map((c) => ({
              code: c.value,
              name: c.description,
              isActive: c.isActive
            }))
          );

          this.setCommunityList(
            [...results[0]].map((c) => ({
              code: c.value,
              name: c.description,
              districtName: c.districtName,
              stateProvinceCode: c.parentCode.value,
              countryCode: c.parentCode.parentCode.value,
              type: c.communityType,
              isActive: c.isActive
            }))
          );
          this.setRegionalDistricts(
            results[0].map((comm) => comm.districtName)
          );

          this.setStateProvinceList(
            [...results[1]].map((sp) => ({
              code: sp.value,
              name: sp.description,
              countryCode: sp.parentCode.value,
              isActive: sp.isActive
            }))
          );
        })
      )
    );
  }

  /**
   * Replace codes from Address object to full objects for AddressModel
   *
   * @param addressObject Address object as defined by the API
   * @returns AddressModel object usable by the UI
   */
  public getAddressRegFromAddress(addressObject: Address): RegAddress {
    //const communities = this.getCommunityList();
    //const countries = this.getCountriesList();
    //const stateProvinces = this.getStateProvinceList();

    const addressCommunity = '';

    const addressCountry = '';

    const addressStateProvince = '';
      //stateProvinces.find((sp) => sp.code === addressObject.stateProvince) ??
      //stateProvinces.find((sp) => sp.code === 'BC');

    return {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      //community: addressCommunity || addressObject.city || '',
      //stateProvince: addressStateProvince,
      community: addressObject.city,
      stateProvince: addressObject.stateProvince ? addressObject.stateProvince : "BC",
      postalCode: addressObject.postalCode,
      country: { code: 'CAN', name: 'Canada' },
      isAddressVerified: addressObject.isAddressVerified
    };
  }

  /**
   * Map an address from the wizard to an address usable by the API
   *
   * @param addressObject An Address as defined by the site's address forms
   * @returns Address object as defined by the API
   */
  public setAddressObjectForDTO(addressObject: RegAddress): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      city: addressObject.community,
        //(addressObject.community == '' || (addressObject.community as Community).code === undefined) &&
        //typeof addressObject.community === 'string'
        //  ? addressObject.community
        //  : null,
      postalCode: addressObject.postalCode,
      stateProvince: addressObject.stateProvince,
      isAddressVerified: addressObject.isAddressVerified
        //addressObject.stateProvince === null ||
        //addressObject.stateProvince === undefined
        //  ? null
        //  : addressObject.stateProvince
    };

    return address;
  }

  private setCommunityList(communityList: AreaCommunity[]): void {
    this.communityList = communityList;
    this.cacheService.set('communityList', communityList);
  }

  private setStateProvinceList(stateProvinceList: StateProvince[]): void {
    this.stateProvinceList = stateProvinceList;
    this.cacheService.set('stateProvinceList', stateProvinceList);
  }

  private setRegionalDistricts(regionalDistricts: string[]): void {
    this.regionalDistricts = regionalDistricts;
    this.cacheService.set('regionalDistrictsList', regionalDistricts);
  }

  private setCountriesList(countriesList: Country[]): void {
    this.countriesList = countriesList;
    this.cacheService.set('countriesList', countriesList);
  }

  private getCommunities(): AreaCommunity[] {
    this.configService.configurationGetAreaCommunities().subscribe({
      next: (communities: AreaCommunity[]) => {
        this.setCommunityList(
          [...communities].map((c) => ({
            name: c.name
          }))
        );
        //this.setRegionalDistricts(communities.map((comm) => comm.districtName));
      },
      error: (error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    return this.communityList || [];
  }

  private getStateProvinces(): StateProvince[] {
    this.configService.configurationGetStateProvinces().subscribe({
      next: (stateProvinces: Code[]) => {
        this.setStateProvinceList(
          [...stateProvinces].map((sp) => ({
            code: sp.value,
            name: sp.description,
            countryCode: sp.parentCode.value,
            isActive: sp.isActive
          }))
        );
      },
      error: (error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    return this.stateProvinceList || [];
  }

  private getCountries(): Country[] {
    this.configService.configurationGetCountries().subscribe({
      next: (countries: Code[]) => {
        this.setCountriesList(
          [...countries].map((c) => ({
            code: c.value,
            name: c.description,
            isActive: c.isActive
          }))
        );
      },
      error: (error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    return this.countriesList || [];
  }

  private getCategoryList(): Observable<Code[]> {
    return this.configService.configurationGetCodes({ forEnumType: 'SupportCategory' }).pipe(
      map((categories: Code[]) => categories.filter((category) => category.description)),
      catchError((error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
        return of([]);  // Return an empty array on error
      })
    );
  }

  private getSubCategoryList(): Observable<Code[]> {
    return this.configService.configurationGetCodes({ forEnumType: 'SupportSubCategory' }).pipe(
      map((subCategories: Code[]) => subCategories.filter((subCategory) => subCategory.description)),
      catchError((error) => {
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
        return of([]);  // Return an empty array on error
      })
    );
  }
}

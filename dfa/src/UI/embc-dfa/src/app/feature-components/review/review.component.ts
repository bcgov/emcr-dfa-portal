import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription, map, mapTo, startWith } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import {
  CaptchaResponse,
  CaptchaResponseType
} from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ApplicantOption, FarmOption, FileCategory, FileUpload, InsuranceOption, RoomType, SmallBusinessOption } from 'src/app/core/api/models';
import { MatTableDataSource } from '@angular/material/table';
import { DFAApplicationMainDataService } from '../dfa-application-main/dfa-application-main-data.service';
import { FormArray, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Output() captchaPassed = new EventEmitter<CaptchaResponse>();
  // @Input() parentApi !: any;
  @Input() type: string;
  @Input() showHeading: boolean;
  @Input() currentFlow: string;
  @Input() parentPageName: string;
  @Input() allowEdit: boolean;
  @Output() stepToNavigate = new EventEmitter<number>();
  componentToLoad: Observable<any>;
  cs: any;
  siteKey: string;
  ApplicantOptions = ApplicantOption;
  InsuranceOptions = InsuranceOption;
  hideCard = false;
  navigationExtras: NavigationExtras;
  fullTimeOccupantsDataSource = new MatTableDataSource();
  fullTimeOccupantsColumnsToDisplay = ['name', 'relationship'];
  secondaryApplicantsDataSource = new MatTableDataSource();
  secondaryApplicantsColumnsToDisplay = ['applicantType', 'name', 'phoneNumber', 'email'];
  otherContactsDataSource = new MatTableDataSource();
  otherContactsColumnsToDisplay = ['name', 'phoneNumber', 'email'];
  cleanUpWorkDataSource = new MatTableDataSource();
  cleanUpWorkColumnsToDisplay = ['date', 'name','hours','description'];
  cleanUpWorkFileDataSource = new MatTableDataSource<FileUpload>();
  cleanUpWorkFileColumnsToDisplay = ['fileName', 'fileDescription', 'fileDate'];
  damagedRoomsDataSource = new MatTableDataSource();
  damagedRoomsColumnsToDisplay = ['roomType', 'description'];
  damagePhotosDataSource = new MatTableDataSource<FileUpload>();
  damagePhotosColumnsToDisplay = ['fileName', 'fileDescription', 'uploadedDate'];
  supportingDocumentsDataSource = new MatTableDataSource<FileUpload>();
  supportingDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileType', 'uploadedDate'];
  requiredDocumentsDataSource = new MatTableDataSource<FileUpload>();
  requiredDocumentsColumnsToDisplay = ['fileName', 'fileDescription', 'fileType', 'uploadedDate'];
  RoomTypes = RoomType;
  FileCategories = FileCategory;
  SmallBusinessOptions = SmallBusinessOption;
  FarmOptions = FarmOption;
  isResidentialTenant: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isFarmOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  isGeneral: boolean = false;
  isCorporate: boolean = false;
  isLandlord: boolean = false;
  insuranceOptionName: string = "";
  appTypeInsuranceForm: UntypedFormGroup;
  appTypeInsuranceForm$: Subscription;

  constructor(
    private router: Router,
    public formCreationService: FormCreationService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService
  ) {

    this.appTypeInsuranceForm$ = this.formCreationService
      .getAppTypeInsuranceForm()
      .subscribe((appTypeInsurance) => {
        this.appTypeInsuranceForm = appTypeInsurance;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => { // setting these fields in fileUploadForm for validation checking
          if (application && application.appTypeInsurance) {
            this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
            this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
            this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
            this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
            this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
            if (this.isSmallBusinessOwner) {
              this.isGeneral = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.General)]);
              this.isCorporate = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Corporate)]);
              this.isLandlord = (application.appTypeInsurance.smallBusinessOption == Object.keys(this.SmallBusinessOptions)[Object.values(this.SmallBusinessOptions).indexOf(this.SmallBusinessOptions.Landlord)]);
            } else if (this.isFarmOwner) {
              this.isGeneral = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.General)]);
              this.isCorporate = (application.appTypeInsurance.farmOption == Object.keys(this.FarmOptions)[Object.values(this.FarmOptions).indexOf(this.FarmOptions.Corporate)]);
            }
            switch (application.appTypeInsurance.insuranceOption) {
              case Object.keys(this.InsuranceOptions)[Object.values(this.InsuranceOptions).indexOf(this.InsuranceOptions.Unsure)]:
                this.insuranceOptionName = this.InsuranceOptions.Unsure.toString();
                break;
              case Object.keys(this.InsuranceOptions)[Object.values(this.InsuranceOptions).indexOf(this.InsuranceOptions.Yes)]:
                this.insuranceOptionName = this.InsuranceOptions.Yes.toString();
                break;
              case Object.keys(this.InsuranceOptions)[Object.values(this.InsuranceOptions).indexOf(this.InsuranceOptions.No)]:
                this.insuranceOptionName = this.InsuranceOptions.No.toString();
                break;
              default:
                this.insuranceOptionName = application.appTypeInsurance.insuranceOption;
                break;
            }
           }
        });
      });
  }

  ngOnInit(): void {
    this.navigationExtras = { state: { parentPageName: this.parentPageName } };
    if (this.currentFlow === 'verified-registration') {
      this.captchaPassed.emit({
        type: CaptchaResponseType.success
      });
    }

    // subscribe to changes in full time occupants
    const _fullTimeOccupantsFormArray = this.formCreationService.fullTimeOccupantsForm.value.get('fullTimeOccupants');
    _fullTimeOccupantsFormArray.valueChanges
      .pipe(
        mapTo(_fullTimeOccupantsFormArray.getRawValue())
        ).subscribe(data => this.fullTimeOccupantsDataSource.data =  _fullTimeOccupantsFormArray.getRawValue());

    // subscribe to changes in secondary applicants
    const _secondaryApplicantsFormArray = this.formCreationService.secondaryApplicantsForm.value.get('secondaryApplicants');
    _secondaryApplicantsFormArray.valueChanges
      .pipe(
        mapTo(_secondaryApplicantsFormArray.getRawValue())
        ).subscribe(data => this.secondaryApplicantsDataSource.data = _secondaryApplicantsFormArray.getRawValue());

    // subscribe to changes in other contacts
    const form = this.formCreationService.otherContactsForm.value;
    const otherContactsArray = form?.get('otherContacts') as FormArray;

    if (otherContactsArray) {
      otherContactsArray.valueChanges
        .pipe(
          startWith(otherContactsArray.value), // emit initial value immediately
          map(() => otherContactsArray.getRawValue())
        )
        .subscribe(data => {
          this.otherContactsDataSource.data = data;
        });
    }
  
  

    // subscribe to changes in clean up logs
    const _cleanUpWorkFormArray = this.formCreationService.cleanUpLogItemsForm.value.get('cleanuplogs');
    _cleanUpWorkFormArray.valueChanges
      .pipe(
        mapTo(_cleanUpWorkFormArray.getRawValue())
        ).subscribe(data => this.cleanUpWorkDataSource.data = _cleanUpWorkFormArray.getRawValue());

    // subscribe to changes in damaged rooms
    const _damagedRoomsFormArray = this.formCreationService.damagedRoomsForm.value.get('damagedRooms');
    _damagedRoomsFormArray.valueChanges
      .pipe(
        mapTo(_damagedRoomsFormArray.getRawValue())
        ).subscribe(data => this.damagedRoomsDataSource.data = _damagedRoomsFormArray.getRawValue());

    // subscribe to changes in file uploads
    const _fileUploadsFormArray = this.formCreationService.fileUploadsForm.value.get('fileUploads');
    _fileUploadsFormArray.valueChanges
    .pipe(
      mapTo(_fileUploadsFormArray.value)
    ).subscribe(data => {
      this.supportingDocumentsDataSource.data =
        _fileUploadsFormArray.value?.filter(x =>
          (x.requiredDocumentType === null || x.requiredDocumentType === '' || x.requiredDocumentType === undefined)
          && x.deleteFlag === false);
      this.requiredDocumentsDataSource.data =
        _fileUploadsFormArray.value?.filter(x =>
          (x.requiredDocumentType !== null && x.requiredDocumentType !== '' && x.requiredDocumentType !== undefined)
          && x.deleteFlag === false);
      this.damagePhotosDataSource.data =
        _fileUploadsFormArray.value?.filter(x =>
          x.fileType === Object.keys(this.FileCategories)[Object.values(this.FileCategories).indexOf(this.FileCategories.DamagePhoto)] && x.deleteFlag === false)
      this.cleanUpWorkFileDataSource.data =
        _fileUploadsFormArray?.value?.filter(x =>
          x.fileType === this.FileCategories.Cleanup && x.deleteFlag === false)
    })
  }

  navigateToStep(stepIndex: number) {
    this.stepToNavigate.emit(stepIndex);
  }

  editDetails(componentToEdit: string): void {
    let route: string;
    if (this.currentFlow === 'dfa-dashboard') {
      route = '/dfa-dashboard/edit/' + componentToEdit;
    } else {
      route = '/verified-registration/edit/' + componentToEdit;
    }
    this.router.navigate([route], this.navigationExtras);
  }

  back(): void {
    this.hideCard = false;
  }

  formatPostalCode(postalCode: string): string {
    let rtnPostalCode = postalCode;
    if (postalCode.length === 6) { return postalCode.substring(0,3) + " " + postalCode.substring(3,6)};
    return rtnPostalCode;
  }

  onTokenResponse($event: CaptchaResponse) {
    this.captchaPassed.emit($event);
  }
}

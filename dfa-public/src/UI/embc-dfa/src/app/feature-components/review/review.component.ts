import { ValidateInsuranceOption } from './../../sharedModules/forms/dfa-prescreening-forms/prescreening/prescreening.component';
import { Component, EventEmitter, Inject, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, mapTo,BehaviorSubject, interval } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { FormCreationService } from '../../core/services/formCreation.service';
import {
  CaptchaResponse,
  CaptchaResponseType
} from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { ApplicantOption, DfaApplicationMain, FarmOption, FileCategory, FileUpload, InsuranceOption, RoomType, SmallBusinessOption } from 'src/app/core/api/models';
import { MatTableDataSource } from '@angular/material/table';
import { DFAApplicationMainDataService } from '../dfa-application-main/dfa-application-main-data.service';
import { FormBuilder, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ContactDetails } from 'src/app/core/model/profile.model';
import { ApplicationService, OtherContactService } from 'src/app/core/api/services';
import { CacheService } from 'src/app/core/services/cache.service';
import { ContactsForm, ApplicationDetails, OtherContact, AuthorizedRepresentativeForm, AuthorizedRepresentative } from 'src/app/core/model/dfa-application-main.model';
//import { AuthorizedRepresentativeService } from 'src/app/core/api/services/authorized-representative.service';
import { DFAApplicationMainMappingService } from '../dfa-application-main/dfa-application-main-mapping.service';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
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
  isReadOnly: boolean = false;
  insuranceOptionName: string = "";
  appTypeInsuranceForm: UntypedFormGroup;
  appTypeInsuranceForm$: Subscription;
  causeOfDamage: string;

  otherContactsDataSource = new BehaviorSubject([]);
  otherContactsData: Array<OtherContact> = [];
  otherContactsColumnsToDisplay = ['name', 'phoneNumber', 'email'];

  noCauseOfDamageError: boolean = false;
  primaryContactValidated: boolean = false;

  applicationType: string;
  hasInsurance: string;

  contacts:ContactDetails[]= [];
  otherContactsForm: UntypedFormGroup;
  otherContactsForm$: Subscription;

  /* EMCRI-1066 */
  authorizedRepresentativeForm: UntypedFormGroup;
  authorizedRepresentativeForm$: Subscription;

  //authorizedRepDataSource = new BehaviorSubject<AuthorizedRepresentative>(new AuthorizedRepresentative);
  authorizedRepresentative: AuthorizedRepresentative;
  authorizedRepColumnsToDisplay = ['firstName', 'lastName', 'businessPhone', 'email', 'positionTitle', 'firstDeclaration', 'secondDeclaration'];


  constructor(
    public customValidator: CustomValidationService,
    private router: Router,
    public formCreationService: FormCreationService, 
    public formBuilder: FormBuilder,
    private otherContactsService: OtherContactService,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private applicationService: ApplicationService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    //private authorizedRepresentativeService: AuthorizedRepresentativeService, 
    private cacheService: CacheService
  ) {
    this.appTypeInsuranceForm$ = this.formCreationService
      .getAppTypeInsuranceForm()
      .subscribe((appTypeInsurance) => {
        this.appTypeInsuranceForm = appTypeInsurance;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => { // setting these fields in fileUploadForm for validation checking
          if (application) {
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

    this.isReadOnly = false;
    this.setViewOrEditControls();
  }

  mySubscription: Subscription

  ngOnInit(): void {

    /* EMCRI-1066: Authorized Representative */
    this.authorizedRepresentativeForm$ = this.formCreationService
      .getAuthorizedRepresentativeForm()
      .subscribe((authorizedRepresentativeDetails) => {
        this.authorizedRepresentativeForm = authorizedRepresentativeDetails;
        this.setViewOrEditControls();
        this.dfaApplicationMainDataService.authorizedRepresentative = {
          firstName: null,
          lastName: null,
          businessPhone: null,
          email: null,
          positionTitle: null,
          firstDeclaration: null,
          secondDeclaration: null
        };
      })

    this.dfaApplicationMainDataService.authorizedRepresentativeDataChangedEvent.subscribe((changed) => {
      if (changed) {
        this.authorizedRepresentative = this.dfaApplicationMainDataService.authorizedRepresentative;
      }
    });
      
    this.getAuthorizedRepresentativeForApplication(
      this.dfaApplicationMainDataService.getApplicationId()
    );

    this.cacheService.set('otherContacts',undefined);
    this.setViewOrEditControls();

    this.navigationExtras = { state: { parentPageName: this.parentPageName } };
    if (this.currentFlow === 'verified-registration') {
      this.captchaPassed.emit({
        type: CaptchaResponseType.success
      });
    }

    // 2024-10-11 EMCRI-809 waynezen; subscribe to event when cacheService.set('dfa-application-main')
    //this.dfaApplicationMainDataService.dfaApplicationMainCachedEvent.subscribe((verifiedornot) => {
    //  if (verifiedornot) {
    //    let data = this.dfaApplicationMainDataService.getDFAApplicationMain();
    //    this.noCauseOfDamageError = this.validateFormCauseOfDamage(data);
    //  }
    //});
    // 2024-10-11 EMCRI-809 waynezen; subscribe to event when Other Contacts grid is changed
    this.dfaApplicationMainDataService.otherContactsDataChangedEvent.subscribe((changed) => {
      if (changed) {
        this.otherContactsData = this.dfaApplicationMainDataService.otherContacts;
        this.otherContactsDataSource.next(this.otherContactsData);
      }
    });
    this.dfaApplicationMainDataService.primaryContactValidatedEvent.subscribe((verifiedornot) => {
      if (verifiedornot != null) {
        this.primaryContactValidated = verifiedornot;
      }
    });



    var appForm = this.formCreationService.applicationDetailsForm.value;

    //debugger
    if (appForm.controls.floodDamage.value === 'true') {
     this.causeOfDamage = 'Flood Damage, ';
    }
    if (appForm.controls.landslideDamage.value === 'true') {
     this.causeOfDamage += 'Landslide Damage, ';
    }
    if (appForm.controls.stormDamage.value === 'true') {
     this.causeOfDamage += 'Storm Damage, ';
    }
    if (appForm.controls.wildfireDamage.value === 'true') {
     this.causeOfDamage += 'Wildfire Damage, ';
    }
    if (appForm.controls.otherDamage.value === 'true') {
     this.causeOfDamage += appForm.controls.otherDamage.value + ', ';
    }
    if(this.causeOfDamage){
      this.causeOfDamage = this.causeOfDamage.slice(0, -1);
    }
   
    //var contactsForm = this.formCreationService.contactsForm.value;
    
    // interval(5000).subscribe(x => {
    //   if(this.cacheService.get('otherContacts')!=undefined&&this.cacheService.get('otherContacts')!="undefined")
    //   {
    //   this.otherContactsData = JSON.parse(this.cacheService.get('otherContacts'));
    //   //this.contactsForm = this.formCreationService.contactsForm.value;
    //   }
    // });
    //this.otherContactsData = JSON.parse(this.cacheService.get('otherContacts'))
    // this.otherContactsData = this.dfaApplicationMainDataService.otherContacts;

    appForm.valueChanges
      .pipe(
        mapTo(appForm.getRawValue())
    ).subscribe(data => {
      
        this.causeOfDamage = '';
        if (appForm.controls.floodDamage.value === true) {
          this.causeOfDamage = 'Flood Damage, ';
        }
        if (appForm.controls.landslideDamage.value === true) {
          this.causeOfDamage += 'Landslide Damage, ';
        }
        if (appForm.controls.stormDamage.value === true) {
          this.causeOfDamage += 'Storm Damage, ';
        }
        if (appForm.controls.wildfireDamage.value === true) {
          this.causeOfDamage += 'Wildfire Damage, ';
        }
        if (appForm.controls.otherDamage.value === true) {
          this.causeOfDamage += appForm.controls.otherDamageText.value + ', ';
        }

        if (this.causeOfDamage) {
          this.causeOfDamage = this.causeOfDamage.slice(0, -2);
        }
      }

    );

    //if (appForm.value.get('fullTimeOccupants') controls.stormDamage.value !== true &&
    //  appForm.controls.landslideDamage.value !== true &&
    //  appForm.controls.otherDamage.value !== true &&
    //  appForm.controls.wildfireDamage.value !== true &&
    //  appForm.controls.floodDamage.value !== true) {
    //  return { noCauseOfDamage: true };
    //}

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
      //this.damagePhotosDataSource.data =
      //  _fileUploadsFormArray.value?.filter(x =>
      //    x.fileType === Object.keys(this.FileCategories)[Object.values(this.FileCategories).indexOf(this.FileCategories.DamagePhoto)] && x.deleteFlag === false)
      //this.cleanUpWorkFileDataSource.data =
      //  _fileUploadsFormArray?.value?.filter(x =>
      //    x.fileType === this.FileCategories.Cleanup && x.deleteFlag === false)
    })

/*     const _authorizedRepresentativeForm = this.formCreationService.authorizedRepresentativeForm.value.get('authorizedRepresentative');
    _authorizedRepresentativeForm.valueChanges
    .pipe(mapTo(_authorizedRepresentativeForm.value)
  ).subscribe(data => {
    this.authorizedRepDataSource.data = 
  }) */


    this.cacheService.set(
      'authorizedRepresentative',
      this.dfaApplicationMainDataService.authorizedRepresentative ?? new AuthorizedRepresentative()
    );
  }

  getAuthorizedRepresentativeForApplication(applicationId: string) {
    if (applicationId) {
      this.applicationService
      .applicationGetApplicationMain({applicationId: applicationId})
      .subscribe({
        next: (dfaApplicationMain) => {
          this.authorizedRepresentative = dfaApplicationMain?.authorizedRepresentative ?? new AuthorizedRepresentative();
          this.dfaApplicationMainMapping.mapDFAApplicationMainAuthorizedRepresentative(
            dfaApplicationMain
          );
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
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

  // 2024-10-11 EMCRI-809 waynezen; duplicated logic from application-details.component
  private validateFormCauseOfDamage(data: DfaApplicationMain): boolean {
    this.formCreationService.applicationDetailsForm.value.get('stormDamage').value;
    if (this.formCreationService.applicationDetailsForm.value.get('stormDamage').value !== true &&
      data.applicationDetails.landslideDamage !== true &&
      data.applicationDetails.otherDamage !== true &&
      data.applicationDetails.floodDamage !== true &&
      data.applicationDetails.wildfireDamage !== true) {
      return true;
    }
    return false;
  }

  setViewOrEditControls() {
    if (!this.authorizedRepresentativeForm) return;
    if (this.isReadOnly) {
      this.authorizedRepresentativeForm.controls.firstName.disable();
      this.authorizedRepresentativeForm.controls.lastName.disable();
      this.authorizedRepresentativeForm.controls.businessPhone.disable();
      this.authorizedRepresentativeForm.controls.email.disable();
      this.authorizedRepresentativeForm.controls.positionTitle.disable();
      this.authorizedRepresentativeForm.controls.firstDeclaration.disable();
      this.authorizedRepresentativeForm.controls.secondDeclaration.disable();
    } else {
      this.authorizedRepresentativeForm.controls.firstName.enable();
      this.authorizedRepresentativeForm.controls.lastName.enable();
      this.authorizedRepresentativeForm.controls.businessPhone.enable();
      this.authorizedRepresentativeForm.controls.email.enable();
      this.authorizedRepresentativeForm.controls.positionTitle.enable();
      this.authorizedRepresentativeForm.controls.firstDeclaration.enable();
      this.authorizedRepresentativeForm.controls.secondDeclaration.enable();
    }
  }

  validateAuthorizedRepresentative(){
    this.formCreationService.authorizedRepresentativeChanged.emit(this.authorizedRepresentativeForm);
  }

  updateAuthorizedRepresentativeOnVisibility(): void {
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.firstName')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.lastName')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.businessPhone')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.email')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.positionTitle')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.firstDeclaration')
      .updateValueAndValidity();
    this.authorizedRepresentativeForm
      .get('authorizedRepresentative.secondDeclaration')
      .updateValueAndValidity();  
  }

  ngOnDestroy(): void {
    this.authorizedRepresentativeForm$.unsubscribe();
  }
}

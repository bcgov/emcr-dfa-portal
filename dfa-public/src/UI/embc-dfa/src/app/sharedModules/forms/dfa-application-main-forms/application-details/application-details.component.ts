import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { ApplicantOption, ApplicantSubtypeSubCategories, DisasterEvent } from 'src/app/core/api/models';
import { MatTableModule } from '@angular/material/table';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { DFADeleteConfirmDialogComponent } from '../../../../core/components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { ApplicationService, EligibilityService, OtherContactService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { MatSelectModule } from '@angular/material/select';
import { DFAEligibilityDialogComponent } from '../../../../core/components/dialog-components/dfa-eligibility-dialog/dfa-eligibility-dialog.component';
import * as globalConst from '../../../../core/services/globalConstants';


@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export default class PropertyDamageComponent implements OnInit, OnDestroy {
  applicationDetailsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  applicationDetailsForm$: Subscription;
  formCreationService: FormCreationService;
  otherContactsForm: UntypedFormGroup;
  otherContactsForm$: Subscription;
  authorizedRepresentativeForm: UntypedFormGroup;
  authorizedRepresentativeForm$: Subscription;
  remainingLength: number = 200;
  todayDate = new Date().toISOString();
  public ApplicantOptions = ApplicantOption;
  isResidentialTenant: boolean = false;
  isHomeowner: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isReadOnly: boolean = false;
  isFarmOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  onlyOtherContact: boolean = false;
  disableOnlyOtherContact: boolean = false;
  hideOtherContactButton: boolean = false;
  otherContactsColumnsToDisplay = ['name', 'phoneNumber', 'email', 'deleteIcon'];
  otherContactsDataSource = new BehaviorSubject([]);
  otherContactsData = [];
  otherContactsDeletedData = [];
  otherContactsEditIndex: number;
  otherContactsRowEdit = false;
  otherContactsEditFlag = false;
  otherContactText = 'New Other Contact';
  showOtherContactForm: boolean = false;
  vieworedit: string = "";
  ApplicantSubCategories = [];
  ApplicantSubSubCategories = ApplicantSubtypeSubCategories;
  showSubTypeOtherDetails: boolean = false;
  showSubSubTypeCategories: boolean = false;
  public openDisasterEvents: DisasterEventMatching[] = [];
  matchingEventsData: DisasterEventMatching[] = [];
  readonly phoneMask = [
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private applicationService: ApplicationService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    private otherContactsService: OtherContactService,
    private eligibilityService: EligibilityService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
    || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');
    this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
        || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })

    this.vieworedit = dfaApplicationMainDataService.getViewOrEdit();
  }

  setViewOrEditControls() {
    if (!this.applicationDetailsForm) return;
    if (this.isReadOnly) {
      this.applicationDetailsForm.controls.floodDamage.disable();
      this.applicationDetailsForm.controls.landslideDamage.disable();
      this.applicationDetailsForm.controls.stormDamage.disable();
      this.applicationDetailsForm.controls.otherDamage.disable();
      this.applicationDetailsForm.controls.wildfireDamage.disable();
      this.applicationDetailsForm.controls.subtypeOtherDetails.disable();
      this.applicationDetailsForm.controls.estimatedPercent.disable();
      this.applicationDetailsForm.controls.subtypeDFAComment.disable();
      this.applicationDetailsForm.controls.eventId.disable();
    } else {
      this.applicationDetailsForm.controls.floodDamage.enable();
      this.applicationDetailsForm.controls.landslideDamage.enable();
      this.applicationDetailsForm.controls.stormDamage.enable();
      this.applicationDetailsForm.controls.wildfireDamage.enable();
      this.applicationDetailsForm.controls.otherDamage.enable();
      this.applicationDetailsForm.controls.subtypeOtherDetails.enable();
      this.applicationDetailsForm.controls.estimatedPercent.enable();
      this.applicationDetailsForm.controls.subtypeDFAComment.enable();
      this.applicationDetailsForm.controls.eventId.enable();
    }
  }

  ngOnInit(): void {
    //this.businessName = this.dfaApplicationMainDataService.getBusiness();
    this.applicationDetailsForm$ = this.formCreationService
      .getApplicationDetailsForm()
      .subscribe((applicationDetails) => {
        applicationDetails.controls.legalName.setValue(this.dfaApplicationMainDataService.getBusiness());
        this.applicationDetailsForm = applicationDetails;
        this.setViewOrEditControls();
        this.dfaApplicationMainDataService.applicationDetails = {
          legalName: this.dfaApplicationMainDataService.getBusiness(),
          damageFromDate: null,
          damageToDate: null,
          floodDamage: null,
          landslideDamage: null,
          otherDamage: null,
          otherDamageText: null,
          stormDamage: null,
          wildfireDamage: null,
          guidanceSupport: null,
          applicantSubtype: null
        }
        
        this.applicationDetailsForm.addValidators([this.validateFormCauseOfDamage]);
        if (this.applicationDetailsForm.get('otherDamage').value === 'true') {
          this.applicationDetailsForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
          this.applicationDetailsForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.applicationDetailsForm.get('otherDamageText').updateValueAndValidity();
        this.applicationDetailsForm.updateValueAndValidity();
      });

    /* EMCRI-1066: Authorized Representative */
    this.authorizedRepresentativeForm$ = this.formCreationService
      .getAuthorizedRepresentativeForm()
      .subscribe((authorizedRepresentative) => {
        this.authorizedRepresentativeForm = authorizedRepresentative;
        //this.setViewOrEditControls();
        this.dfaApplicationMainDataService.authorizedRepresentative = {
          firstName: null,
          lastName: null,
          businessPhone: null,
          email: null,
          positionTitle: null,
          firstDeclaration: null,
          secondDeclaration: null
        }
          
      });
      
    this.otherContactsForm$ = this.formCreationService
      .getOtherContactsForm()
      .subscribe((otherContacts) => {
        this.otherContactsForm = otherContacts;
      });

    this.getOpenDisasterEvents();

    this.otherContactsForm
      .get('addNewOtherContactIndicator')
      .valueChanges.subscribe((value) => this.updateOtherContactOnVisibility());

    this.applicationDetailsForm
      .get('floodDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('floodDamage').reset();
        }
      });

    this.applicationDetailsForm
      .get('landslideDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('landslideDamage').reset();
        }
      });

    this.applicationDetailsForm
      .get('wildfireDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('wildfireDamage').reset();
        }
      });

    this.applicationDetailsForm
      .get('stormDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('stormDamage').reset();
        }
      });

    this.applicationDetailsForm
      .get('otherDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('otherDamage').reset();
        }  else if (value == 'true') {
          this.applicationDetailsForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else if (value == 'false') {
          this.applicationDetailsForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.applicationDetailsForm.get('otherDamageText').updateValueAndValidity();
        this.applicationDetailsForm.updateValueAndValidity();
      });

    this.applicationDetailsForm
      .get('otherDamageText')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('otherDamageText').reset();
        }
      });

    //this.propertyDamageForm
    //  .get('applicantSubtype')
    //  .valueChanges.pipe(distinctUntilChanged())
    //  .subscribe((value) => {
    //    if (value === 'Other Local Government Body') {
    //      this.propertyDamageForm.get('applicantSubSubtype').setValidators([Validators.required]);
    //      this.propertyDamageForm.get('subtypeOtherDetails').setValidators(null);
    //      this.propertyDamageForm.get('subtypeOtherDetails').setValue(null);
    //    }
    //    else if (value === 'Other') {
    //      this.propertyDamageForm.get('subtypeOtherDetails').setValidators([Validators.required]);
    //      this.propertyDamageForm.get('applicantSubSubtype').setValidators(null);
    //      this.propertyDamageForm.get('applicantSubSubtype').setValue(null);
    //    }
    //    else {
    //      this.propertyDamageForm.get('applicantSubSubtype').setValidators(null);
    //      this.propertyDamageForm.get('subtypeOtherDetails').setValidators(null);
    //      this.propertyDamageForm.get('applicantSubSubtype').setValue(null);
    //      this.propertyDamageForm.get('subtypeOtherDetails').setValue(null);
    //    }
    //  });

    this.applicationDetailsForm
      .get('damageFromDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('damageFromDate').reset();
        }
      });

    this.applicationDetailsForm
      .get('damageToDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.applicationDetailsForm.get('damageToDate').reset();
        }
      });

    this.applicationService.applicationGetApplicantSubTypes().subscribe({
      next: (applicantsubtypes) => {
        this.ApplicantSubCategories = applicantsubtypes;

      },
      error: (error) => {
        //console.error(error);
        //document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });

    this.getApplicationDetails(this.dfaApplicationMainDataService.getApplicationId());
    this.getOtherContactsForApplication(this.dfaApplicationMainDataService.getApplicationId());    

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly' || this.dfaApplicationMainDataService.getViewOrEdit() == 'view') {
      this.applicationDetailsForm.disable();
    }

    //this.otherContactsForm.get('onlyOtherContact').setValue(this.onlyOtherContact);
  }

  getOpenDisasterEvents() {
    this.eligibilityService.eligibilityGetOpenEvents().subscribe((openDisasterEvents: DisasterEventMatching[]) => {
      this.openDisasterEvents = openDisasterEvents;
    })
  }

  selectEvent(objOption): void {

    this.applicationDetailsForm.controls.eventId.setValue(objOption.eventId);
    this.applicationDetailsForm.controls.eventName.setValue(objOption.eventName);
    this.applicationDetailsForm.updateValueAndValidity();
  }

  checkDateWithinOpenEvent(): void {
    //this.openDisasterEvents.forEach(disasterEvent => disasterEvent.matchArea = true);

    // check for date of damage between start date and end date
    this.openDisasterEvents.forEach(disasterEvent => {
      if (new Date(new Date(disasterEvent.endDate).toDateString()) >= this.applicationDetailsForm.controls.damageFromDate.value &&
        new Date(new Date(disasterEvent.startDate).toDateString()) <= this.applicationDetailsForm.controls.damageFromDate.value) {
        disasterEvent.matchDate = true;
      } else disasterEvent.matchDate = false;
    })

    // Matching Events to display
    this.matchingEventsData = this.openDisasterEvents.filter(disasterEvent => disasterEvent.matchDate == true);

    let countMatchingEvents = this.matchingEventsData.length;
    if (countMatchingEvents <= 0) {
      this.dialog
        .open(DFAEligibilityDialogComponent, {
          data: {
            content: globalConst.addressAndDateNotWithinPublicOpenEvent
          },
          width: '700px',
          disableClose: true
        })
        .afterClosed()
        .subscribe((result) => {
          //if (result === 'cancel') {
          //  this.cancelPrescreening();
          //}
        });
    } else if (countMatchingEvents == 1) {
      this.applicationDetailsForm.controls.eventId.setValue(this.matchingEventsData[0].eventId);
      this.applicationDetailsForm.controls.eventId.updateValueAndValidity();
      this.applicationDetailsForm.controls.eventName.setValue(this.matchingEventsData[0].eventName);
      this.applicationDetailsForm.controls.eventName.updateValueAndValidity();
      this.applicationDetailsForm.updateValueAndValidity();
      
    }
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  calcRemainingChars() {
    this.remainingLength = 200 - this.applicationDetailsForm.get('subtypeOtherDetails').value?.length;
  }

  onSelectApplicantSubType(objSelected) {
    this.applicationDetailsForm.get('estimatedPercent').setValue('' + objSelected.estimatePercent);
    this.applicationDetailsForm.get('subtypeDFAComment').setValue(objSelected.dfaComment);

    if (objSelected.subType == 'Other') {
      this.showSubSubTypeCategories = false;
      this.showSubTypeOtherDetails = true;
      this.applicationDetailsForm.get('subtypeOtherDetails').setValidators([Validators.required]);
      this.applicationDetailsForm.get('applicantSubSubtype').setValidators(null);
      this.applicationDetailsForm.get('applicantSubSubtype').setValue(null);
    }
    else if (objSelected.subType == 'Other Local Government Body') {
      this.showSubTypeOtherDetails = false;
      this.showSubSubTypeCategories = true;
      this.applicationDetailsForm.get('applicantSubSubtype').setValidators([Validators.required]);
      this.applicationDetailsForm.get('subtypeOtherDetails').setValidators(null);
      this.applicationDetailsForm.get('subtypeOtherDetails').setValue(null);
    }
    else {
      this.showSubSubTypeCategories = false;
      this.showSubTypeOtherDetails = false;
      this.applicationDetailsForm.get('applicantSubSubtype').setValidators(null);
      this.applicationDetailsForm.get('subtypeOtherDetails').setValidators(null);
      this.applicationDetailsForm.get('applicantSubSubtype').setValue(null);
      this.applicationDetailsForm.get('subtypeOtherDetails').setValue(null);
    }
  }

  getApplicationDetails(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationMain({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {

          if (dfaApplicationMain.applicationDetails && dfaApplicationMain.applicationDetails.eventId) {
            this.openDisasterEvents.forEach(disasterEvent => {
              if (new Date(new Date(disasterEvent.endDate).toDateString()) >= new Date(new Date(dfaApplicationMain.applicationDetails.damageFromDate).toDateString())  &&
                new Date(new Date(disasterEvent.startDate).toDateString()) <= new Date(new Date(dfaApplicationMain.applicationDetails.damageFromDate).toDateString())) {
                disasterEvent.matchDate = true;
              } else disasterEvent.matchDate = false;
            })

            this.matchingEventsData = this.openDisasterEvents.filter(disasterEvent => disasterEvent.matchDate == true);
            if (this.matchingEventsData && this.matchingEventsData.length > 0) {
              dfaApplicationMain.applicationDetails.eventName = this.matchingEventsData[0].eventName;
            }
          }

          this.dfaApplicationMainMapping.mapDFAApplicationMain(dfaApplicationMain);
          this.dfaApplicationMainMapping.mapDFAApplicationMainAuthorizedRepresentative(dfaApplicationMain);

          var objSelected = this.ApplicantSubCategories.filter(m => m.subType == dfaApplicationMain.applicationDetails.applicantSubtype);
          if (objSelected && objSelected.length > 0) {
            this.onSelectApplicantSubType(objSelected[0]);
          }
          
          //this.selectSavedEvent(dfaApplicationMain.applicationDetails);
          
        },
        error: (error) => {
          //console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  getOtherContactsForApplication(applicationId: string) {
    if (applicationId) {
      //if (applicationId === undefined) {
      //  applicationId = this.dfaApplicationMainDataService.getApplicationId();
      //}

      this.otherContactsService.otherContactGetOtherContacts({ applicationId: applicationId }).subscribe({
        next: (otherContacts) => {
          
          this.otherContactsData = otherContacts;
          this.otherContactsDataSource.next(this.otherContactsData);
          this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
          this.dfaApplicationMainDataService.otherContacts = this.otherContactsForm.get('otherContacts').getRawValue();
        },
        error: (error) => {
          //console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  updateOtherContactOnVisibility(): void {
    this.otherContactsForm
      .get('otherContact.firstName')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.lastName')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.phoneNumber')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.email')
      .updateValueAndValidity();
  }

  cancelOtherContact(): void {
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(false);
    this.otherContactText = 'New Other Contact'
  }

  public validateFormCauseOfDamage(form: FormGroup) {
    if (form.controls.stormDamage.value !== true &&
      form.controls.landslideDamage.value !== true &&
      form.controls.otherDamage.value !== true &&
      form.controls.floodDamage.value !== true &&
      form.controls.wildfireDamage.value !== true) {
      return { noCauseOfDamage: true };
    }

    return null;
  }

  saveOtherContact(): void {
    
    if (this.otherContactsForm.get('otherContact').status === 'VALID') {
      if (this.otherContactsEditIndex !== undefined && this.otherContactsRowEdit) {
        this.otherContactsData[this.otherContactsEditIndex] = this.otherContactsForm.get('otherContact').value;
        this.otherContactsRowEdit = !this.otherContactsRowEdit;
        this.otherContactsEditIndex = undefined;
        this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);

        var actualElements = this.otherContactsData.filter((m) => !(m.deleteFlag == true && m.id));
        this.otherContactsData = actualElements;

        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsData = this.otherContactsData.concat(this.otherContactsDeletedData);

        this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
        this.showOtherContactForm = !this.showOtherContactForm;
        this.otherContactsEditFlag = !this.otherContactsEditFlag;
      } else {
        //this.otherContactsForm.get('otherContact').get('id').setValue(otherContactId);
        this.otherContactsData.push(this.otherContactsForm.get('otherContact').value);
        this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);

        var actualElements = this.otherContactsData.filter((m) => !(m.deleteFlag == true && m.id));
        this.otherContactsData = actualElements;

        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsData = this.otherContactsData.concat(this.otherContactsDeletedData);

        this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
        this.showOtherContactForm = !this.showOtherContactForm;
      }

      this.dfaApplicationMainDataService.otherContacts = this.otherContactsForm.get('otherContacts').getRawValue();
    } else {
      this.otherContactsForm.get('otherContact').markAllAsTouched();
    }
  }

  addOtherContact(): void {
    this.otherContactText = 'New Other Contact'
    this.otherContactsForm.get('otherContact').reset();
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
    this.otherContactsForm.get('otherContact.deleteFlag').setValue(false);
    this.otherContactsForm.get('otherContact.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
  }

  editOtherContactsRow(element, index): void {
    this.otherContactText = 'Edit Other Contact'
    this.otherContactsEditIndex = index;
    this.otherContactsRowEdit = !this.otherContactsRowEdit;
    this.otherContactsForm.get('otherContact').setValue(element);
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsEditFlag = !this.otherContactsEditFlag;
    this.otherContactsForm
      .get('addNewOtherContactIndicator').setValue(true);
  }

  deleteOtherContactRow(index: number): void {
    this.otherContactsDeletedData = [];
    this.otherContactsData[index].deleteFlag = true;
    var elementtoberemoved = this.otherContactsData[index];
    
    if (elementtoberemoved.id) {
      this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);
      var actualElements = this.otherContactsData.filter((m) => !(m.deleteFlag == true && m.id));
      this.otherContactsData = actualElements;
    }
    else {
      this.otherContactsData.splice(index, 1);
      this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);
      var actualElements = this.otherContactsData.filter((m) => !(m.deleteFlag == true && m.id));
      this.otherContactsData = actualElements;
      //this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);
    }

    //this.otherContactsDeletedData = this.otherContactsData.filter((m) => m.deleteFlag == true && m.id);
    

    //this.otherContactsData.splice(index, 1);
    this.otherContactsDataSource.next(this.otherContactsData);
    this.otherContactsData = this.otherContactsData.concat(this.otherContactsDeletedData);
    this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
    
    this.dfaApplicationMainDataService.otherContacts = this.otherContactsForm.get('otherContacts').getRawValue();
    if (this.otherContactsData.length === 0) {
      this.otherContactsForm
        .get('addNewOtherContactIndicator')
        .setValue(false);
    }
  }

  confirmDeleteOtherContactRow(index: number): void {
    
    var actualElementsCheck = this.otherContactsData.filter((m) => !(m.deleteFlag == true && m.id));
    var appId = this.dfaApplicationMainDataService.getApplicationId()

    if (actualElementsCheck.length == 1 && appId) {
      this.dialog
        .open(DFADeleteConfirmDialogComponent, {
          data: {
            content: "DFA requires that you have at least one Other Contact.<br/>Please add a new contact before deleting this one."
          },
          width: '500px',
          disableClose: true
        })
        .afterClosed()
        .subscribe((result) => {
          //if (result === 'confirm') {
          //  this.deleteOtherContactRow(index);
          //}
        });
    }
    else {
      this.deleteOtherContactRow(index);
    }
  }

  /**
   * Returns the control of the form
   */
  get propertyDamageFormControl(): { [key: string]: AbstractControl } {
    return this.applicationDetailsForm.controls;
  }

  ngOnDestroy(): void {
    this.applicationDetailsForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    DirectivesModule,
    MatTableModule,
    CustomPipeModule,
    // 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - new text mask provider
    NgxMaskDirective, NgxMaskPipe,
    MatSelectModule
  ],
  declarations: [PropertyDamageComponent]
})
class PropertyDamageModule {}

export interface DisasterEventMatching extends DisasterEvent {
  matchArea: boolean;
  matchDate: boolean;
}

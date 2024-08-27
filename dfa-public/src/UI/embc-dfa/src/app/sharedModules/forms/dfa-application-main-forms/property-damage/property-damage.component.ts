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
import { ApplicantOption, ApplicantSubtypeSubCategories } from 'src/app/core/api/models';
import { MatTableModule } from '@angular/material/table';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { DFADeleteConfirmDialogComponent } from '../../../../core/components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
// 2024-07-31 EMCRI-216 waynezen; upgrade to Angular 18 - TextMaskModule not compatible
//import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { ApplicationService, OtherContactService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-property-damage',
  templateUrl: './property-damage.component.html',
  styleUrls: ['./property-damage.component.scss']
})
export default class PropertyDamageComponent implements OnInit, OnDestroy {
  propertyDamageForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  propertyDamageForm$: Subscription;
  formCreationService: FormCreationService;
  otherContactsForm: UntypedFormGroup;
  otherContactsForm$: Subscription;
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
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
    || dfaApplicationMainDataService.getViewOrEdit() === 'edit'
    || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');
    this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
        || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })

    this.vieworedit = dfaApplicationMainDataService.getViewOrEdit();
  }

  setViewOrEditControls() {
    if (!this.propertyDamageForm) return;
    if (this.isReadOnly) {
      this.propertyDamageForm.controls.floodDamage.disable();
      this.propertyDamageForm.controls.landslideDamage.disable();
      this.propertyDamageForm.controls.stormDamage.disable();
      this.propertyDamageForm.controls.otherDamage.disable();
      this.propertyDamageForm.controls.wildfireDamage.disable();
      this.propertyDamageForm.controls.subtypeOtherDetails.disable();
      this.propertyDamageForm.controls.estimatedPercent.disable();
      this.propertyDamageForm.controls.subtypeDFAComment.disable();
    } else {
      this.propertyDamageForm.controls.floodDamage.enable();
      this.propertyDamageForm.controls.landslideDamage.enable();
      this.propertyDamageForm.controls.stormDamage.enable();
      this.propertyDamageForm.controls.wildfireDamage.enable();
      this.propertyDamageForm.controls.otherDamage.enable();
      this.propertyDamageForm.controls.subtypeOtherDetails.enable();
      this.propertyDamageForm.controls.estimatedPercent.enable();
      this.propertyDamageForm.controls.subtypeDFAComment.enable();
    }
  }

  ngOnInit(): void {
    this.propertyDamageForm$ = this.formCreationService
      .getPropertyDamageForm()
      .subscribe((propertyDamage) => {
        this.propertyDamageForm = propertyDamage;
        this.setViewOrEditControls();
        this.dfaApplicationMainDataService.propertyDamage = {
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
        //this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
        //  if (application) {
        //    this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
        //    this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
        //    this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
        //    this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
        //    this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
        //    if (this.isHomeowner || this.isResidentialTenant) {
        //      this.propertyDamageForm.controls.wereYouEvacuated.setValidators([Validators.required]);
        //      this.propertyDamageForm.controls.residingInResidence.setValidators([Validators.required]);
        //    } else if (this.isSmallBusinessOwner || this.isFarmOwner || this.isCharitableOrganization) {
        //      this.propertyDamageForm.controls.wereYouEvacuated.setValidators(null);
        //      this.propertyDamageForm.controls.wereYouEvacuated.setValue(null);
        //      this.propertyDamageForm.controls.dateReturned.setValue(null);
        //      this.propertyDamageForm.controls.residingInResidence.setValidators(null);
        //      this.propertyDamageForm.controls.residingInResidence.setValue(null);
        //    }
        //  this.propertyDamageForm.updateValueAndValidity();
        //  }
        //});
        this.propertyDamageForm.addValidators([this.validateFormCauseOfDamage]);
        if (this.propertyDamageForm.get('otherDamage').value === 'true') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.propertyDamageForm.get('otherDamageText').updateValueAndValidity();
        this.propertyDamageForm.updateValueAndValidity();
      });

    this.otherContactsForm$ = this.formCreationService
      .getOtherContactsForm()
      .subscribe((otherContacts) => {
        this.otherContactsForm = otherContacts;
      });

    this.otherContactsForm
      .get('addNewOtherContactIndicator')
      .valueChanges.subscribe((value) => this.updateOtherContactOnVisibility());

    this.propertyDamageForm
      .get('floodDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('floodDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('landslideDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('landslideDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('wildfireDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('wildfireDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('stormDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('stormDamage').reset();
        }
      });

    this.propertyDamageForm
      .get('otherDamage')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('otherDamage').reset();
        }  else if (value == 'true') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.required, Validators.maxLength(100)]);
        } else if (value == 'false') {
          this.propertyDamageForm.get('otherDamageText').setValidators([Validators.maxLength(100)]);
        }
        this.propertyDamageForm.get('otherDamageText').updateValueAndValidity();
        this.propertyDamageForm.updateValueAndValidity();
      });

    this.propertyDamageForm
      .get('otherDamageText')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('otherDamageText').reset();
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

    this.propertyDamageForm
      .get('damageFromDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('damageFromDate').reset();
        }
      });

    this.propertyDamageForm
      .get('damageToDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.propertyDamageForm.get('damageToDate').reset();
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

    this.getPropertyDamageForApplication(this.dfaApplicationMainDataService.getApplicationId());
    this.getOtherContactsForApplication(this.dfaApplicationMainDataService.getApplicationId());
    

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.propertyDamageForm.disable();
    }

    //this.otherContactsForm.get('onlyOtherContact').setValue(this.onlyOtherContact);
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  calcRemainingChars() {
    this.remainingLength = 200 - this.propertyDamageForm.get('subtypeOtherDetails').value?.length;
  }

  onSelectApplicantSubType(objSelected) {
    this.propertyDamageForm.get('estimatedPercent').setValue('' + objSelected.estimatePercent);
    this.propertyDamageForm.get('subtypeDFAComment').setValue(objSelected.dfaComment);

    if (objSelected.subType == 'Other') {
      this.showSubSubTypeCategories = false;
      this.showSubTypeOtherDetails = true;
      this.propertyDamageForm.get('subtypeOtherDetails').setValidators([Validators.required]);
      this.propertyDamageForm.get('applicantSubSubtype').setValidators(null);
      this.propertyDamageForm.get('applicantSubSubtype').setValue(null);
    }
    else if (objSelected.subType == 'Other Local Government Body') {
      this.showSubTypeOtherDetails = false;
      this.showSubSubTypeCategories = true;
      this.propertyDamageForm.get('applicantSubSubtype').setValidators([Validators.required]);
      this.propertyDamageForm.get('subtypeOtherDetails').setValidators(null);
      this.propertyDamageForm.get('subtypeOtherDetails').setValue(null);
    }
    else {
      this.showSubSubTypeCategories = false;
      this.showSubTypeOtherDetails = false;
      this.propertyDamageForm.get('applicantSubSubtype').setValidators(null);
      this.propertyDamageForm.get('subtypeOtherDetails').setValidators(null);
      this.propertyDamageForm.get('applicantSubSubtype').setValue(null);
      this.propertyDamageForm.get('subtypeOtherDetails').setValue(null);
    }
  }

  getPropertyDamageForApplication(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationMain({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          //console.log('dfaApplicationMain: ' + JSON.stringify(dfaApplicationMain))
          //if (dfaApplicationMain.notifyUser == true) {
          //  //this.notifyAddressChange();
          //}
          //debugger
          this.dfaApplicationMainMapping.mapDFAApplicationMain(dfaApplicationMain);
          
          var objSelected = this.ApplicantSubCategories.filter(m => m.subType == dfaApplicationMain.propertyDamage.applicantSubtype);
          if (objSelected && objSelected.length > 0) {
            this.onSelectApplicantSubType(objSelected[0]);
          }
          
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

  validateFormCauseOfDamage(form: FormGroup) {
    if (form.controls.stormDamage.value !== true &&
      form.controls.landslideDamage.value !== true &&
      form.controls.otherDamage.value !== true &&
      form.controls.floodDamage.value !== true) {
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
    return this.propertyDamageForm.controls;
  }

  ngOnDestroy(): void {
    this.propertyDamageForm$.unsubscribe();
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


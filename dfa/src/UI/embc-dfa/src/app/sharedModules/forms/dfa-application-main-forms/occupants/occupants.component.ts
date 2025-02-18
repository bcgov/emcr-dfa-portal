import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { ApplicantOption, SecondaryApplicantTypeOption } from 'src/app/core/api/models';
import { MatSelectModule } from '@angular/material/select';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { FullTimeOccupantService, OtherContactService, SecondaryApplicantService } from 'src/app/core/api/services';
import { DFADeleteConfirmDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { SecondaryApplicantWarningDialogComponent } from '../../../../core/components/dialog-components/secondary-applicant-warning-dialog/secondary-applicant-warning-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IMaskModule } from 'angular-imask';

@Component({
  selector: 'app-occupants',
  templateUrl: './occupants.component.html',
  styleUrls: ['./occupants.component.scss']
})
export default class OccupantsComponent implements OnInit, OnDestroy {
  fullTimeOccupantsForm: UntypedFormGroup;
  fullTimeOccupantsForm$: Subscription;
  otherContactsForm: UntypedFormGroup;
  otherContactsForm$: Subscription;
  secondaryApplicantsForm: UntypedFormGroup;
  secondaryApplicantsForm$: Subscription;
  selectApplicantTypeOptions = SecondaryApplicantTypeOption;
  formBuilder: UntypedFormBuilder;
  formCreationService: FormCreationService;
  showFullTimeOccupantForm: boolean = false;
  fullTimeOccupantsColumnsToDisplay = ['name', 'relationship', 'deleteIcon'];
  fullTimeOccupantsDataSource = new BehaviorSubject([]);
  fullTimeOccupantsData = [];
  showOtherContactForm: boolean = false;
  otherContactsColumnsToDisplay = ['name', 'phoneNumber', 'email', 'deleteIcon'];
  otherContactsDataSource = new BehaviorSubject([]);
  otherContactsData = [];
  otherContactsEditIndex: number;
  otherContactsRowEdit = false;
  otherContactsEditFlag = false;
  otherContactText = 'New Other Contact';
  showSecondaryApplicantForm: boolean = false;
  secondaryApplicantsColumnsToDisplay = ['applicantType', 'name', 'phoneNumber', 'email', 'deleteIcon'];
  secondaryApplicantsDataSource = new BehaviorSubject([]);
  secondaryApplicantsData = [];
  vieworedit: string = "";
  contactonly: string = "";
  public ApplicantOptions = ApplicantOption;
  isHomeowner: boolean = false;
  isResidentialTenant: boolean = false;
  isSmallBusinessOwner: boolean = false;
  isCharitableOrganization: boolean = false;
  isFarmOwner: boolean = false;
  onlyOccupantInHome: boolean = false;
  disableOnlyOccupant: boolean = false;
  hideOccupantButton: boolean = false;
  onlyOtherContact: boolean = false;
  disableOnlyOtherContact: boolean = false;
  hideOtherContactButton: boolean = false;
  readonly phoneMask = "000-000-0000";

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private secondaryApplicantsService: SecondaryApplicantService,
    private otherContactsService: OtherContactService,
    private fullTimeOccupantsService: FullTimeOccupantService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();
    this.contactonly = this.dfaApplicationMainDataService.getContactOnlyView();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.vieworedit = vieworedit;
    })
    
  }

  ngOnInit(): void {
    this.fullTimeOccupantsForm$ = this.formCreationService
      .getFullTimeOccupantsForm()
      .subscribe((fullTimeOccupants) => {
        this.fullTimeOccupantsForm = fullTimeOccupants;
        this.dfaApplicationMainDataService.getDfaApplicationStart().subscribe(application => {
          if (application) {
            this.isResidentialTenant = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.ResidentialTenant)]);
            this.isHomeowner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.Homeowner)]);
            this.isSmallBusinessOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
            this.isFarmOwner = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.FarmOwner)]);
            this.isCharitableOrganization = (application.appTypeInsurance.applicantOption == Object.keys(this.ApplicantOptions)[Object.values(this.ApplicantOptions).indexOf(this.ApplicantOptions.CharitableOrganization)]);
            if (this.isHomeowner || this.isResidentialTenant) this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators([Validators.required]);
            else this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators(null);

            this.fullTimeOccupantsForm
              .get('fullTimeOccupants')
              .updateValueAndValidity();

            this.onlyOccupantInHome = this.dfaApplicationMainDataService.getIsOnlyOccupantInHome();
            this.onlyOtherContact = this.dfaApplicationMainDataService.getIsOnlyOtherContact();
            
            setTimeout(
              function () {
                this.onlyOccupantInHome = this.dfaApplicationMainDataService.getIsOnlyOccupantInHome();
                this.onlyOtherContact = this.dfaApplicationMainDataService.getIsOnlyOtherContact();
                this.hideOccupantButton = this.onlyOccupantInHome;
                this.hideOtherContactButton = this.onlyOtherContact;

                if (this.isHomeowner || this.isResidentialTenant)
                  this.fullTimeOccupantsForm.get('onlyOccupantInHome').setValue(this.onlyOccupantInHome);

                this.otherContactsForm.get('onlyOtherContact').setValue(this.onlyOtherContact);
                this.otherContactsForm.get('onlyOtherContact').updateValueAndValidity();

                if (this.isHomeowner || this.isResidentialTenant) {
                  this.updateFullTimeOccupantOnlyOccupantInHome(this.onlyOccupantInHome);
                }

                this.updateOnlyOtherContact(this.onlyOtherContact);
              }.bind(this),
              1000
            );
            
          }
          });
      });
      
    this.fullTimeOccupantsForm
      .get('onlyOccupantInHome')
      .valueChanges.subscribe((value) =>
        this.updateFullTimeOccupantOnlyOccupantInHome(value)
    );
    
    this.fullTimeOccupantsForm
      .get('addNewFullTimeOccupantIndicator')
      .valueChanges.subscribe((value) => this.updateFullTimeOccupantOnVisibility());
    this.getFullTimeOccupantsForApplication(this.dfaApplicationMainDataService.getApplicationId());

    this.otherContactsForm$ = this.formCreationService
      .getOtherContactsForm()
      .subscribe((otherContacts) => {
        this.otherContactsForm = otherContacts;
      });

    this.otherContactsForm
      .get('onlyOtherContact')
      .valueChanges.subscribe((value) =>
        this.updateOnlyOtherContact(value)
      );

    this.otherContactsForm
      .get('addNewOtherContactIndicator')
      .valueChanges.subscribe((value) => this.updateOtherContactOnVisibility());
    this.getOtherContactsForApplication(this.dfaApplicationMainDataService.getApplicationId());

    this.secondaryApplicantsForm$ = this.formCreationService
      .getSecondaryApplicantsForm()
      .subscribe((secondaryApplicants) => {
        this.secondaryApplicantsForm = secondaryApplicants;
      });

    this.secondaryApplicantsForm
      .get('addNewSecondaryApplicantIndicator')
      .valueChanges.subscribe((value) => this.updateSecondaryApplicantOnVisibility());
    this.getSecondaryApplicantsForApplication(this.dfaApplicationMainDataService.getApplicationId());

    if (this.vieworedit === 'view'
      || this.vieworedit === 'edit'
      || this.vieworedit === 'viewOnly') {
        this.secondaryApplicantsForm.disable();
      this.fullTimeOccupantsForm.disable();
      this.disableOnlyOccupant = true;
      //this.disableOnlyOtherContact = true;
      }

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.secondaryApplicantsForm.disable();
    }

    this.fullTimeOccupantsForm.get('onlyOccupantInHome').setValue(this.onlyOccupantInHome);
    this.otherContactsForm.get('onlyOtherContact').setValue(this.onlyOtherContact);
    this.otherContactsForm.get('onlyOtherContact').updateValueAndValidity();
  }
  
  onChecked(e) {
    if (e.checked) {
      this.hideOccupantButton = true;
      this.fullTimeOccupantsForm.get('onlyOccupantInHome').setValue(true);
    } else {
      this.hideOccupantButton = false;
      this.fullTimeOccupantsForm.get('onlyOccupantInHome').setValue(false);
    }

  }

  onCheckedNoOtherContact(e) {
    if (e.checked) {
      this.hideOtherContactButton = true;
      this.otherContactsForm.get('onlyOtherContact').setValue(true);
      this.otherContactsForm
      .get('otherContacts')
      .updateValueAndValidity();
    } else {
      this.hideOtherContactButton = false;
      this.otherContactsForm.get('onlyOtherContact').setValue(false);
      this.otherContactsForm
      .get('otherContacts')
      .updateValueAndValidity();
    }

  }

  getSecondaryApplicantsForApplication(applicationId: string) {

    if (applicationId === undefined) {
      applicationId = this.dfaApplicationMainDataService.getApplicationId();
    }

    this.secondaryApplicantsService.secondaryApplicantGetSecondaryApplicants({applicationId: applicationId}).subscribe({
      next: (secondaryApplicants) => {
        this.secondaryApplicantsData = secondaryApplicants;
        this.secondaryApplicantsDataSource.next(this.secondaryApplicantsData);
        this.secondaryApplicantsForm.get('secondaryApplicants').setValue(this.secondaryApplicantsData);
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  getOtherContactsForApplication(applicationId: string) {

    if (applicationId === undefined) {
      applicationId = this.dfaApplicationMainDataService.getApplicationId();
    }

    this.otherContactsService.otherContactGetOtherContacts({applicationId: applicationId}).subscribe({
      next: (otherContacts) => {
        this.otherContactsData = otherContacts;
        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
        this.disableOnlyOtherContact = this.otherContactsDataSource.getValue().length > 0
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  getFullTimeOccupantsForApplication(applicationId: string) {
    
    if (applicationId === undefined) {
      applicationId = this.dfaApplicationMainDataService.getApplicationId();
    }

    this.fullTimeOccupantsService.fullTimeOccupantGetFullTimeOccupants({applicationId: applicationId}).subscribe({
      next: (fullTimeOccupants) => {
        this.fullTimeOccupantsData = fullTimeOccupants;
        this.fullTimeOccupantsDataSource.next(this.fullTimeOccupantsData);
        this.fullTimeOccupantsForm.get('fullTimeOccupants').setValue(this.fullTimeOccupantsData);
        this.disableOnlyOccupant = this.fullTimeOccupantsDataSource.getValue().length > 0
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  addFullTimeOccupant(): void {
    this.fullTimeOccupantsForm.get('fullTimeOccupant').reset();
    this.showFullTimeOccupantForm = !this.showFullTimeOccupantForm;
    this.fullTimeOccupantsForm.get('addNewFullTimeOccupantIndicator').setValue(true);
    this.fullTimeOccupantsForm.get('fullTimeOccupant.deleteFlag').setValue(false);
    this.fullTimeOccupantsForm.get('fullTimeOccupant.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    this.disableOnlyOccupant = true;
  }

  saveFullTimeOccupants(): void {
    if (this.fullTimeOccupantsForm.get('fullTimeOccupant').status === 'VALID') {
      this.fullTimeOccupantsService.fullTimeOccupantUpsertDeleteFullTimeOccupant({body: this.fullTimeOccupantsForm.get('fullTimeOccupant').getRawValue()}).subscribe({
        next: (fullTimeOccupantId) => {
        this.fullTimeOccupantsForm.get('fullTimeOccupant').get('id').setValue(fullTimeOccupantId);
        this.fullTimeOccupantsData.push(this.fullTimeOccupantsForm.get('fullTimeOccupant').value);
        this.fullTimeOccupantsDataSource.next(this.fullTimeOccupantsData);
        this.fullTimeOccupantsForm.get('fullTimeOccupants').setValue(this.fullTimeOccupantsData);
        this.showFullTimeOccupantForm = !this.showFullTimeOccupantForm;
        this.disableOnlyOccupant = this.fullTimeOccupantsDataSource.getValue().length > 0
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    } else {
      this.fullTimeOccupantsForm.get('fullTimeOccupant').markAllAsTouched();
    }
  }

  cancelFullTimeOccupants(): void {
    this.showFullTimeOccupantForm = !this.showFullTimeOccupantForm;
    this.fullTimeOccupantsForm.get('addNewFullTimeOccupantIndicator').setValue(false);
    this.disableOnlyOccupant = this.fullTimeOccupantsDataSource.getValue().length > 0
  }

  deleteFullTimeOccupantRow(index: number): void {
    this.fullTimeOccupantsData[index].deleteFlag = true;
    this.fullTimeOccupantsService.fullTimeOccupantUpsertDeleteFullTimeOccupant({body: this.fullTimeOccupantsData[index]}).subscribe({
      next: (result) => {
        this.fullTimeOccupantsData.splice(index, 1);
        this.fullTimeOccupantsDataSource.next(this.fullTimeOccupantsData);
        this.fullTimeOccupantsForm.get('fullTimeOccupants').setValue(this.fullTimeOccupantsData);
        this.disableOnlyOccupant = this.showFullTimeOccupantForm
        if (this.fullTimeOccupantsData.length === 0) {
          this.fullTimeOccupantsForm
            .get('addNewFullTimeOccupantIndicator')
            .setValue(false);
        }
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  addOtherContact(): void {
    this.otherContactText = 'New Other Contact'
    this.otherContactsForm.get('otherContact').reset();
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
    this.otherContactsForm.get('otherContact.deleteFlag').setValue(false);
    this.otherContactsForm.get('otherContact.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    this.disableOnlyOtherContact = true;
  }

  saveOtherContact(): void {
    if (this.otherContactsForm.get('otherContact').status === 'VALID') {
      if (this.otherContactsEditIndex !== undefined && this.otherContactsRowEdit) {
        this.otherContactsService.otherContactUpsertDeleteOtherContact({ body: this.otherContactsForm.get('otherContact').getRawValue() }).subscribe({
          next: (result) => {
            this.otherContactsData[this.otherContactsEditIndex] = this.otherContactsForm.get('otherContact').value;
            this.otherContactsRowEdit = !this.otherContactsRowEdit;
            this.otherContactsEditIndex = undefined;
            this.otherContactsDataSource.next(this.otherContactsData);
            this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
            this.showOtherContactForm = !this.showOtherContactForm;
            this.otherContactsEditFlag = !this.otherContactsEditFlag;
            this.disableOnlyOtherContact = this.otherContactsDataSource.getValue().length > 0
          },
          error: (error) => {
            console.error(error);
            document.location.href = 'https://dfa.gov.bc.ca/error.html';
          }
        });
      } else {
        this.otherContactsService.otherContactUpsertDeleteOtherContact({ body: this.otherContactsForm.get('otherContact').getRawValue() }).subscribe({
          next: (otherContactId) => {
            this.otherContactsForm.get('otherContact').get('id').setValue(otherContactId);
            this.otherContactsData.push(this.otherContactsForm.get('otherContact').value);
            this.otherContactsDataSource.next(this.otherContactsData);
            this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
            this.showOtherContactForm = !this.showOtherContactForm;
            this.disableOnlyOtherContact = this.otherContactsDataSource.getValue().length > 0
          },
          error: (error) => {
            console.error(error);
            document.location.href = 'https://dfa.gov.bc.ca/error.html';
          }
        });
      }
    } else {
      this.otherContactsForm.get('otherContact').markAllAsTouched();
    }
  }

  cancelOtherContact(): void {
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(false);
    this.otherContactText = 'New Other Contact'
    this.disableOnlyOtherContact = this.otherContactsDataSource.getValue().length > 0
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
    this.otherContactsData[index].deleteFlag = true;
    this.otherContactsService.otherContactUpsertDeleteOtherContact({body: this.otherContactsData[index]}).subscribe({
      next: (result) => {
        this.otherContactsData.splice(index, 1);
        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);
        this.disableOnlyOtherContact = this.showOtherContactForm
        if (this.otherContactsData.length === 0) {
          this.otherContactsForm
            .get('addNewOtherContactIndicator')
            .setValue(false);
        }
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  addSecondaryApplicant(): void {
    if (this.secondaryApplicantsDataSource.getValue().length > 0) {
      this.dialog
        .open(SecondaryApplicantWarningDialogComponent, {
          data: {
            content: "Delete the current secondary applicant record first and then try adding new record."
          },
          width: '500px',
          disableClose: true
        })
        .afterClosed()
        .subscribe((result) => {
          
        });
    }
    else {
      this.secondaryApplicantsForm.get('secondaryApplicant').reset();
      this.showSecondaryApplicantForm = !this.showSecondaryApplicantForm;
      this.secondaryApplicantsForm.get('addNewSecondaryApplicantIndicator').setValue(true);
      this.secondaryApplicantsForm.get('secondaryApplicant.deleteFlag').setValue(false);
      this.secondaryApplicantsForm.get('secondaryApplicant.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    }
  }

  saveSecondaryApplicants(): void {
    if (this.secondaryApplicantsForm.get('secondaryApplicant').status === 'VALID') {
      this.secondaryApplicantsService.secondaryApplicantUpsertDeleteSecondaryApplicant({body: this.secondaryApplicantsForm.get('secondaryApplicant').getRawValue()}).subscribe({
        next: (secondaryApplicantId) => {
          this.secondaryApplicantsForm.get('secondaryApplicant').get('id').setValue(secondaryApplicantId);
          this.secondaryApplicantsData.push(this.secondaryApplicantsForm.get('secondaryApplicant').value);
          this.secondaryApplicantsDataSource.next(this.secondaryApplicantsData);
          this.secondaryApplicantsForm.get('secondaryApplicants').setValue(this.secondaryApplicantsData);
          this.showSecondaryApplicantForm = !this.showSecondaryApplicantForm;
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      this.secondaryApplicantsForm.get('secondaryApplicant').markAllAsTouched();
    }
  }

  cancelSecondaryApplicants(): void {
    this.showSecondaryApplicantForm = !this.showSecondaryApplicantForm;
    this.secondaryApplicantsForm.get('addNewSecondaryApplicantIndicator').setValue(false);
  }

  deleteSecondaryApplicantRow(index: number): void {
    this.secondaryApplicantsData[index].deleteFlag = true;
    this.secondaryApplicantsService.secondaryApplicantUpsertDeleteSecondaryApplicant({body: this.secondaryApplicantsData[index]}).subscribe({
      next: (result) => {
          this.secondaryApplicantsData.splice(index, 1);
          this.secondaryApplicantsDataSource.next(this.secondaryApplicantsData);
          this.secondaryApplicantsForm.get('secondaryApplicants').setValue(this.secondaryApplicantsData);
          if (this.secondaryApplicantsData.length === 0) {
            this.secondaryApplicantsForm
            .get('addNewSecondaryApplicantIndicator')
            .setValue(false);
          }
      },
      error: (error) => {
        console.error(error);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  updateFullTimeOccupantOnlyOccupantInHome(value): void {
    value == true ?
      this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators(null) :
      this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators([Validators.required]);
    this.dfaApplicationMainDataService.setIsOnlyOccupantInHome(value);

    this.fullTimeOccupantsForm
      .get('fullTimeOccupants')
      .updateValueAndValidity();
  }

  updateOnlyOtherContact(value): void {
    value == true ?
      this.otherContactsForm.get('otherContacts').setValidators(null) :
      this.otherContactsForm.get('otherContacts').setValidators([Validators.required]);
    this.dfaApplicationMainDataService.setIsOnlyOtherContact(value);

    this.otherContactsForm
      .get('otherContacts')
      .updateValueAndValidity();
  }

  updateFullTimeOccupantOnVisibility(): void {
    this.fullTimeOccupantsForm
      .get('fullTimeOccupant.firstName')
      .updateValueAndValidity();
    this.fullTimeOccupantsForm
      .get('fullTimeOccupant.lastName')
      .updateValueAndValidity();
    this.fullTimeOccupantsForm
      .get('fullTimeOccupant.relationship')
      .updateValueAndValidity();
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

  updateSecondaryApplicantOnVisibility(): void {
    this.secondaryApplicantsForm
      .get('secondaryApplicant.applicantType')
      .updateValueAndValidity();
    this.secondaryApplicantsForm
      .get('secondaryApplicant.firstName')
      .updateValueAndValidity();
    this.secondaryApplicantsForm
      .get('secondaryApplicant.lastName')
      .updateValueAndValidity();
    this.secondaryApplicantsForm
      .get('secondaryApplicant.phoneNumber')
      .updateValueAndValidity();
    this.secondaryApplicantsForm
      .get('secondaryApplicant.email')
      .updateValueAndValidity();
  }

  confirmDeleteOtherContactRow(index: number): void {
    this.deleteOtherContactRow(index);
  }

  /**
   * Returns the control of the form
   */
  get fullTimeOccupantsFormControl(): { [key: string]: AbstractControl } {
    return this.fullTimeOccupantsForm.controls;
  }
  get otherContactsFormControl(): { [key: string]: AbstractControl } {
    return this.otherContactsForm.controls;
  }
  get secondaryApplicantsFormControl(): { [key: string]: AbstractControl } {
    return this.secondaryApplicantsForm.controls;
  }

  ngOnDestroy(): void {
    this.fullTimeOccupantsForm$.unsubscribe();
    this.otherContactsForm$.unsubscribe();
    this.secondaryApplicantsForm$.unsubscribe();
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    IMaskModule,
    CustomPipeModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatCheckboxModule
  ],
  declarations: [OccupantsComponent]
})
class OccupantsModule {}

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { BehaviorSubject, Subject, Subscription, take, takeUntil } from 'rxjs';
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
import { ApplicationService, FullTimeOccupantService, OtherContactService, SecondaryApplicantService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { SecondaryApplicantWarningDialogComponent } from '../../../../core/components/dialog-components/secondary-applicant-warning-dialog/secondary-applicant-warning-dialog.component';
import { IMaskModule } from 'angular-imask';

@Component({
  selector: 'app-occupants',
  standalone: true,
  templateUrl: './occupants.component.html',
  styleUrls: ['./occupants.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    IMaskModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    CustomPipeModule,
    DirectivesModule
  ]
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
    private applicationService: ApplicationService,
    private fullTimeOccupantsService: FullTimeOccupantService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;

    this.vieworedit = this.dfaApplicationMainDataService.getViewOrEdit();
    this.contactonly = this.dfaApplicationMainDataService.getContactOnlyView();

    this.dfaApplicationMainDataService.changeViewOrEdit
      .pipe(takeUntil(this.destroy$))
      .subscribe((vieworedit) => {
      this.vieworedit = vieworedit;
    });
  }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.newApplicationRemoveCache();

    // Call the API manually and wait for it to finish
    this.dfaApplicationMainDataService
    .loadApplicationById(this.dfaApplicationMainDataService.getApplicationId())
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.initFullTimeOccupantsForm();
        this.initOtherContactsForm();
        this.initSecondaryApplicantsForm();
        this.applyViewModePermissions();
      },
      error: (err) => {
        console.error('Error loading application', err);
        document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
  }

  private newApplicationRemoveCache(): void {
    const mode = this.vieworedit || this.dfaApplicationMainDataService.getViewOrEdit();
    if (!mode || mode === 'add') {
      // Only reset cache and in-memory state for new applications
      this.dfaApplicationMainDataService.resetApplicationState();
    }
  }

  private initFullTimeOccupantsForm(): void {
    this.fullTimeOccupantsForm$ = this.formCreationService
      .getFullTimeOccupantsForm()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fullTimeOccupants) => {
        this.fullTimeOccupantsForm = fullTimeOccupants;
        this.dfaApplicationMainDataService.getDfaApplicationStart()
          .pipe(takeUntil(this.destroy$))
          .subscribe(application => {
            if (application && application.appTypeInsurance) {
              const option = application.appTypeInsurance.applicantOption;
              const keys = Object.keys(this.ApplicantOptions);
              const values = Object.values(this.ApplicantOptions);
    
              this.isResidentialTenant = (option == keys[values.indexOf(this.ApplicantOptions.ResidentialTenant)]);
              this.isHomeowner = (option == keys[values.indexOf(this.ApplicantOptions.Homeowner)]);
              this.isSmallBusinessOwner = (option == keys[values.indexOf(this.ApplicantOptions.SmallBusinessOwner)]);
              this.isFarmOwner = (option == keys[values.indexOf(this.ApplicantOptions.FarmOwner)]);
              this.isCharitableOrganization = (option == keys[values.indexOf(this.ApplicantOptions.CharitableOrganization)]);
    
              if (this.isHomeowner || this.isResidentialTenant) {
                this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators([Validators.required]);
              } else {
                this.fullTimeOccupantsForm.get('fullTimeOccupants').setValidators(null);
              }
    
              this.fullTimeOccupantsForm.get('fullTimeOccupants').updateValueAndValidity();
              this.onlyOccupantInHome = this.dfaApplicationMainDataService.getIsOnlyOccupantInHome();
              this.hideOccupantButton = this.onlyOccupantInHome;
            
              if (this.isHomeowner || this.isResidentialTenant) {
                const onlyOccupantCtrl = this.fullTimeOccupantsForm.get('onlyOccupantInHome');
                if (onlyOccupantCtrl && onlyOccupantCtrl.enabled) {
                  onlyOccupantCtrl.setValue(this.onlyOccupantInHome);
                  this.updateFullTimeOccupantOnlyOccupantInHome(this.onlyOccupantInHome);
                }
              }
            }
        });
        this.fullTimeOccupantsForm.get('onlyOccupantInHome')
          .valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((value) => this.updateFullTimeOccupantOnlyOccupantInHome(value));

        this.fullTimeOccupantsForm.get('addNewFullTimeOccupantIndicator')
          .valueChanges
          .pipe(takeUntil(this.destroy$)).subscribe(() => this.updateFullTimeOccupantOnVisibility());

        this.getFullTimeOccupantsForApplication(this.dfaApplicationMainDataService.getApplicationId());
      });
    
    
  }

  private initSecondaryApplicantsForm() {
    this.secondaryApplicantsForm$ = this.formCreationService.getSecondaryApplicantsForm()
    .pipe(takeUntil(this.destroy$))
    .subscribe(form => {
      this.secondaryApplicantsForm = form;
      this.secondaryApplicantsForm
        .get('addNewSecondaryApplicantIndicator')
        .valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateSecondaryApplicantOnVisibility());
        this.getSecondaryApplicantsForApplication(this.dfaApplicationMainDataService.getApplicationId());
    });
  }
  
  private initOtherContactsForm() {
    this.otherContactsForm$ = this.formCreationService.getOtherContactsForm()
      .pipe(takeUntil(this.destroy$))
      .subscribe(form => {
        this.otherContactsForm = form;

        // Always get the current value from the service — don't rely on form's initial state
        const onlyOtherContactValue = this.dfaApplicationMainDataService.getIsOnlyOtherContact();
        const onlyOtherContactCtrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');

        // Enable the checkbox if we’re going to show it
        const shouldDisable = this.shouldDisableOnlyOtherContact();
        this.disableOnlyOtherContact = shouldDisable;

        if (onlyOtherContactCtrl) {
          if (shouldDisable) {
            onlyOtherContactCtrl.disable({ emitEvent: false });
          } else {
            onlyOtherContactCtrl.enable({ emitEvent: false });
            onlyOtherContactCtrl.setValue(onlyOtherContactValue, { emitEvent: false });
          }
        }
        
        // Sync component property and apply validators based on checkbox state
        this.onlyOtherContact = onlyOtherContactValue;
        this.hideOtherContactButton = onlyOtherContactValue;
        this.updateOnlyOtherContact(onlyOtherContactValue);

        // Watch for future changes to onlyOtherContact and update dynamically
        this.otherContactsForm.get('contactDetails.onlyOtherContact')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(value => {
            this.onlyOtherContact = value;
            this.hideOtherContactButton = value;
            this.updateOnlyOtherContact(value);
          });
  
        // Also handle visibility logic when this other control changes
        this.otherContactsForm.get('addNewOtherContactIndicator')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.updateOtherContactOnVisibility();
          });

        // Load any saved contacts from the service
        this.getOtherContactsForApplication(this.dfaApplicationMainDataService.getApplicationId());
    }); 
  }
  
  private applyViewModePermissions() {
    const mode = this.vieworedit || this.dfaApplicationMainDataService.getViewOrEdit();
  
    if (['view', 'edit', 'viewOnly'].includes(mode)) {
      this.secondaryApplicantsForm?.disable();
      this.fullTimeOccupantsForm?.disable();
      this.disableOnlyOccupant = true;
      this.disableOnlyOtherContact = true;
    }
  
    if (mode === 'viewOnly') {
      this.secondaryApplicantsForm?.disable();
    }
  }

  onChecked(e): void {
    const checked = e.checked === true;
    this.hideOccupantButton = checked;
    this.fullTimeOccupantsForm.get('onlyOccupantInHome')?.setValue(checked);
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
    if (!applicationId) {
      applicationId = this.dfaApplicationMainDataService.getApplicationId();
    }

    this.otherContactsService.otherContactGetOtherContacts({applicationId: applicationId})
      .subscribe({
        next: (otherContacts) => {
          this.otherContactsData = otherContacts;
          this.otherContactsDataSource.next(this.otherContactsData);
          
          // Ensure the control exists before setting the value
          const otherContactsCtrl = this.otherContactsForm.get('otherContacts');
          if (otherContactsCtrl) {
            otherContactsCtrl.setValue(this.otherContactsData);
          } else {
            console.error("Form control 'otherContacts' not found.");
          }

          this.updateOnlyOtherContactState();

          // Apply validator logic only after data is loaded and form is populated
          const onlyOtherContactCtrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
          if (onlyOtherContactCtrl) {
            const formValue = onlyOtherContactCtrl.value;
            this.onlyOtherContact = formValue;
            this.updateOnlyOtherContact(formValue);
          }
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

    this.fullTimeOccupantsService.fullTimeOccupantGetFullTimeOccupants({applicationId: applicationId})
      .subscribe({
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
      this.fullTimeOccupantsService.fullTimeOccupantUpsertDeleteFullTimeOccupant({body: this.fullTimeOccupantsForm.get('fullTimeOccupant').getRawValue()})
        .subscribe({
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
      next: () => {
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
    this.otherContactsForm.get('contactDetails').reset();
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
    this.otherContactsForm.get('contactDetails.deleteFlag').setValue(false);
    this.otherContactsForm.get('contactDetails.applicationId').setValue(this.dfaApplicationMainDataService.getApplicationId());
    this.dfaApplicationMainDataService.setIsOnlyOtherContact(false);
    this.otherContactsForm.get('contactDetails.onlyOtherContact').setValue(false);

    // Disable the 'onlyOtherContact' checkbox when adding a new contact
    const onlyOtherContactCtrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
    if (onlyOtherContactCtrl && onlyOtherContactCtrl.enabled) {
      onlyOtherContactCtrl.disable({ emitEvent: false });
      this.disableOnlyOtherContact = true; // keep UI state consistent
    }
  }

  saveOtherContact(): void {
    const contactDetails = this.otherContactsForm.get('contactDetails');
    if (contactDetails?.status !== 'VALID') {
      contactDetails?.markAllAsTouched();
      return;
    }

    // Ensure onlyOtherContact is enabled before saving
    const onlyOtherContactCtrl = contactDetails.get('onlyOtherContact');
    if (onlyOtherContactCtrl && onlyOtherContactCtrl.disabled) {
      onlyOtherContactCtrl.enable({ emitEvent: false });
    }
  
    const afterSave = () => {
      this.showOtherContactForm = false;
      this.updateOnlyOtherContactState();

      // Reset onlyOtherContact to false after saving
      if (onlyOtherContactCtrl && onlyOtherContactCtrl.value !== false) {
        onlyOtherContactCtrl.setValue(false, { emitEvent: false });
      }
    };
  
    const rawContactData = contactDetails.getRawValue();

    // Ensure onlyOtherContact is explicitly set
    const contactData = {
      ...rawContactData,
      onlyOtherContact: onlyOtherContactCtrl?.value ?? false
    };
  
    if (this.otherContactsEditIndex !== undefined && this.otherContactsRowEdit) {
      // Update/Edit existing
      this.otherContactsService.otherContactUpsertDeleteOtherContact({ body: contactData }).subscribe({
        next: () => {
          // Update the row
          this.otherContactsData[this.otherContactsEditIndex!] = { ...contactDetails.value };
          this.otherContactsRowEdit = false;
          this.otherContactsEditIndex = undefined;
  
          this.otherContactsDataSource.next(this.otherContactsData);
          this.otherContactsForm.get('otherContacts')?.setValue(this.otherContactsData);
  
          this.otherContactsEditFlag = false;
          afterSave();
        },
        error: (error) => {
          console.error(error);
          document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    } else {
      // Create new contact
      // First ensure 'onlyOtherContact' is false when adding any contact
      const onlyOtherContactCtrl = contactDetails.get('onlyOtherContact');
      if (onlyOtherContactCtrl) {
        onlyOtherContactCtrl.enable({ emitEvent: false });
        onlyOtherContactCtrl.setValue(false, { emitEvent: false });
        this.dfaApplicationMainDataService.setIsOnlyOtherContact(false);
      }
      
      const contactData = contactDetails.getRawValue();

      this.otherContactsService.otherContactUpsertDeleteOtherContact({ body: contactData })
        .subscribe({
          next: (otherContactId) => {
            contactDetails.get('id')?.setValue(otherContactId);
    
            // Push a deep copy to avoid shared reference issues
            const newContact = { ...contactDetails.value };
            this.otherContactsData.push(newContact);
    
            this.otherContactsDataSource.next(this.otherContactsData);
            this.otherContactsForm.get('otherContacts')?.setValue(this.otherContactsData);
    
            afterSave();
          },
          error: (error) => {
            console.error(error);
            document.location.href = 'https://dfa.gov.bc.ca/error.html';
          }
      });
    }
  }
  
  private updateOnlyOtherContactState(): void {
    this.disableOnlyOtherContact = this.shouldDisableOnlyOtherContact();
    const ctrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
    if (ctrl) {
      if (this.disableOnlyOtherContact) {
        ctrl.disable({ emitEvent: false });
      } else {
        ctrl.enable({ emitEvent: false });
      }
      this.updateOnlyOtherContact(ctrl.value);
    }
  }

  cancelOtherContact(): void {
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(false);
    this.otherContactText = 'New Other Contact'

    const shouldDisable = this.shouldDisableOnlyOtherContact();
    const onlyOtherContactCtrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
  
    if (onlyOtherContactCtrl) {
      shouldDisable
        ? onlyOtherContactCtrl.disable({ emitEvent: false })
        : onlyOtherContactCtrl.enable({ emitEvent: false });

      // Update shared state after cancel
      this.dfaApplicationMainDataService.setIsOnlyOtherContact(onlyOtherContactCtrl.value);
    }
  
    this.disableOnlyOtherContact = shouldDisable;
  }

  editOtherContactsRow(element, index): void {
    this.otherContactText = 'Edit Other Contact'
    this.otherContactsEditIndex = index;
    this.otherContactsRowEdit = !this.otherContactsRowEdit;
    this.otherContactsForm.get('contactDetails').setValue(element);
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsEditFlag = !this.otherContactsEditFlag;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
  }

  deleteOtherContactRow(index: number): void {
    this.otherContactsData[index].deleteFlag = true;
    this.otherContactsService.otherContactUpsertDeleteOtherContact({body: this.otherContactsData[index]})
      .subscribe({
        next: () => {
          this.otherContactsData.splice(index, 1);
          this.otherContactsDataSource.next(this.otherContactsData);
          this.otherContactsForm.get('otherContacts').setValue(this.otherContactsData);

          this.updateOnlyOtherContactState();

          if (this.otherContactsData.length === 0) {
            this.otherContactsForm
              .get('addNewOtherContactIndicator')
              .setValue(false);

            const ctrl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
            if (ctrl) {
              // Enable first if disabled (so setValue works)
              if (ctrl.disabled) {
                ctrl.enable({ emitEvent: false });
              }
              ctrl.setValue(false, { emitEvent: false });
            }
            this.onlyOtherContact = false;
            this.hideOtherContactButton = false;
            this.dfaApplicationMainDataService.setIsOnlyOtherContact(false);
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
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          
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
      next: () => {
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

  updateOnlyOtherContact(value: boolean): void {
    if (!this.otherContactsForm) {
      // otherContactsForm is not initialized when updateOnlyOtherContact() is called
      return;
    }
  
    const otherContactsControl = this.otherContactsForm.get('otherContacts');
    const onlyOtherContactControl = this.otherContactsForm.get('contactDetails.onlyOtherContact');
    if (!otherContactsControl || !onlyOtherContactControl) {
      // otherContacts control is missing in the form
      return;
    }
  
    if (value === true || this.hideOtherContactButton === true) {
      // No contact required if checkbox checked OR UI is hidden
      otherContactsControl.setValidators(null);
    } else {
      otherContactsControl.setValidators([Validators.required]);
    }
  
    this.dfaApplicationMainDataService.setIsOnlyOtherContact(value);
    otherContactsControl.updateValueAndValidity();
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
      .get('contactDetails.firstName')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('contactDetails.lastName')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('contactDetails.phoneNumber')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('contactDetails.email')
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

  private shouldDisableOnlyOtherContact(): boolean {
    return this.otherContactsDataSource.getValue().length > 0;
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}

class OccupantsModule {}

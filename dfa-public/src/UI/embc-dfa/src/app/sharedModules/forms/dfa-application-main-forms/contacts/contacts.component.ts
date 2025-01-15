import {
  Component,
  OnInit,
  NgModule,
  Inject,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { MatTableModule } from '@angular/material/table';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { DFADeleteConfirmDialogComponent } from '../../../../core/components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import {
  NgxMaskDirective,
  NgxMaskPipe,
  NgxMaskService,
  provideNgxMask
} from 'ngx-mask';
import {
  ApplicationService,
  OtherContactService
} from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { MatSelectModule } from '@angular/material/select';
import { ContactService } from 'src/app/core/api/services';
import { LoginService } from 'src/app/core/services/login.service';
import { BCeIdLookupService } from 'src/app/core/api/services/b-ce-id-lookup.service';
import { BCeIdBusiness } from 'src/app/core/api/models/b-ce-id-business';
import { MatIconModule } from '@angular/material/icon';
import { ContactNotFoundComponent } from './contact-not-found.component';
import { AddressFormsModule } from '../../address-forms/address-forms.module';
import { CacheService } from 'src/app/core/services/cache.service';
import { guid } from '@progress/kendo-angular-common';
import { BceidUserData } from 'src/app/core/api/models/bceid-user-data';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export default class ContactsComponent implements OnInit, OnDestroy {
  contactsForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  contactsForm$: Subscription;
  formCreationService: FormCreationService;
  isReadOnly: boolean = false;
  vieworedit: string = '';
  protected showFoundContactMsg = false;

  // 2024-09-13 EMCRI-663 waynezen;
  otherContactsForm: UntypedFormGroup;
  otherContactsForm$: Subscription;
  onlyOtherContact: boolean = false;
  disableOnlyOtherContact: boolean = false;
  hideOtherContactButton: boolean = false;
  otherContactsColumnsToDisplay = [
    'name',
    'phoneNumber',
    'email',
    'cellPhone',
    'jobTitle',
    'deleteIcon'
  ];
  otherContactsDataSource = new BehaviorSubject([]);
  otherContactsData = [];
  otherContactsDeletedData = [];
  otherContactsEditIndex: number;
  otherContactsRowEdit = false;
  otherContactsEditFlag = false;
  showOtherContactForm: boolean = false;
  @Output() stepToNavigate = new EventEmitter<number>();

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private applicationService: ApplicationService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    private otherContactsService: OtherContactService,
    private contactService: ContactService,
    private loginService: LoginService,
    private bceidLookupService: BCeIdLookupService,
    public dialog: MatDialog,
    private cacheService: CacheService
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
    this.isReadOnly = false;
    this.setViewOrEditControls();
  }

  ngOnInit(): void {
    this.contactsForm$ = this.formCreationService
      .getContactsForm()
      .subscribe((contactDetails) => {
        contactDetails.controls.legalName.setValue(
          this.dfaApplicationMainDataService.getBusiness()
        );

        // 2024-10-05 EMCRI-804 waynezen; if brand new Application, fill in doingBusinessAs from BCeID Web Svc
        let bceidDoingBusAs: string | null = null;
        let bceidBusNumber: string | null = null;
        let appId = this.dfaApplicationMainDataService.getApplicationId();
        if (appId === null) {
          bceidDoingBusAs =
            this.dfaApplicationMainDataService.getDoingBusinessAs();
          contactDetails.controls.doingBusinessAs.setValue(bceidDoingBusAs);
          bceidBusNumber =
            this.dfaApplicationMainDataService.getBusinessNumber();
          contactDetails.controls.businessNumber.setValue(bceidBusNumber);
        }

        this.contactsForm = contactDetails;
        this.setViewOrEditControls();
        this.dfaApplicationMainDataService.contacts = {
          legalName: this.dfaApplicationMainDataService.getBusiness(),
          doingBusinessAs: null,
          businessNumber: null,
          addressLine1: null,
          addressLine2: null,
          community: null,
          city: null,
          stateProvince: null,
          postalCode: null,
          primaryContactSearch: null,
          primaryContactValidated: false,
          isDamagedAddressVerified: 'false',
          pcFirstName: null,
          pcLastName: null,
          pcDepartment: null,
          pcBusinessPhone: null,
          pcEmailAddress: null,
          pcCellPhone: null,
          pcJobTitle: null,
          pcNotes: null
        };

        // After form is initialized, fetch current user's info
        this.fetchCurrentUserInfo();
      });

    this.otherContactsForm$ = this.formCreationService
      .getOtherContactsForm()
      .subscribe((otherContacts) => {
        this.otherContactsForm = otherContacts;
        this.dfaApplicationMainDataService.otherContacts = null;
      });

    this.otherContactsForm
      .get('addNewOtherContactIndicator')
      .valueChanges.subscribe((value) => this.updateOtherContactOnVisibility());

    this.contactsForm
      .get('doingBusinessAs')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('doingBusinessAs').reset();
        }
      });

    this.contactsForm
      .get('businessNumber')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('businessNumber').reset();
        }
      });

    this.contactsForm
      .get('addressLine1')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('addressLine1').reset();
        }
      });

    this.contactsForm
      .get('community')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('community').reset();
        }
      });

    this.contactsForm
      .get('guidanceSupport')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('guidanceSupport').reset();
        }
      });

    this.contactsForm
      .get('primaryContactSearch')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.contactsForm.get('primaryContactSearch').reset();
        }
        // un-verify Primary Contact as soon as the field is changed on the screen
        if (
          value !=
          this.dfaApplicationMainDataService.contacts.primaryContactSearch
        ) {
          this.setPrimaryContactFieldsEnabled(false);
          this.dfaApplicationMainDataService.contacts.primaryContactValidated =
            false;
          this.dfaApplicationMainDataService.primaryContactValidatedEvent.emit(
            false
          );
        }
      });

    this.getContactForApplication(
      this.dfaApplicationMainDataService.getApplicationId()
    );
    this.getOtherContactsForApplication(
      this.dfaApplicationMainDataService.getApplicationId()
    );
    this.cacheService.set(
      'otherContacts',
      this.dfaApplicationMainDataService.otherContacts
    );

    if (this.dfaApplicationMainDataService.getViewOrEdit() == 'viewOnly') {
      this.contactsForm.disable();
    }
  }

  private fetchCurrentUserInfo(): void {
    this.contactService.contactGetLoginInfo().subscribe({
      next: (userData: BceidUserData) => {
        if (userData && userData.bceid_username) {
          // Auto-populate the primaryContactSearch with current user's BCeID username
          this.contactsForm
            .get('primaryContactSearch')
            .setValue(userData.bceid_username);

          // Call searchForContact to populate other fields
          this.searchForContact();
        }
      },
      error: (error) => {
        console.error('Error fetching current user info:', error);
      }
    });
  }

  setViewOrEditControls() {
    if (!this.contactsForm) return;
    if (this.isReadOnly) {
      this.contactsForm.controls.doingBusinessAs.disable();
      this.contactsForm.controls.businessNumber.disable();
      this.contactsForm.controls.addressLine1.disable();
      this.contactsForm.controls.addressLine2.disable();
      this.contactsForm.controls.city.disable();
      this.contactsForm.controls.stateProvince.disable();
      this.contactsForm.controls.postalCode.disable();
      this.contactsForm.controls.primaryContactSearch.disable();
      this.contactsForm.controls.guidanceSupport.disable();
      this.contactsForm.controls.pcFirstName.disable();
      this.contactsForm.controls.pcLastName.disable();
      this.contactsForm.controls.pcDepartment.disable();
      this.contactsForm.controls.pcBusinessPhone.disable();
      this.contactsForm.controls.pcEmailAddress.disable();
      this.contactsForm.controls.pcCellPhone.disable();
      this.contactsForm.controls.pcJobTitle.disable();
      this.contactsForm.controls.pcNotes.disable();
    } else {
      this.contactsForm.controls.doingBusinessAs.enable();
      this.contactsForm.controls.businessNumber.enable();
      this.contactsForm.controls.addressLine1.enable();
      this.contactsForm.controls.addressLine2.enable();
      this.contactsForm.controls.city.enable();
      this.contactsForm.controls.stateProvince.enable();
      this.contactsForm.controls.postalCode.enable();
      this.contactsForm.controls.primaryContactSearch.enable();
      this.contactsForm.controls.guidanceSupport.enable();
      this.contactsForm.controls.pcFirstName.enable();
      this.contactsForm.controls.pcLastName.enable();
      this.contactsForm.controls.pcDepartment.enable();
      this.contactsForm.controls.pcBusinessPhone.enable();
      this.contactsForm.controls.pcEmailAddress.enable();
      this.contactsForm.controls.pcCellPhone.enable();
      this.contactsForm.controls.pcJobTitle.enable();
      this.contactsForm.controls.pcNotes.enable();
    }
  }

  getContactForApplication(applicationId: string) {
    if (applicationId) {
      this.applicationService
        .applicationGetApplicationMain({ applicationId: applicationId })
        .subscribe({
          next: (dfaApplicationMain) => {
            // 2024-10-02 EMCRI-663 waynezen; publish event for Canada Post verified message on BcAddressComponent
            this.dfaApplicationMainDataService.setCanadaPostVerified(
              dfaApplicationMain.applicationContacts.isDamagedAddressVerified
            );

            // 2024-10-07 EMCRI-804 waynezen; don't allow editing in fields until we have a valid Primary Contact
            let allowPrimeContactEditFields =
              this.dfaApplicationMainDataService.contacts
                .primaryContactValidated;
            this.setPrimaryContactFieldsEnabled(allowPrimeContactEditFields);
            this.dfaApplicationMainDataService.primaryContactValidatedEvent.emit(
              allowPrimeContactEditFields
            );

            this.dfaApplicationMainMapping.mapDFAApplicationMainContacts(
              dfaApplicationMain
            );
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  getOtherContactsForApplication(applicationId: string) {
    if (applicationId) {
      this.otherContactsService
        .otherContactGetOtherContacts({ applicationId: applicationId })
        .subscribe({
          next: (otherContacts) => {
            this.otherContactsData = otherContacts;
            this.otherContactsDataSource.next(this.otherContactsData);
            this.otherContactsForm
              .get('otherContacts')
              .setValue(this.otherContactsData);
            this.dfaApplicationMainDataService.otherContacts =
              this.otherContactsForm.get('otherContacts').getRawValue();
            // 2024-10-11 EMCRI-809 waynezen; notify Review screen that Other Contact data has changed
            this.dfaApplicationMainDataService.otherContactsDataChangedEvent.emit(
              true
            );
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  searchForContact() {
    var userId = this.contactsForm.get('primaryContactSearch')?.value;

    if (userId) {
      this.bceidLookupService
        .bCeIdLookupGetBCeIdOtherInfo({ userId })
        .subscribe({
          next: (bceidBusiness: BCeIdBusiness) => {
            if (bceidBusiness && bceidBusiness.isValidResponse) {
              this.setPrimaryContactFieldsEnabled(true);

              // Update the data service
              this.dfaApplicationMainDataService.contacts = {
                ...this.dfaApplicationMainDataService.contacts,
                primaryContactSearch: bceidBusiness.userId,
                primaryContactValidated: true,
                pcFirstName: bceidBusiness.individualFirstname,
                pcLastName: bceidBusiness.individualSurname,
                pcDepartment: bceidBusiness.department,
                pcBusinessPhone: bceidBusiness.contactPhone,
                pcEmailAddress: bceidBusiness.contactEmail,
                pcBCeIDOrgGuid: bceidBusiness.organizationGuid,
                pcBCeIDuserGuid: bceidBusiness.userGuid
              };

              // Update form values
              this.contactsForm.patchValue({
                primaryContactSearch: bceidBusiness.userId,
                pcFirstName: bceidBusiness.individualFirstname,
                pcLastName: bceidBusiness.individualSurname,
                pcDepartment: bceidBusiness.department,
                pcBusinessPhone: bceidBusiness.contactPhone,
                pcEmailAddress: bceidBusiness.contactEmail
              });

              // Fetch additional contact info from Dynamics
              this.applicationService
                .applicationGetPrimaryContactByBCeId({
                  bceiduserguid: bceidBusiness.userGuid
                })
                .subscribe({
                  next: (contact) => {
                    if (contact) {
                      this.contactsForm.patchValue({
                        pcCellPhone: contact.pcCellPhone,
                        pcJobTitle: contact.pcJobTitle,
                        pcNotes: contact.pcNotes
                      });
                    } else {
                      this.contactsForm.patchValue({
                        pcCellPhone: '',
                        pcJobTitle: '',
                        pcNotes: ''
                      });
                    }
                  }
                });

              this.showFoundContactMsg = true;
              this.dfaApplicationMainDataService.primaryContactValidatedEvent.emit(
                true
              );
            } else {
              this.setPrimaryContactInfoBlank();
              this.dialog.open(ContactNotFoundComponent, {
                data: {},
                width: '420px',
                disableClose: true
              });
            }
          },
          error: (error) => {
            console.error('Error searching for contact:', error);
            this.setPrimaryContactInfoBlank();
          }
        });
    } else {
      this.setPrimaryContactInfoBlank();
      this.showFoundContactMsg = false;
      this.dfaApplicationMainDataService.primaryContactValidatedEvent.emit(
        false
      );
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
    this.otherContactsForm.get('otherContact.email').updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.cellPhone')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.jobTitle')
      .updateValueAndValidity();
    this.otherContactsForm
      .get('otherContact.otherNotes')
      .updateValueAndValidity();
  }

  cancelOtherContact(): void {
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(false);
  }

  validateFormCauseOfDamage(form: FormGroup) {
    if (
      form.controls.stormDamage.value !== true &&
      form.controls.landslideDamage.value !== true &&
      form.controls.otherDamage.value !== true &&
      form.controls.floodDamage.value !== true
    ) {
      return { noCauseOfDamage: true };
    }
    return null;
  }

  saveOtherContact(): void {
    if (this.otherContactsForm.get('otherContact').status === 'VALID') {
      if (
        this.otherContactsEditIndex !== undefined &&
        this.otherContactsRowEdit
      ) {
        this.otherContactsData[this.otherContactsEditIndex] =
          this.otherContactsForm.get('otherContact').value;
        this.otherContactsRowEdit = !this.otherContactsRowEdit;
        this.otherContactsEditIndex = undefined;
        this.otherContactsDeletedData = this.otherContactsData.filter(
          (m) => m.deleteFlag == true && m.id
        );

        var actualElements = this.otherContactsData.filter(
          (m) => !(m.deleteFlag == true && m.id)
        );
        this.otherContactsData = actualElements;

        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsData = this.otherContactsData.concat(
          this.otherContactsDeletedData
        );

        this.otherContactsForm
          .get('otherContacts')
          .setValue(this.otherContactsData);
        this.showOtherContactForm = !this.showOtherContactForm;
        this.otherContactsEditFlag = !this.otherContactsEditFlag;
      } else {
        this.otherContactsData.push(
          this.otherContactsForm.get('otherContact').value
        );
        this.otherContactsDeletedData = this.otherContactsData.filter(
          (m) => m.deleteFlag == true && m.id
        );

        var actualElements = this.otherContactsData.filter(
          (m) => !(m.deleteFlag == true && m.id)
        );
        this.otherContactsData = actualElements;

        this.otherContactsDataSource.next(this.otherContactsData);
        this.otherContactsData = this.otherContactsData.concat(
          this.otherContactsDeletedData
        );

        this.otherContactsForm
          .get('otherContacts')
          .setValue(this.otherContactsData);
        this.showOtherContactForm = !this.showOtherContactForm;
      }

      // 2024-10-11 EMCRI-809 waynezen; notify Review screen that Other Contact data has changed
      this.dfaApplicationMainDataService.otherContacts = this.otherContactsForm
        .get('otherContacts')
        .getRawValue();
      this.cacheService.set(
        'otherContacts',
        this.dfaApplicationMainDataService.otherContacts
      );
      this.dfaApplicationMainDataService.otherContactsDataChangedEvent.emit(
        true
      );
    } else {
      this.otherContactsForm.get('otherContact').markAllAsTouched();
    }
  }

  navigateToStep(stepIndex: number) {
    this.stepToNavigate.emit(stepIndex);
  }

  addOtherContact(): void {
    this.otherContactsForm.get('otherContact').reset();
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
    this.otherContactsForm.get('otherContact.deleteFlag').setValue(false);
    this.otherContactsForm
      .get('otherContact.applicationId')
      .setValue(this.dfaApplicationMainDataService.getApplicationId());
  }

  editOtherContactsRow(element, index): void {
    this.otherContactsEditIndex = index;
    this.otherContactsRowEdit = !this.otherContactsRowEdit;
    this.otherContactsForm.get('otherContact').setValue(element);
    this.showOtherContactForm = !this.showOtherContactForm;
    this.otherContactsEditFlag = !this.otherContactsEditFlag;
    this.otherContactsForm.get('addNewOtherContactIndicator').setValue(true);
  }

  deleteOtherContactRow(index: number): void {
    this.otherContactsDeletedData = [];
    this.otherContactsData[index].deleteFlag = true;
    var elementtoberemoved = this.otherContactsData[index];

    if (elementtoberemoved.id) {
      this.otherContactsDeletedData = this.otherContactsData.filter(
        (m) => m.deleteFlag == true && m.id
      );
      var actualElements = this.otherContactsData.filter(
        (m) => !(m.deleteFlag == true && m.id)
      );
      this.otherContactsData = actualElements;
    } else {
      this.otherContactsData.splice(index, 1);
      this.otherContactsDeletedData = this.otherContactsData.filter(
        (m) => m.deleteFlag == true && m.id
      );
      var actualElements = this.otherContactsData.filter(
        (m) => !(m.deleteFlag == true && m.id)
      );
      this.otherContactsData = actualElements;
    }

    this.otherContactsDataSource.next(this.otherContactsData);
    this.otherContactsData = this.otherContactsData.concat(
      this.otherContactsDeletedData
    );
    this.otherContactsForm
      .get('otherContacts')
      .setValue(this.otherContactsData);

    this.dfaApplicationMainDataService.otherContacts = this.otherContactsForm
      .get('otherContacts')
      .getRawValue();
    // 2024-10-11 EMCRI-809 waynezen; notify Review screen that Other Contact data has changed
    this.dfaApplicationMainDataService.otherContactsDataChangedEvent.emit(true);

    if (this.otherContactsData.length === 0) {
      this.otherContactsForm.get('addNewOtherContactIndicator').setValue(false);
    }
  }

  confirmDeleteOtherContactRow(index: number): void {
    var actualElementsCheck = this.otherContactsData.filter(
      (m) => !(m.deleteFlag == true && m.id)
    );
    var appId = this.dfaApplicationMainDataService.getApplicationId();

    if (actualElementsCheck.length == 1 && appId) {
      this.dialog
        .open(DFADeleteConfirmDialogComponent, {
          data: {
            content:
              'DFA requires that you have at least one Other Contact.<br/>Please add a new contact before deleting this one.'
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
    } else {
      this.deleteOtherContactRow(index);
    }
  }

  private setPrimaryContactInfoBlank() {
    // Blank Primary Contact
    this.dfaApplicationMainDataService.contacts = {
      ...this.dfaApplicationMainDataService.contacts,
      primaryContactValidated: false,
      pcFirstName: '',
      pcLastName: '',
      pcDepartment: '',
      pcBusinessPhone: '',
      pcEmailAddress: '',
      pcCellPhone: '',
      pcJobTitle: '',
      pcNotes: ''
    };

    this.contactsForm.patchValue({
      primaryContactSearch: '',
      pcFirstName: '',
      pcLastName: '',
      pcDepartment: '',
      pcBusinessPhone: '',
      pcEmailAddress: '',
      pcCellPhone: '',
      pcJobTitle: '',
      pcNotes: ''
    });

    this.dfaApplicationMainDataService.primaryContactValidatedEvent.emit(false);
  }

  private setPrimaryContactFieldsEnabled(enable: boolean) {
    if (enable) {
      // 2024-10-07 EMCRI-804 waynezen; allow editing in fields
      this.contactsForm.controls.pcCellPhone.enable();
      this.contactsForm.controls.pcJobTitle.enable();
      this.contactsForm.controls.pcNotes.enable();
    } else {
      // 2024-10-07 EMCRI-804 waynezen; don't allow editing in fields
      this.contactsForm.controls.pcCellPhone.disable();
      this.contactsForm.controls.pcJobTitle.disable();
      this.contactsForm.controls.pcNotes.disable();
    }
  }

  ngOnDestroy(): void {
    this.contactsForm$.unsubscribe();
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
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule,
    MatIconModule,
    AddressFormsModule
  ],
  declarations: [ContactsComponent]
})
class ContactsModule {}

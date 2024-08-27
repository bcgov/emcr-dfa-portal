import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as globalConst from '../../core/services/globalConstants';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { map } from "rxjs/operators";
import { FormCreationService } from '../../core/services/formCreation.service';
import { DFAPrescreeningDataService } from './dfa-prescreening-data.service';
import { ApplicantOption } from 'src/app/core/api/models';
import { MatDialog } from '@angular/material/dialog';
import { DFAConfirmPrescreeningDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-prescreening-dialog/dfa-confirm-prescreening-dialog.component';
import { AuthModule, AuthOptions, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { LoginService } from 'src/app/core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { DFAConfirmDashboardNavigationDialogComponent } from '../../core/components/dialog-components/dfa-confirm-dashboard-navigation/dfa-confirm-dashboard-navigation.component';

@Component({
  selector: 'app-dfa-prescreening',
  templateUrl: './dfa-prescreening.component.html',
  styleUrls: ['./dfa-prescreening.component.scss']
})
export class DFAPrescreeningComponent
  implements OnInit, AfterViewChecked
{
  dfaPrescreeningFolderPath = 'dfa-prescreening-forms';
  path: string;
  form$: Subscription;
  form: UntypedFormGroup;
  currentFlow: string;
  type = 'dfa-prescreening';
  parentPageName = 'dfa-dashboard';
  showLoader = false;
  isLoggedIn = false;
  ApplicantOptions = ApplicantOption;
  dfaPrescreeningForm: UntypedFormGroup;
  dfaPrescreeningForm$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formCreationService: FormCreationService,
    private cd: ChangeDetectorRef,
    public dfaPrescreeningDataService: DFAPrescreeningDataService,
    public dialog: MatDialog,
    private oidcSecurityService: OidcSecurityService,
    private loginService: LoginService,
    private httpClient: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
  }

  clearAnswers() {
    this.dfaPrescreeningDataService.clearPreScreeningAnswers.emit();
  }

  ngOnInit(): void {

    this.loadStepForm();
    this.currentFlow = this.route.snapshot.data.flow ? this.route.snapshot.data.flow : 'verified-registration';

    // clear old data
    this.dfaPrescreeningDataService.dfaPrescreening = null;
    this.formCreationService.clearDfaPrescreeningData();

    this.dfaPrescreeningForm$ = this.formCreationService
      .getDfaPrescreeningForm()
      .subscribe((prescreening) => {
        this.dfaPrescreeningForm = prescreening;
      });

    //    this.isLoggedIn = this.loginService.isLoggedIn();

    // 2024-06-05 EMCRI-217 waynezen: use new BCeID async Auth
    if (this.oidcSecurityService.isAuthenticated()) {
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false
    }
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  /**
   * Custom back stepper function
   *
   * @param stepper stepper instance
   * @param lastStep stepIndex
   */
  goBack(stepper: MatStepper, lastStep): void {
    this.returnToDashboard();
  }

  /**
   * Custom next stepper function
   *
   * @param stepper stepper instance
   * @param isLast stepperIndex
   * @param component current component name
   */
  goForward(component: string): void {
    if (this.form.valid) {
      this.setFormData();
      this.submitFile();
    }
    this.form$.unsubscribe();
    this.form.markAllAsTouched();
  }

  /**
   * Sets the form data to the DTO services
   *
   * @param component Name of the component
   */
  setFormData(): void {
    this.dfaPrescreeningDataService.dfaPrescreening = {
      addressLine1: this.form.get('addressLine1').value,
      addressLine2: this.form.get('addressLine2').value,
      city: this.form.get('city').value,
      eventId: this.form.get('eventId').value,
      postalCode: this.form.get('postalCode').value,
      stateProvince: this.form.get('stateProvince').value,
      applicantOption: this.form.get('applicantOption').value,
      insuranceOption: this.form.get('insuranceOption').value,
      damageFromDate: this.form.get('damageFromDate').value,
      damageCausedByDisaster: this.form.get('damageCausedByDisaster').value == 'true' ? true : (this.form.get('damagedCausedByDisaster').value == 'false' ? false : null),
      isPrimaryAndDamagedAddressSame: this.form.get('isPrimaryAndDamagedAddressSame').value == 'true' ? true : (this.form.get('isPrimaryAndDamagedAddressSame').value == 'false' ? false : null),
      isDamagedAddressVerified: this.form.get('isDamagedAddressVerified').value == 'true' ? true : (this.form.get('isDamagedAddressVerified').value == 'false' ? false : null),
      lossesExceed1000: this.form.get('lossesExceed1000').value == 'true' ? true : (this.form.get('lossesExceed1000').value == 'false' ? false : null),
      profileId: this.form.get('profileId').value,
    }
  }

  /**
   * Loads appropriate forms based on the current step
   *
   * @param index Step index
   */
  loadStepForm(): void {
    this.form$ = this.formCreationService
      .getDfaPrescreeningForm()
      .subscribe((dfaPrescreening) => {
        this.form = dfaPrescreening;
      });
  }

  returnToDashboard() {
    this.router.navigate(['/dfa-dashboard']);
  }

  BackToDashboard(): void {
    this.router.navigate(['/dfa-dashboard']);
  }

  ConfirmDashboardNavigation(): void {
    this.dialog
      .open(DFAConfirmDashboardNavigationDialogComponent, {
        data: {
          content: globalConst.confirmDashboardNavigationBody
        },
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        // 2024-06-05 EMCRI-217 waynezen: use new BCeID async Auth
        if (result === 'confirm' && this.oidcSecurityService.isAuthenticated()) {
          this.returnToDashboard();
        }
      });
  }

  submitFile(): void {
    this.dialog
      .open(DFAConfirmPrescreeningDialogComponent, {
        data: {
          content: globalConst.confirmPrescreeningBody
        },
        width: '700px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        // 2024-06-05 EMCRI-217 waynezen: use new BCeID async Auth
        if (result === 'confirm' && this.oidcSecurityService.isAuthenticated()) {
          const navigationPath = '/dfa-application-start';
          this.router.navigate([navigationPath]);
        } else this.returnToDashboard();
      });
  }
}

import { CommonModule, KeyValue } from '@angular/common';
import { Component, Inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltip,
  MatTooltipDefaultOptions,
  MatTooltipModule
} from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { DfaClaimMain } from 'src/app/core/api/models';
import { ClaimService } from 'src/app/core/api/services';
import { FeatureEnabledDirective } from 'src/app/core/directives/feature-enabled.directive';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { Decision } from 'src/app/models/decision.enum';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { DFAClaimMainDataService } from '../../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { DFAClaimMainMappingService } from '../../../../feature-components/dfa-claim-main/dfa-claim-main-mapping.service';
import { DFAProjectMainDataService } from '../../../../feature-components/dfa-project-main/dfa-project-main-data.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
  disableTooltipInteractivity: true,
  touchGestures: 'on'
};

@Component({
  selector: 'app-recovery-claim',
  templateUrl: './recovery-claim.component.html',
  styleUrls: ['./recovery-claim.component.scss'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export default class RecoveryClaimComponent implements OnInit, OnDestroy {
  DecisionEnum = Decision;

  message: string = '';
  recoveryClaimForm: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  recoveryClaimForm$: Subscription;
  formCreationService: FormCreationService;
  remainingLength: number = 200;
  todayDate = new Date().toISOString();
  vieworedit: string = '';
  isReadOnly: boolean = false;
  showDates: boolean = false;
  hideHelp: boolean = true;
  timerID;
  readonly phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  recoveryClaim?: DfaClaimMain;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    private route: ActivatedRoute,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    public dfaClaimMainDataService: DFAClaimMainDataService,
    private claimService: ClaimService,
    private dfaClaimMainMapping: DFAClaimMainMappingService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
    this.isReadOnly =
      dfaClaimMainDataService.getViewOrEdit() === 'view' ||
      dfaClaimMainDataService.getViewOrEdit() === 'edit' ||
      dfaClaimMainDataService.getViewOrEdit() === 'viewOnly';
    this.setViewOrEditControls();

    this.dfaClaimMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = vieworedit === 'view' || vieworedit === 'edit' || vieworedit === 'viewOnly';
      this.setViewOrEditControls();
    });

    this.vieworedit = dfaClaimMainDataService.getViewOrEdit();
  }

  numericOnly(event): boolean {
    let patt = /^\d+(\.\d{1,2})?$/;
    let text = event.target.value + event.key;
    if (text.indexOf('.') < 0) {
      text = text + '.0';
    } else if (text.indexOf('.') == text.length - 1) {
      text = text + '0';
    }

    let result = patt.test(text);
    return result;
  }

  setViewOrEditControls() {
    if (!this.recoveryClaimForm) return;
    if (this.isReadOnly) {
      this.hideHelp = true;
      this.recoveryClaimForm.controls.isThisFinalClaim.disable();
    } else {
      this.recoveryClaimForm.controls.isThisFinalClaim.enable();
    }
  }

  ngOnInit(): void {
    this.recoveryClaimForm$ = this.formCreationService.getRecoveryClaimForm().subscribe((recoveryClaim) => {
      this.recoveryClaimForm = recoveryClaim;
      this.setViewOrEditControls();
      this.setDisableInputFields();
    });

    let claimId = this.route.snapshot.paramMap.get('id');

    if (claimId) {
      this.getRecoveryClaim(claimId);
    }

    this.dfaProjectMainDataService.stepSelected.subscribe((stepSelected) => {
      if (!(stepSelected == '0' && this.dfaProjectMainDataService.getViewOrEdit() != 'viewOnly')) {
        this.hideHelp = true;
      }
    });

    if (this.dfaClaimMainDataService.getViewOrEdit() == 'viewOnly') {
      this.recoveryClaimForm.disable();
    }

    this.message =
      'Click on any field in the form to view detailed information ' +
      'about what information is required and tips on how to fill ' +
      'it out.\r\n' +
      'If you need more guidance, select the field and the ' +
      'relevant details will be displayed to assist you.';
  }

  setDisableInputFields() {
    this.recoveryClaimForm.controls.claimNumber.disable();
    this.recoveryClaimForm.controls.claimReceivedByEMCRDate.disable();
    this.recoveryClaimForm.controls.isFirstClaimApproved.disable();
    this.recoveryClaimForm.controls.totalInvoicesBeingClaimed.disable();
    this.recoveryClaimForm.controls.claimPST.disable();
    this.recoveryClaimForm.controls.claimGrossGST.disable();
    this.recoveryClaimForm.controls.totalActualClaim.disable();
    this.recoveryClaimForm.controls.claimEligibleGST.disable();
    this.recoveryClaimForm.controls.claimTotal.disable();
    this.recoveryClaimForm.controls.approvedClaimTotal.disable();
    this.recoveryClaimForm.controls.lessFirst1000.disable();
    this.recoveryClaimForm.controls.approvedReimbursement.disable();
    this.recoveryClaimForm.controls.eligiblePayable.disable();
    this.recoveryClaimForm.controls.paidClaimAmount.disable();
    this.recoveryClaimForm.controls.advancedDrawdownAmount.disable();
    this.recoveryClaimForm.controls.paidClaimDate.disable();
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  };

  calcRemainingChars() {
    this.remainingLength = 200 - this.recoveryClaimForm.get('subtypeOtherDetails').value?.length;
  }

  selectDamageDates(choice: any) {
    if (choice.value == 'true') {
      this.showDates = false;
    } else if (choice.value == 'false') {
      this.showDates = true;
    }
  }

  getRecoveryClaim(claimId: string) {
    if (claimId) {
      this.claimService.claimGetClaimMain({ claimId: claimId }).subscribe({
        next: (dfaClaimMain) => {
          this.recoveryClaim = dfaClaimMain;
          this.dfaClaimMainMapping.mapDFAClaimMain(dfaClaimMain);
        },
        error: (_error) => {}
      });
    }
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

  /**
   * Returns the control of the form
   */
  get propertyDamageFormControl(): { [key: string]: AbstractControl } {
    return this.recoveryClaimForm.controls;
  }

  /**
   * Return `true` if the total actual invoiced claim amount is greater than 0, `false` otherwise.
   *
   * @readonly
   * @type {boolean}
   * @memberof RecoveryClaimComponent
   */
  get hasInvoiceClaimAmounts(): boolean {
    return this.recoveryClaimForm.get('totalActualClaim').value > 0;
  }

  ngOnDestroy(): void {
    this.recoveryClaimForm$.unsubscribe();
  }

  setHelpText(inputSelection, tooltip: MatTooltip): void {
    switch (inputSelection) {
      case 1:
        this.message =
          "Project number\r\n\r\nThe project number is the unique project identifier that your organization assigned to the project's site location where damage has occurred.\r\nThe project identifier may be a number, letter, or any combination of letters and numbers.\r\nThis project number is specific to the site and is often referred to when discussing the location.";
        break;
      case 2:
        this.message =
          "Project name\r\n\r\nThe project name is the unique name that your organization assigned to the the project's site location where damage has occurred.\r\nThis project name is specific to the site and may also referenced when discussing the location.";
        break;
      case 3:
        this.message = 'Are the dates of damage the same dates provided on the application?';
        break;
      case 4:
        this.message = "What is this site location's date(s) of damage:\r\n\r\nFrom date";
        break;
      case 5:
        this.message = "What is this site location's date(s) of damage:\r\n\r\nTo date";
        break;
      case 6:
        this.message =
          "Why is this site location's date(s) of damage different from dates provided on the application?";
        break;
      case 7:
        this.message =
          'Site location\r\n\r\nInclude the address of the building, road, bridge, dam, river, breakwater, wharf, dyke, levee, drainage facility, parking lot, or culvert that was damaged.';
        break;
      case 8:
        this.message =
          'What infrastructure was damaged?\r\n\r\nInclude the name or type of building, road, bridge, dam, river, breakwater, wharf, dyke, levee, drainage facility, parking lot, or culvert that was damaged.\r\nThis is referred to as the infrastructure in later questions.';
        break;
      case 9:
        this.message = 'What caused the damage?\r\n\r\nProvide a brief explanation of how the damage was caused.';
        break;
      case 10:
        this.message = 'Describe the damage\r\n\r\nDescribe what part(s) of the infrastructure were damaged.';
        break;
      case 11:
        this.message =
          'Describe the materials, including quantities and measurements, of the damaged infrastructure\r\n\r\nFor the damaged infrastructure provide a clear detailed description of what was damaged including the type of materials, quantities, and measurements that were damaged.';
        break;
      case 12:
        this.message =
          'Describe the repair work\r\n\r\nDescribe what needs to be done to restore the infrastructure to pre - event condition.';
        break;
      case 13:
        this.message =
          'Describe the materials, including quantities and measurements, to repair damaged infrastructure\r\nProvide a clear detailed description of the materials, quantities and measurements that are required to repair the damage.';
        break;
      case 14:
        this.message =
          "Estimated completion date (month/year)\r\n\r\nProvide the date you expect to complete the project.\r\nIf you don't have an exact date, select the last day of the expected month and year.";
        break;
      case 15:
        this.message =
          'Estimate or actual cost of total project (include taxes)\r\n\r\nA total cost of all activities associated with the overall project.';
        break;
      default:
        this.message =
          'Click on any field in the form to view detailed information ' +
          'about what information is required and tips on how to fill ' +
          'it out.\r\n' +
          'If you need more guidance, select the field and the ' +
          'relevant details will be displayed to assist you.';
    }

    clearTimeout(this.timerID);
    tooltip.show();

    this.timerID = setTimeout(
      function () {
        tooltip.hide();
      }.bind(this),
      3000
    );
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
    MatTooltipModule,
    FeatureEnabledDirective
  ],
  declarations: [RecoveryClaimComponent],
  providers: [provideNgxMask()]
})
class PropertyDamageModule {}

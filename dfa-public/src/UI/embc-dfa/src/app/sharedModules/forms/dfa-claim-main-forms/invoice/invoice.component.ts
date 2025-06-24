import { CommonModule, KeyValue } from '@angular/common';
import { Component, Inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ProjectService } from 'src/app/core/api/services';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { Decision } from 'src/app/models/decision.enum';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { DFAClaimMainDataService } from '../../../../feature-components/dfa-claim-main/dfa-claim-main-data.service';
import { DFAClaimMainMappingService } from '../../../../feature-components/dfa-claim-main/dfa-claim-main-mapping.service';
import { DFAProjectMainDataService } from '../../../../feature-components/dfa-project-main/dfa-project-main-data.service';
import { DFAProjectMainMappingService } from '../../../../feature-components/dfa-project-main/dfa-project-main-mapping.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchendHideDelay: 0,
  disableTooltipInteractivity: true,
  touchGestures: 'on'
};

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults }]
})
export default class InvoiceComponent implements OnInit, OnDestroy {
  message: string = '';
  invoiceForm: UntypedFormGroup;
  invoiceForm$: Subscription;
  remainingLength: number = 200;
  todayDate = new Date().toISOString();
  vieworedit: string = '';
  addeditInvoiceText: string = 'Add';
  isReadOnly: boolean = false;
  showDates: boolean = false;
  hideHelp: boolean = true;
  eligibleGST: boolean = false;
  invoiceId: string = null;
  timerID;
  readonly phoneMask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  claimDecision: string = '';
  DecisionEnum = Decision;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InvoiceComponent>,
    public formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    public dfaProjectMainDataService: DFAProjectMainDataService,
    private dfaClaimMainDataService: DFAClaimMainDataService,
    private projectService: ProjectService,
    private dfaProjectMainMapping: DFAProjectMainMappingService,
    private dfaClaimMainMapping: DFAClaimMainMappingService,
    public dialog: MatDialog
  ) {}

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

  CalculateInvoice(event): void {
    var netInvoice = Number(this.invoiceForm.controls.netInvoiceBeingClaimed.value);
    var PST = Number(this.invoiceForm.controls.pst.value);
    var GrossGST = Number(this.invoiceForm.controls.grossGST.value);
    var EligibleGST = Number(this.invoiceForm.controls.eligibleGST.value);

    this.invoiceForm.controls.totalBeingClaimed.setValue((netInvoice + PST + EligibleGST).toFixed(2));
    this.invoiceForm.controls.actualInvoiceTotal.setValue((netInvoice + PST + GrossGST).toFixed(2));
  }

  setViewOrEditControls() {
    if (!this.invoiceForm) return;
    if (this.isReadOnly) {
      this.hideHelp = true;
      this.invoiceForm.controls.estimatedCompletionDate.disable();
    } else {
      this.invoiceForm.controls.estimatedCompletionDate.enable();
    }
  }

  ngOnInit(): void {
    var passData = this.data;
    var objInvData = passData.content;

    if (!objInvData) {
      this.formCreationService.clearInvoiceData();
    }

    if (passData.invoiceId) {
      this.invoiceId = passData.invoiceId;
    }

    if (passData.claimDecision) {
      this.claimDecision = passData.claimDecision;
    }

    this.invoiceForm$ = this.formCreationService.getInvoiceForm().subscribe((invoice) => {
      this.invoiceForm = invoice;

      if (this.invoiceForm.get('isGoodsReceivedonInvoiceDate').value === 'false') {
        this.invoiceForm.get('goodsReceivedDate').setValidators([Validators.required]);
      } else {
        this.invoiceForm.get('goodsReceivedDate').setValidators(null);
      }

      if (this.invoiceForm.get('isClaimforPartofTotalInvoice').value === 'true') {
        this.invoiceForm.get('reasonClaimingPartofTotalInvoice').setValidators([Validators.required]);
      } else {
        this.invoiceForm.get('reasonClaimingPartofTotalInvoice').setValidators(null);
      }

      this.invoiceForm.markAsUntouched();
      this.invoiceForm.updateValueAndValidity();

      this.invoiceForm.get('isClaimforPartofTotalInvoice').markAsUntouched();
      this.invoiceForm.get('isGoodsReceivedonInvoiceDate').markAsUntouched();
    });

    this.invoiceForm
      .get('isGoodsReceivedonInvoiceDate')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.invoiceForm.get('isGoodsReceivedonInvoiceDate').reset();
        } else if (value == 'false') {
          this.invoiceForm.get('goodsReceivedDate').setValidators([Validators.required]);
        } else if (value == 'true') {
          this.invoiceForm.get('goodsReceivedDate').reset();
          this.invoiceForm.get('goodsReceivedDate').setValidators(null);
        }
        this.invoiceForm.get('goodsReceivedDate').updateValueAndValidity();
        this.invoiceForm.updateValueAndValidity();
      });

    this.invoiceForm
      .get('isClaimforPartofTotalInvoice')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value === '') {
          this.invoiceForm.get('reasonClaimingPartofTotalInvoice').reset();
        } else if (value == 'true') {
          this.invoiceForm.get('reasonClaimingPartofTotalInvoice').setValidators([Validators.required]);
        } else if (value == 'false') {
          this.invoiceForm.get('reasonClaimingPartofTotalInvoice').reset();
          this.invoiceForm.get('reasonClaimingPartofTotalInvoice').setValidators(null);
        }
        this.invoiceForm.get('reasonClaimingPartofTotalInvoice').updateValueAndValidity();
        this.invoiceForm.updateValueAndValidity();
      });

    if (objInvData != null) {
      this.dfaClaimMainMapping.mapDFAInvoiceMain({ invoice: objInvData });
      this.addeditInvoiceText = 'Update';
    }

    if (passData.header) {
      this.addeditInvoiceText = passData.header;
      this.invoiceForm.controls.vendorName.disable();
      this.invoiceForm.controls.invoiceNumber.disable();
      this.invoiceForm.controls.invoiceDate.disable();
      this.invoiceForm.controls.isGoodsReceivedonInvoiceDate.disable();
      this.invoiceForm.controls.goodsReceivedDate.disable();
      this.invoiceForm.controls.purposeOfGoodsServiceReceived.disable();
      this.invoiceForm.controls.isClaimforPartofTotalInvoice.disable();
      this.invoiceForm.controls.reasonClaimingPartofTotalInvoice.disable();
      this.invoiceForm.controls.netInvoiceBeingClaimed.disable();
      this.invoiceForm.controls.pst.disable();
      this.invoiceForm.controls.grossGST.disable();
      this.invoiceForm.controls.actualInvoiceTotal.disable();
      this.invoiceForm.controls.eligibleGST.disable();
      this.invoiceForm.controls.totalBeingClaimed.disable();

      this.invoiceForm.controls.emcrDecision.disable();
      this.invoiceForm.controls.emcrApprovedAmount.disable();
      this.invoiceForm.controls.decisionDate.disable();
      this.invoiceForm.controls.emcrDecisionComments.disable();

      this.hideHelp = true;
      this.isReadOnly = true;

      document.getElementById('invHeadr').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    this.eligibleGST = this.dfaClaimMainDataService.getEligibleGST();

    if (this.eligibleGST) {
      this.invoiceForm.controls.eligibleGST.enable();
    } else {
      this.invoiceForm.controls.eligibleGST.disable();
    }

    if (this.dfaClaimMainDataService.getViewOrEdit() == 'viewOnly') {
      this.invoiceForm.disable();
    } else {
      setTimeout(
        function () {
          this.hideHelp = false;
        }.bind(this),
        1000
      );
    }

    this.message =
      'Click on any field in the form to view detailed information about what information is required and tips on how to fill it out.\r\nIf you need more guidance, select the field and the relevant details will be displayed to assist you.';

    setTimeout(
      function () {
        document.getElementById('invHeadr').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }.bind(this),
      200
    );
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  };

  calcRemainingChars() {
    this.remainingLength = 200 - this.invoiceForm.get('subtypeOtherDetails').value?.length;
  }

  selectDamageDates(choice: any) {
    if (choice.value == 'true') {
      this.showDates = false;
    } else if (choice.value == 'false') {
      this.showDates = true;
    }
  }

  getRecoveryPlan(projectId: string) {
    if (projectId) {
      this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
        next: (dfaProjectMain) => {
          if (
            dfaProjectMain &&
            dfaProjectMain.project &&
            dfaProjectMain.project.isdamagedDateSameAsApplication == false
          ) {
            this.showDates = true;
          }
          this.dfaProjectMainMapping.mapDFAProjectMain(dfaProjectMain);
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

  cancel() {
    this.dialogRef.close({ event: 'cancel', invData: null });
    this.formCreationService.clearInvoiceData();
  }

  AddInvoice() {
    var invObj = this.invoiceForm.getRawValue();
    this.invoiceForm.get('isGoodsReceivedonInvoiceDate').setValidators([Validators.required]);
    this.invoiceForm.get('isGoodsReceivedonInvoiceDate').markAsTouched();
    this.invoiceForm.get('isGoodsReceivedonInvoiceDate').updateValueAndValidity();

    this.invoiceForm.get('isClaimforPartofTotalInvoice').setValidators([Validators.required]);
    this.invoiceForm.get('isClaimforPartofTotalInvoice').markAsTouched();
    this.invoiceForm.get('isClaimforPartofTotalInvoice').updateValueAndValidity();

    if (!this.invoiceForm.valid) {
      this.invoiceForm.markAllAsTouched();
      return false;
    }

    this.formCreationService.clearInvoiceData();

    if (this.addeditInvoiceText == 'Update') {
      this.dialogRef.close({ event: 'update', invData: invObj });
    } else {
      this.dialogRef.close({ event: 'confirm', invData: invObj });
    }
  }

  /**
   * Returns the control of the form
   */
  get propertyDamageFormControl(): { [key: string]: AbstractControl } {
    return this.invoiceForm.controls;
  }

  ngOnDestroy(): void {
    this.invoiceForm$.unsubscribe();
  }

  setHelpText(inputSelection, tooltip: MatTooltip): void {
    switch (inputSelection) {
      case 1:
        this.message = 'Invoice date.\r\n\r\nAn invoice may include a bill of sale, receipt, or other documentation';
        break;
      case 2:
        this.message =
          'Please state why you are claiming only a portion of the total invoice.\r\n\r\nIf the invoice is for more than one project, include the project number and name of all the other projects this invoice is being shared with';
        break;
      case 3:
        this.message = 'Net invoiced being claimed.\r\n\r\nYou may claim a portion of the invoice amount.';
        break;
      case 4:
        this.message =
          'PST.\r\n\r\nIf claiming a portion of the invoice amount, you must calculate and provide the proportion of PST.';
        break;
      case 5:
        this.message =
          'Gross GST.\r\n\r\nIf claiming a portion of the invoice amount, you must calculate and provide the proportion of Gross GST.';
        break;
      case 6:
        this.message =
          'Eligible GST.\r\n\r\nGST is reimbursed at the portion not recoverable by the GST rebate, as per the Public Service Body Rebate (GST) Regulations: municipalities 0%, public hospitals 17%, schools 32% and universities/public colleges 33%.' +
          '\r\n\r\nIf claiming a portion of the invoice amount, you must calculate and provide the proportion of GST.';
        break;
      case 7:
        this.message =
          'Total being claimed.\r\n\r\nTotal being claimed is the total of (Net invoiced costs) + (PST) + (Eligible GST)';
        break;
      default:
        this.message =
          'Click on any field in the form to view detailed information about what information is required and tips on how to fill it out.\r\nIf you need more guidance, select the field and the relevant details will be displayed to assist you.';
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
    MatTooltipModule
  ],
  declarations: [InvoiceComponent],
  providers: [provideNgxMask()]
})
class InvoiceModule {}

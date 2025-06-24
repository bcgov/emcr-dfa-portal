import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DfaClaimMain, Invoice } from 'src/app/core/api/models';
import { ClaimService, InvoiceService } from 'src/app/core/api/services';
import { CoreModule } from 'src/app/core/core.module';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAClaimMainDataService } from 'src/app/feature-components/dfa-claim-main/dfa-claim-main-data.service';
import InvoiceComponent from '../../forms/dfa-claim-main-forms/invoice/invoice.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceDecision } from 'src/app/models/invoice-decision.enum';
import { AppealDecisionDialogComponent } from 'src/app/core/components/dialog-components/dfa-confirm-claim-begin-appeal-dialog/dfa-confirm-claim-begin-appeal-dialog.component';

@Component({
  selector: 'app-claim-decision',
  standalone: true,
  imports: [CoreModule, MatCardModule, MatTableModule, CommonModule,MatDialogModule],
  templateUrl: './claim-decision.component.html',
  styleUrl: './claim-decision.component.scss',
})
export class ClaimDecisionComponent implements OnInit {
  
  recoveryClaim?: DfaClaimMain;
  recoveryClaimFormAbstract: [];

  documentSummaryColumnsToDisplay = ['checkCircle','invoiceNumber', 'vendorName', 'invoiceDate', 'totalBeingClaimed', 'invoiceAmount', 'emcrApprovedAmount', 'viewInvoice'];
  documentSummaryDataSource = new MatTableDataSource<InvoiceExtended>();
  documentSummaryDataSourceFiltered = new MatTableDataSource<InvoiceExtended>();
  invoicesCount: number = 0;
  formCreationService: FormCreationService;
  
  InvoiceDecisionEnum = InvoiceDecision;

  claimId: string | null = null;

  constructor(
    private claimService: ClaimService,
    private route: ActivatedRoute,
    public dfaClaimMainDataService: DFAClaimMainDataService,
    private invoiceService: InvoiceService,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.claimId = this.route.snapshot.paramMap.get('id');
    console.log('Claim ID from route:', this.claimId);
    if (this.claimId) {
      this.getRecoveryClaim(this.claimId);
    }

    // Get Recovery Claim Invoices
    if( this.claimId) {
      this.getRecoveryInvoices(this.claimId);
    }

  }

  openAppealDecision(): void {
    console.log('Opening appeal decision dialog...');
    const dialogRef = this.dialog.open(AppealDecisionDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.beginAppealProcess();
      }
    });
  }

  beginAppealProcess(): void {
    console.log('Begin Appeal Process: 🚧 Under construction...');
    if (this.claimId) {
      this.router.navigate(['/claim', this.claimId, 'appeal']);
    }
  }

  getRecoveryClaim(claimId: string) {
    if (claimId) {
      this.claimService.claimGetClaimMain({ claimId: claimId }).subscribe({
        next: (dfaClaimMain) => {
          this.recoveryClaim = dfaClaimMain;
          
          //this.dfaClaimMainMapping.mapDFAClaimMain(dfaClaimMain);
          console.log('Recovery Claim:', this.recoveryClaim);
        },
        error: (_error) => { }
      });
    }
  }

  getRecoveryInvoices(claimId: string) {
    if (claimId) {
      this.invoiceService.invoiceGetDfaInvoices({ claimId: claimId }).subscribe({
        next: (lstInv) => {
          var lstInvoices = [];

          lstInv.forEach((objInv) => {
            lstInvoices.push({
              invoiceId: objInv.invoiceId,
              invoiceNumber: objInv.invoiceNumber,
              vendorName: objInv.vendorName,
              invoiceDate: new Date(objInv.invoiceDate),
              isGoodsReceivedonInvoiceDate: objInv.isGoodsReceivedonInvoiceDate,
              goodsReceivedDate: objInv.goodsReceivedDate
                ? new Date(objInv.goodsReceivedDate)
                : objInv.goodsReceivedDate,
              purposeOfGoodsServiceReceived: objInv.purposeOfGoodsServiceReceived,
              isClaimforPartofTotalInvoice: objInv.isClaimforPartofTotalInvoice,
              reasonClaimingPartofTotalInvoice: objInv.reasonClaimingPartofTotalInvoice,
              netInvoiceBeingClaimed: objInv.netInvoiceBeingClaimed,
              pst: objInv.pst,
              grossGST: objInv.grossGST,
              actualInvoiceTotal: objInv.actualInvoiceTotal,
              eligibleGST: objInv.eligibleGST,
              totalBeingClaimed: objInv.totalBeingClaimed,
              emcrDecision: objInv.emcrDecision,
              emcrApprovedAmount: objInv.emcrApprovedAmount,
              decisionDate: objInv.decisionDate ? new Date(objInv.decisionDate) : objInv.decisionDate,
              emcrDecisionComments: objInv.emcrDecisionComments
            });
          });

          this.documentSummaryDataSource.data = lstInvoices;
          this.documentSummaryDataSourceFiltered.data = this.documentSummaryDataSource.data;
          this.invoicesCount = this.documentSummaryDataSource.data.length;

          

          // this.formCreationService.recoveryClaimForm.value
          //   .get('invoices')
          //   .setValue(this.documentSummaryDataSource.data);
          // this.formCreationService.recoveryClaimForm.value.updateValueAndValidity();

          // if (this.dfaClaimMainDataService.recoveryClaim) {
          //   this.dfaClaimMainDataService.recoveryClaim.invoices = this.documentSummaryDataSource.data;
          //   this.SummaryClaimCalc();
          // }
        },
        error: (_error) => { }
      });
    }
  }

  viewInvoiceRow(element, index): void {
    this.openInvoiceViewPopup(element, index);
  }

    openInvoiceViewPopup(objInvoice, _index): void {
      if (objInvoice && objInvoice.invoiceId) {
        this.dfaClaimMainDataService.setInvoiceId(objInvoice.invoiceId);
        delete (objInvoice as any).invoiceId;
      } else {
        this.dfaClaimMainDataService.setInvoiceId(null);
      }
  
      this.dialog
        .open(InvoiceComponent, {
          data: {
            content: objInvoice,
            invoiceId: this.dfaClaimMainDataService.getInvoiceId(),
            claimDecision: this.dfaClaimMainDataService.getClaimDecision(),
            header: 'View'
          },
          maxHeight: '90vh',
          width: '1200px',
          disableClose: true
        })
        .afterClosed()
        .subscribe((_result) => {});
    }

  BackToDashboard() {
    var projId = this.dfaClaimMainDataService.getProjectId();
    this.router.navigate(['/dfa-project/' + projId + '/claims']);
  }


}

export interface InvoiceExtended extends Invoice {
  invoiceId?: string;
}


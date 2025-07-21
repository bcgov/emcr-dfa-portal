import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';

@Component({
  selector: 'app-appeal-reason',
  standalone: false,
  templateUrl: './appeal-reason.component.html',
  styleUrls: ['./appeal-reason.component.scss']
})
export default class AppealReasonComponent implements OnInit, OnDestroy {
  appealReasonForm: FormGroup;
  appealReasonForm$: Subscription;
  caseDetails: any;
  appealType: string;

  constructor(
    private formCreationService: FormCreationService,
    private appealDataService: DFAAppealDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get case details from data service
    this.caseDetails = this.appealDataService.getCaseDetails();
    this.appealType = this.caseDetails?.type;

    this.cdr.detectChanges();

    // Initialize form
    this.appealReasonForm$ = this.formCreationService.getAppealReasonForm().subscribe((form) => {
      if (form) {
        this.appealReasonForm = form;
        
      }
    });
  }

  ngOnDestroy(): void {
    this.appealReasonForm$?.unsubscribe();
  }
}

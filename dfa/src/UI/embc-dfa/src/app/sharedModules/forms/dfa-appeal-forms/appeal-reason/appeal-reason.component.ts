import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';

@Component({
  selector: 'app-appeal-reason',
  standalone: false,
  templateUrl: './appeal-reason.component.html',
  styleUrls: ['./appeal-reason.component.scss']
})
export default class AppealReasonComponent implements OnInit {
  appealReasonForm: FormGroup;
  caseDetails: any;
  appealType: string;
  
  constructor(
    private formBuilder: FormBuilder,
    private formCreationService: FormCreationService,
    private appealDataService: DFAAppealDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Get case details from data service
    this.caseDetails = this.appealDataService.getCaseDetails();
    this.appealType = this.caseDetails.type;

    this.cdr.detectChanges();
    
    // Initialize form
    this.formCreationService.getAppealReasonForm().subscribe(form => {
      if (form) {
        this.appealReasonForm = form;
      }
    });
  }
  
  addSupportingDocuments(): void {
    // Implementation for adding supporting documents
  }
}

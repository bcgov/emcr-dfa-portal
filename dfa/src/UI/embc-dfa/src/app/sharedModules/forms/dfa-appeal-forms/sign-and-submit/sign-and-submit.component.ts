import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { DfaApplicationMain } from 'src/app/core/api/models';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';

@Component({
  selector: 'app-sign-and-submit',
  standalone: false,
  templateUrl: './sign-and-submit.component.html',
  styleUrls: ['./sign-and-submit.component.scss']
})
export default class SignAndSubmitComponent implements OnInit, OnDestroy {
  signAndSubmitForm: UntypedFormGroup;
  signAndSubmitForm$: Subscription;
  isReadOnly: boolean = false;
  caseDetails: any;
  fullApplication: DfaApplicationMain | undefined;
  private fullApplication$: Subscription;

  constructor(
    @Inject('formCreationService') private formCreationService: FormCreationService,
    private appealDataService: DFAAppealDataService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.caseDetails = this.appealDataService.getCaseDetails();
    this.fullApplication = this.appealDataService.getFullApplication();

    this.cdr.detectChanges();

    this.signAndSubmitForm$ = this.formCreationService
      .getAppealSignAndSubmitForm()
      .subscribe((signAndSubmit) => {
        this.signAndSubmitForm = signAndSubmit;
      });
  }

  ngOnDestroy(): void {
    this.signAndSubmitForm$?.unsubscribe();
    this.fullApplication$?.unsubscribe();
  }
}

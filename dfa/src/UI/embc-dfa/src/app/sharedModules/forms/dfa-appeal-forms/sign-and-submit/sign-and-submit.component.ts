import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  constructor(
    @Inject('formCreationService') private formCreationService: FormCreationService,
    public dfaAppealDataService: DFAAppealDataService
  ) {
  }

  ngOnInit(): void {
    this.signAndSubmitForm$ = this.formCreationService
      .getAppealSignAndSubmitForm()
      .subscribe((signAndSubmit) => {
        this.signAndSubmitForm = signAndSubmit;
    });
  }

  ngOnDestroy(): void {
    this.signAndSubmitForm$?.unsubscribe();
  }
}
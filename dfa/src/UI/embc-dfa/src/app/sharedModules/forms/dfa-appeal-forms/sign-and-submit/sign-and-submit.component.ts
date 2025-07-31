import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DfaApplicationMain } from 'src/app/core/api/models';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { DFAAppealDataService } from 'src/app/feature-components/dfa-appeal/dfa-appeal-data.service';
import { SignatureBlock } from 'src/app/core/api/models';
import { distinctUntilChanged, mapTo } from 'rxjs/operators';
@Component({
  selector: 'app-sign-and-submit',
  standalone: false,
  templateUrl: './sign-and-submit.component.html',
  styleUrls: ['./sign-and-submit.component.scss']
})
export default class SignAndSubmitComponent implements OnInit, OnDestroy {
  signAndSubmitForm: UntypedFormGroup;
  signAndSubmitForm$: Subscription;
  fullApplication: DfaApplicationMain | undefined;
  private fullApplication$: Subscription;
  @Input() applicationDetails: DfaApplicationMain = this.appealDataService.getFullApplication();
  @Input() caseDetails: any;
  isReadOnly = this.router.url.includes('/view');
  initialApplicantSignature: SignatureBlock = {dateSigned: null, signedName: null, signature: null};
  initialSecondaryApplicantSignature: SignatureBlock = {dateSigned: null, signedName: null, signature: null};
  
  constructor(
    @Inject('formCreationService') private formCreationService: FormCreationService,
    private appealDataService: DFAAppealDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.caseDetails = this.appealDataService.getCaseDetails();
    this.fullApplication = this.appealDataService.getFullApplication();

    this.signAndSubmitForm$ = this.formCreationService.getAppealSignAndSubmitForm().subscribe((signAndSubmit) => {
      this.signAndSubmitForm = signAndSubmit;

      this.initialApplicantSignature.dateSigned = this.signAndSubmitForm?.get('applicantSignature')?.get('dateSigned').value;
      this.initialApplicantSignature.signedName = this.signAndSubmitForm?.get('applicantSignature')?.get('signedName').value;
      this.initialApplicantSignature.signature = this.signAndSubmitForm?.get('applicantSignature')?.get('signature').value;
   
      // Retrive sign and signature
      this.signAndSubmitForm.get('applicantSignature').get('signature')
      .valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
        console.log("Value Changes", value);
        if (value === '') {
          this.signAndSubmitForm.get('applicantSignature').reset();
        }
        this.initialApplicantSignature.dateSigned = this.signAndSubmitForm?.get('applicantSignature')?.get('dateSigned').value;
        this.initialApplicantSignature.signedName = this.signAndSubmitForm?.get('applicantSignature')?.get('signedName').value;
        this.initialApplicantSignature.signature = this.signAndSubmitForm?.get('applicantSignature')?.get('signature').value;
      });
    });
  }
  

  ngOnDestroy(): void {
    this.signAndSubmitForm$?.unsubscribe();
    this.fullApplication$?.unsubscribe();
  }
}

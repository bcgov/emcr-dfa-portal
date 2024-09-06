import { Component, OnInit, NgModule, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  FormsModule,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CommonModule, KeyValue } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ApplicantOption, ApplicantSubtypeSubCategories } from 'src/app/core/api/models';
import { MatTableModule } from '@angular/material/table';
import { CustomPipeModule } from 'src/app/core/pipe/customPipe.module';
import { DFADeleteConfirmDialogComponent } from '../../../../core/components/dialog-components/dfa-confirm-delete-dialog/dfa-confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService, provideNgxMask } from 'ngx-mask';
import { ApplicationService, OtherContactService } from 'src/app/core/api/services';
import { DFAApplicationMainMappingService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-mapping.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-application1',
  templateUrl: './create-application1.component.html',
  styleUrl: './create-application1.component.scss'
})
export class CreateApplication1Component implements OnInit, OnDestroy {
  // createApplication1Form = new FormGroup({
  //   legalName: new FormControl('')
  // });
  formBuilder: UntypedFormBuilder;
  createApplication1Form: UntypedFormGroup;
  createApplication1Form$: Subscription;
  formCreationService: FormCreationService;
  isReadOnly: boolean;
  vieworedit: string;

  constructor(
    @Inject('formBuilder') formBuilder: UntypedFormBuilder,
    @Inject('formCreationService') formCreationService: FormCreationService,
    public customValidator: CustomValidationService,
    public dfaApplicationMainDataService: DFAApplicationMainDataService,
    private applicationService: ApplicationService,
    private dfaApplicationMainMapping: DFAApplicationMainMappingService,
    public dialog: MatDialog
  ) {
    this.formBuilder = formBuilder;
    this.formCreationService = formCreationService;
    this.isReadOnly = (dfaApplicationMainDataService.getViewOrEdit() === 'view'
    || dfaApplicationMainDataService.getViewOrEdit() === 'edit'
    || dfaApplicationMainDataService.getViewOrEdit() === 'viewOnly');
    this.setViewOrEditControls();

    this.dfaApplicationMainDataService.changeViewOrEdit.subscribe((vieworedit) => {
      this.isReadOnly = (vieworedit === 'view'
      || vieworedit === 'edit'
        || vieworedit === 'viewOnly');
      this.setViewOrEditControls();
    })

    this.vieworedit = dfaApplicationMainDataService.getViewOrEdit();
  }

  setViewOrEditControls() {
    if (!this.createApplication1Form) return;
    if (this.isReadOnly) {

      this.createApplication1Form.controls.legalName.disable();
    } else {
      this.createApplication1Form.controls.legalName.enable();

    }
  }

  ngOnInit(): void {
    this.createApplication1Form$ = this.formCreationService
      .getCreateApplication1Form()
      .subscribe((createApplication1) => {
        this.createApplication1Form = createApplication1;
        this.setViewOrEditControls();
        // this.dfaApplicationMainDataService.propertyDamage = {
        //   damageFromDate: null,
        //   damageToDate: null,
        //   floodDamage: null,
        //   landslideDamage: null,
        //   otherDamage: null,
        //   otherDamageText: null,
        //   stormDamage: null,
        //   wildfireDamage: null,
        //   guidanceSupport: null,
        //   applicantSubtype: null
        // }
      });
    }

  get createApplication1FormControl(): { [key: string]: AbstractControl } {
    return this.createApplication1Form.controls;
  }


  ngOnDestroy(): void {
    this.createApplication1Form$.unsubscribe();
  }
}


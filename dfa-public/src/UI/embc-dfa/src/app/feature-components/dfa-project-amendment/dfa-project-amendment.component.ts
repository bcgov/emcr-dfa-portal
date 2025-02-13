import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Inject,
  NgModule,
  Injector,
} from '@angular/core';
import {
    ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as globalConst from '../../core/services/globalConstants';
import { FormCreationService } from '../../core/services/formCreation.service';
import { ApplicantOption, CurrentApplication, CurrentProjectAmendment, FarmOption, ProjectStageOptionSet, ProjectStatusBar, SmallBusinessOption } from 'src/app/core/api/models';
import { ApplicationService, AttachmentService } from 'src/app/core/api/services';
import { MatDialog } from '@angular/material/dialog';
import { DashTabModel } from '../dashboard/dashboard.component';
import { DFAApplicationMainDataService } from 'src/app/feature-components/dfa-application-main/dfa-application-main-data.service';
import { DFAProjectMainDataService } from 'src/app/feature-components/dfa-project-main/dfa-project-main-data.service';
import { AppSessionService } from 'src/app/core/services/appSession.service';
import { ProjectService } from 'src/app/core/api/services';
import { DFAConfirmProjectCreateDialogComponent } from '../../core/components/dialog-components/dfa-confirm-project-create-dialog/dfa-confirm-project-create-dialog.component';
import { DFAProjectMainService } from '../dfa-project-main/dfa-project-main.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DirectivesModule } from '../../core/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { CustomPipeModule } from '../../core/pipe/customPipe.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DFAProjectMainMappingService } from '../dfa-project-main/dfa-project-main-mapping.service';
import { ProjectAmendment } from '../../core/model/dfa-project-main.model';
import { DFAGeneralInfoDialogComponent } from '../../core/components/dialog-components/dfa-general-info-dialog/dfa-general-info-dialog.component';
import { Decision } from 'src/app/models/decision.enum';


@Component({
  selector: 'app-dfa-project-amendment',
  templateUrl: './dfa-project-amendment.component.html',
  styleUrls: ['./dfa-project-amendment.component.scss']
})
export class DFAProjectAmendmentComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{

  items = [
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Created", stage: "", statusColor: "#639DD4", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Under Review", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Approval Pending", stage: "", statusColor: "#FDCB52", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Decision Made", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
    { status: "Closed", stage: "", statusColor: "#62A370", isCompleted: false, currentStep: false, isFinalStep: true, isErrorInStatus: false },
    { status: "", stage: "", statusColor: "", isCompleted: false, currentStep: false, isFinalStep: false, isErrorInStatus: false },
  ];

  isLoading = false;
  applicationNumber = '';
  appId = null;
  projectId = null;
  caseNumber = '';
  causeOfDamage = '';
  dateOfDamageFrom = '';
  dateOfDamageTo = '';
  OneDayAgo: number = 0;
  projectAmendmentForm: UntypedFormGroup;
  frmBuilder: UntypedFormBuilder;
  projectAmendmentForm$: Subscription;
  frmCreationService: FormCreationService;
  injector: Injector;
  serviceInjector: Injector;
  ProjectAmendments: CurrentProjectAmendment[] = [];
  statusBar?: null | Array<ProjectStatusBar>;
  isErrorInStatus?: null | boolean;
  projectName = '';
  DecisionEnum = Decision;

  constructor(
    //@Inject('formBuilder') formBuilder: UntypedFormBuilder,
    //@Inject('formCreationService') formCreationService: FormCreationService,
    private formBuilder: UntypedFormBuilder,
    private formCreationService: FormCreationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dfaApplicationMainDataService: DFAApplicationMainDataService,
    private dfaProjectMainDataService: DFAProjectMainDataService,
    private applicationService: ApplicationService,
    private projectService: ProjectService,
    private dfaProjectMainService: DFAProjectMainService,
    private dfaProjectMainMapping: DFAProjectMainMappingService,
  ) {
    this.frmBuilder = formBuilder;
    this.frmCreationService = formCreationService;
  }

  ngOnInit(): void {


    this.projectAmendmentForm$ = this.formCreationService
      .getProjectAmendmentForm()
      .subscribe((projectAmendment) => {
        this.projectAmendmentForm = projectAmendment;
      });

    this.appId = this.dfaProjectMainDataService.getApplicationId(); //this.route.snapshot.paramMap.get('id');
    this.projectId = this.dfaProjectMainDataService.getProjectId();
    this.applicationNumber = 'Application';
    this.getApplicationDetials(this.appId);
    this.getRecoveryPlan(this.projectId);
    this.getAmendmentDetials(this.projectId);

    this.dfaProjectMainDataService.setApplicationId(this.appId);
    this.disableFormfields();
  }

  disableFormfields(): void {
    this.projectAmendmentForm.controls.amendmentNumber.disable();
    this.projectAmendmentForm.controls.amendmentReceivedDate.disable();
    this.projectAmendmentForm.controls.amendmentReason.disable();
    this.projectAmendmentForm.controls.amendmentApprovedDate.disable();
    this.projectAmendmentForm.controls.emcrDecisionComments.disable();
    this.projectAmendmentForm.controls.requestforProjectDeadlineExtention.disable();
    this.projectAmendmentForm.controls.amendedProjectDeadlineDate.disable();
    this.projectAmendmentForm.controls.deadlineExtensionApproved.disable();
    this.projectAmendmentForm.controls.amended18MonthDeadline.disable();
    this.projectAmendmentForm.controls.requestforAdditionalProjectCost.disable();
    this.projectAmendmentForm.controls.estimatedAdditionalProjectCost.disable();
    this.projectAmendmentForm.controls.additionalProjectCostDecision.disable();
    this.projectAmendmentForm.controls.approvedAdditionalProjectCost.disable();
  }

  getApplicationDetials(applicationId: string) {
    if (applicationId) {
      this.applicationService.applicationGetApplicationDetailsForProject({ applicationId: applicationId }).subscribe({
        next: (dfaApplicationMain) => {
          if (dfaApplicationMain) {
            this.dateOfDamageFrom = dfaApplicationMain.dateOfDamage;
            this.dateOfDamageTo = dfaApplicationMain.dateOfDamageTo;
            this.caseNumber = dfaApplicationMain.caseNumber ? dfaApplicationMain.caseNumber : "Not Generated";
            this.causeOfDamage = this.CombineCauseOfDamages(dfaApplicationMain);
          }

        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  ShowMessage(textContent) : string {

    var resultContent = '';

    const content = { text: textContent, cancelButton: 'Close', title: 'Project Amendment' };

    this.dialog
      .open(DFAGeneralInfoDialogComponent, {
        data: {
          content: content
        },
        height: '280px',
        width: '530px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate(['dfa-application/' + this.appId + '/projects']);
      });

    return resultContent;
  }

  ConfirmAndGoBack(textContent): string {

    var resultContent = '';

    const content = { text: textContent, cancelButton: 'Close', title: 'Project Amendment' };

    this.dialog
      .open(DFAGeneralInfoDialogComponent, {
        data: {
          content: content
        },
        height: '280px',
        width: '530px',
        disableClose: true
      })
      .afterClosed()
      .subscribe((result) => {
        this.router.navigate(['dfa-application/' + this.appId + '/projects']);
      });

    return resultContent;
  }

  SyncAmendmentDetails(): void {
    this.projectId = this.dfaProjectMainDataService.getProjectId();
    this.getAmendmentDetials(this.projectId);
  }

  getRecoveryPlan(projectId: string) {
    if (projectId) {
      this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
        next: (dfaProjectMain) => {
          if (dfaProjectMain && dfaProjectMain.project)
            this.projectName = 'Project - ' + dfaProjectMain.project.projectName +' (Amended)';
        },
        error: (error) => {
          //console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  getAmendmentDetials(projectId: string) {
    if (projectId) {
      this.projectService.projectGetDfaProjectAmendments({ projectId: projectId }).subscribe({
        next: (dfaAmendment) => {
          if (dfaAmendment) {
            var amendmentId = this.projectAmendmentForm.controls.amendmentId.value;
            this.ProjectAmendments = dfaAmendment;
            if (dfaAmendment && dfaAmendment.length > 0) {
              var selectedAmendment = dfaAmendment.filter(m => m.amendmentId == amendmentId);
              if (selectedAmendment.length > 0) {
                this.selectAmendment(selectedAmendment[0]);
              }
              else {
                this.selectAmendment(dfaAmendment[0]);
              }
            }
            else {
              let noAmendment = 'No amendment found for the project!<br/>Click \'Close\' button to go back to Project Dashboard';
              this.ConfirmAndGoBack(noAmendment);

            }
          }
          else {
            let noAmendment = 'No amendment found for the project!<br/>Click \'Close\' button to go back to Project Dashboard';
            this.ConfirmAndGoBack(noAmendment);

          }

        },
        error: (error) => {
          console.error(error);
          let noAmendment = 'Error in loading details!<br/>Click \'Close\' button to go back to Project Dashboard';
          this.ConfirmAndGoBack(noAmendment);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
    }
  }

  CombineCauseOfDamages(applItem: CurrentApplication): string {
    var causeofdamages = applItem.floodDamage == true ? "Flood, " : "";
    causeofdamages += applItem.landslideDamage == true ? "Landslide, " : "";
    causeofdamages += applItem.stormDamage == true ? "Storm, " : "";
    causeofdamages += applItem.wildfireDamage == true ? "Wildfire, " : "";
    causeofdamages += applItem.otherDamageText != null ? applItem.otherDamageText : "";
    causeofdamages = causeofdamages.trim();

    var lastChar = causeofdamages.slice(-1);
    if (lastChar == ',') {
      causeofdamages = causeofdamages.slice(0, -1);
    }

    return causeofdamages;
  }

  ViewApplication(appId: string): void {
    this.dfaApplicationMainDataService.setApplicationId(appId);
    this.dfaApplicationMainDataService.setViewOrEdit('view');

    this.router.navigate(['/dfa-application-main/' + appId]);
  }

  getItems(lst) {
    if (!lst) return false;
    return lst.filter((item) => item.status !== '');
  }

  selectAmendment(objAmendment: CurrentProjectAmendment) {
    //var lstDataModified = [];
    //var lstDataUnModified = [];
    //var initialList = objAmendment;
    //lstDataUnModified.push(initialList);

    if (objAmendment.status) {
      var isFound = false;
      var jsonVal = JSON.stringify(this.items);
      this.isErrorInStatus = false;
      this.statusBar = JSON.parse(jsonVal);

      if(objAmendment.amendmentDecision !== "Approved" && objAmendment.amendmentDecision !== "Approved with Exclusions") {
        objAmendment.amendmentReceivedDate = null
        objAmendment.emcrDecisionComments = null
        objAmendment.deadlineExtensionApproved = null
        objAmendment.amended18MonthDeadline = null
        objAmendment.additionalProjectCostDecision = null
        objAmendment.approvedAdditionalProjectCost = null
      }

      this.statusBar.forEach(objStatItem => {
        if (objAmendment.status != null && objStatItem.status.toLowerCase() == objAmendment.status.toLowerCase()) {
          objStatItem.currentStep = true;
          isFound = true

          if (objAmendment.amendmentDecision) {
            objStatItem.stage = objAmendment.amendmentDecision;
          }

          objAmendment.statusColor = objStatItem.statusColor;

          if (objAmendment.stage == 'Ineligible' || objAmendment.stage == 'Withdrawn') {
            objAmendment.statusColor = '#E25E63';
          }

          if (objAmendment.status.toLowerCase() == 'created') {
            objAmendment.statusColor = '#639DD4';
          }

          //if (objAmendment.status.toLowerCase().indexOf('decision made') > -1 && objAmendment.stage.toLowerCase().indexOf('progress') > -1) {
          //  objAmendment.statusColor = '#FDCB52';
          //}
        }

        if (isFound == false) {
          objStatItem.isCompleted = true;
        }

        if (objStatItem.isFinalStep == true) {
          if (isFound == false) {
            this.isErrorInStatus = true;
          }
          else if (objStatItem.status.toLowerCase() == objAmendment.status.toLowerCase()) {
            objStatItem.isCompleted = true;
          }
        }

      });
    }
    else {
      this.isErrorInStatus = true;
    }


    //this.mapData(lstDataModified);

    this.dfaProjectMainMapping.mapDFAProjectAmendment(objAmendment);
  }

  BackToDashboard() {
    this.dfaApplicationMainDataService.setApplicationId(null);
    this.router.navigate(['/dfa-dashboard/current']);
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {

  }

}

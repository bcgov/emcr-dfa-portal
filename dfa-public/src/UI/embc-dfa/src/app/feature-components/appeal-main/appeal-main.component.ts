import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { DfaProjectMain, RecoveryPlan } from 'src/app/core/api/models';
import { ProjectService } from 'src/app/core/api/services';

@Component({
  selector: 'app-appeal-main',
  templateUrl: './appeal-main.component.html',
  styleUrl: './appeal-main.component.scss'
})
export class AppealMainComponent implements OnInit {
  appealForm!: FormGroup;
  projectId: string;
  project: RecoveryPlan;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private projectService: ProjectService) {
    this.appealForm = this.formBuilder.group({
      reason: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      console.log('Project ID:', this.projectId);
      // load project data including appeal
      this.loadProject(this.projectId);
    });
  }

  loadProject(projectId: string) {
      this.projectService.projectGetProjectMain({ projectId: projectId }).subscribe({
        next: (dfaProjectMain) => {
          if (dfaProjectMain && dfaProjectMain.project)
            //this.projectName = 'Project - ' + dfaProjectMain.project.projectName +' (Amended)';
            this.project = dfaProjectMain.project;
        },
        error: (error) => {
          console.error(error);
          //document.location.href = 'https://dfa.gov.bc.ca/error.html';
        }
      });
  }

  goBack() { }
  goForward() { }
  save() {
    console.log('Form Submitted', this.appealForm.value);
    console.log('Form Group', this.appealForm);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';
import { ProjectAppealService } from 'src/app/core/api/services';


@Component({
  selector: 'app-project-appeal',
  standalone: false,
  templateUrl: './project-appeal.component.html',
  styleUrls: ['./project-appeal.component.scss']
}) 
export class ProjectAppealComponent implements OnInit {
  selectedStepIndex: number = 0;

  vieworedit: string = "";
  appealId: string;
  projectId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public projectAppealService: ProjectAppealService,
  ) {
  }

  ngOnInit(): void {
    this.vieworedit = this.router.url.includes('view') ? 'view' : 'edit';
    this.appealId = this.route.snapshot.params['appealId'];
    this.projectId = this.route.snapshot.params['projectId'];

    if(this.appealId == undefined){
      this.appealId = this.CreateAppeal();
    }
  }
  CreateAppeal(): string {
    return "";
  }

  cancleAppeal() {
    console.log("Cancel Appeal");
  }

  BackToDashboard() {
    console.log("Back to Project Dashboard");
  }

  IsFormValid(){
    //To do add validation
    return true;
  }

  onStepChange(event: any) {
  this.selectedStepIndex = event.selectedIndex;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';


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
  ) {
  }

  ngOnInit(): void {
    this.vieworedit = this.router.url.includes('view') ? 'view' : (this.router.url.includes('edit') ? 'edit' : 'new');
    this.appealId = this.route.snapshot.params['appealId'];
    this.projectId = this.route.snapshot.params['projectId'];
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

import { Component, Input, OnInit } from '@angular/core';
import { CurrentApplication, CurrentProjectAppeal, RecoveryPlan } from 'src/app/core/api/models';

/**
 * A container that displays project details.
 *
 * @export
 * @class AppealProjectDetailsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-appeal-project-details',
  standalone: false,
  templateUrl: './appeal-project-details.component.html',
  styleUrl: './appeal-project-details.component.scss'
})
export class AppealProjectDetailsComponent implements OnInit {
  // TODO: Remove unused imports
  @Input() projectId: string;
  @Input() project: RecoveryPlan;
  @Input() application: CurrentApplication;
  @Input() appeal: CurrentProjectAppeal;

  constructor() {}

  ngOnInit(): void {}
}

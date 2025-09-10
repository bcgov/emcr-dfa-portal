import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-appeal-rationale',
  standalone: false,
  templateUrl: './project-appeal-rationale.component.html',
  styleUrl: './project-appeal-rationale.component.scss'
})
export class ProjectAppealRationaleComponent {
  @Input() edit: boolean = false;

}

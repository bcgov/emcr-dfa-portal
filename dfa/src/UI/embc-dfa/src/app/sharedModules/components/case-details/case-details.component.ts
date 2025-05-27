import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-case-details',
  standalone: false,
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export default class CaseDetailsComponent {
  @Input() caseDetails: any;
}
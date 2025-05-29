import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-appeal-main',
  templateUrl: './appeal-main.component.html',
  styleUrl: './appeal-main.component.scss'
})
export class AppealMainComponent {
  goBack() { }
  goForward() { }
  save() { }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DFADashProjectRoutingModule } from './project-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { CoreModule } from 'src/app/core/core.module';
import { FeatureEnabledDirective } from 'src/app/core/directives/feature-enabled.directive';
import { ProjectAppealRationaleComponent } from './project-appeal/project-appeal-rationale/project-appeal-rationale.component';
import { DfaDashProjectComponent } from './project/project.component';
import { ProjectAppealComponent } from './project-appeal/project-appeal.component';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [DfaDashProjectComponent, ProjectAppealRationaleComponent,ProjectAppealComponent ],
  imports: [ CommonModule, DFADashProjectRoutingModule, MatButtonModule, MatIconModule, CoreModule, MatSelectModule, FeatureEnabledDirective, MatStepperModule],
  exports: []
})
export class DFADashProjectModule { 
}

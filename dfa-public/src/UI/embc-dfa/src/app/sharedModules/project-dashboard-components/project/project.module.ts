import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from 'src/app/core/core.module';
import { FeatureEnabledDirective } from 'src/app/core/directives/feature-enabled.directive';
import { DFADashProjectRoutingModule } from './project-routing.module';
import { DfaDashProjectComponent } from './project.component';

@NgModule({
  declarations: [DfaDashProjectComponent],
  imports: [
    CommonModule,
    DFADashProjectRoutingModule,
    MatButtonModule,
    MatIconModule,
    CoreModule,
    MatSelectModule,
    FeatureEnabledDirective,
    MatStepperModule,
    MatTooltipModule
  ],
  exports: []
})
export class DFADashProjectModule {}

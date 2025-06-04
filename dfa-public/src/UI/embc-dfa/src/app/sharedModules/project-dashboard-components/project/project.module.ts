import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DFADashProjectRoutingModule } from './project-routing.module';
import { DfaDashProjectComponent } from './project.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { CoreModule } from 'src/app/core/core.module';
import { FeatureEnabledDirective } from 'src/app/core/directives/feature-enabled.directive';

@NgModule({
  declarations: [DfaDashProjectComponent],
  imports: [CommonModule, DFADashProjectRoutingModule, MatButtonModule, MatIconModule, CoreModule, MatSelectModule, FeatureEnabledDirective]
})
export class DFADashProjectModule { }

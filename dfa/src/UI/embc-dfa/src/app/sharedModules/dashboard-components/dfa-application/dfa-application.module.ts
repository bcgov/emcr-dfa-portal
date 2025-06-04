import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DFAApplicationRoutingModule } from './dfa-application-routing.module';
import { DfaApplicationComponent } from './dfa-application.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { CoreModule } from 'src/app/core/core.module';
import { FeatureEnabledDirective } from 'src/app/core/directives/feature-enabled.directive';

@NgModule({
  declarations: [DfaApplicationComponent],
  imports: [CommonModule, DFAApplicationRoutingModule, MatButtonModule, MatIconModule, CoreModule, FeatureEnabledDirective]
})
export class DFADashApplicationModule { }

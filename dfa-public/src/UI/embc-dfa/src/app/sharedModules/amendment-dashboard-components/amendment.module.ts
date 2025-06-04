import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DFADashAmendmentRoutingModule } from './amendment-routing.module';
import { DfaDashAmendmentComponent } from './amendment.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [DfaDashAmendmentComponent],
  imports: [CommonModule, DFADashAmendmentRoutingModule, MatButtonModule, MatIconModule, CoreModule, MatSelectModule]
})
export class DFADashAmendmentModule { }

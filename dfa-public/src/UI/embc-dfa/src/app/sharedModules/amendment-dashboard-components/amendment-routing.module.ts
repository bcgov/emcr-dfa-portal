import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DfaDashAmendmentComponent } from './amendment.component';

const routes: Routes = [{
  path: '', component: DfaDashAmendmentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFADashAmendmentRoutingModule { }

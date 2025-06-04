import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DFAAmendmentMainComponent } from './dfa-amendment-main.component';

const routes: Routes = [{ path: '', component: DFAAmendmentMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFAAmendmentMainRoutingModule {}

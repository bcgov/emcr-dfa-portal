import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DfaAppealComponent } from './dfa-appeal.component';

const routes: Routes = [
  { path: '', component: DfaAppealComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DfaAppealRoutingModule { }
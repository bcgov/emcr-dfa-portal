import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DfaDashProjectComponent } from './project/project.component';

const routes: Routes = [{
  path: '', component: DfaDashProjectComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFADashProjectRoutingModule { }

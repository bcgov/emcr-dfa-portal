import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DFAApplicationMainComponent } from './dfa-application-main.component';

const routes: Routes = [
  {
    path: '',
    component: DFAApplicationMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFAApplicationMainRoutingModule {}

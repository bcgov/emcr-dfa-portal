import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppealComponent } from './appeal.component';

const routes: Routes = [{ path: '', component: AppealComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppealRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppealMainComponent } from './appeal-main.component';

const routes: Routes = [{ path: '', component: AppealMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppealRoutingModule {}

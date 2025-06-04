import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewAmendmentComponent } from './review-amendment.component';

const routes: Routes = [{
  path: '', component: ReviewAmendmentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashReviewAmendmentRoutingModule { }

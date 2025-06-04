import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DFAAmendmentComponent } from './dfa-amendment-dashboard.component';

const routes: Routes = [{
  path: '', component: DFAAmendmentComponent,
  children: [
    {
      path: '',
      redirectTo: 'open',
      pathMatch: 'full'
    },
    {
      path: 'open',
      loadChildren: () =>
        import(
          'src/app/sharedModules/amendment-dashboard-components/amendment.module'
        ).then((m) => m.DFADashAmendmentModule),
      data: { flow: 'dfa-amendment-dashboard', apptype: 'open' }
    },
    {
      path: 'close',
      loadChildren: () =>
        import(
          'src/app/sharedModules/amendment-dashboard-components/amendment.module'
        ).then((m) => m.DFADashAmendmentModule),
      data: { flow: 'dfa-amendment-dashboard', apptype: 'closed' }
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFAAmendmentRoutingModule {}

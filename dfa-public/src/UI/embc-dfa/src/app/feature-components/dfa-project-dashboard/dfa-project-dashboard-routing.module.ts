import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DFAProjectComponent } from './dfa-project-dashboard.component';

const routes: Routes = [{
  path: '', component: DFAProjectComponent,
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
          'src/app/sharedModules/project-dashboard-components/project/project.module'
        ).then((m) => m.DFADashProjectModule),
      data: { flow: 'dfa-project-dashboard', apptype: 'open' }
    },
    {
      path: 'past',
      loadChildren: () =>
        import(
          'src/app/sharedModules/project-dashboard-components/project/project.module'
        ).then((m) => m.DFADashProjectModule),
      data: { flow: 'dfa-project-dashboard', apptype: 'closed' }
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DFAProjectRoutingModule {}

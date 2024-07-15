import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'registration-method',
    pathMatch: 'full'
  },
  {
    path: 'registration-method',
    loadChildren: () =>
      import('./login-page/login-page.module').then((m) => m.LoginPageModule)
  },
  {
    path: 'verified-registration',
    loadChildren: () =>
      import(
        './feature-components/verified-registration/verified-registration.module'
      ).then((m) => m.VerifiedRegistrationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dfa-application-start',
    loadChildren: () =>
      import(
        './feature-components/dfa-application-start/dfa-application-start.module'
      ).then((m) => m.DFAApplicationStartModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dfa-application-main/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-application-main/dfa-application-main.module'
      ).then((m) => m.DFAApplicationMainModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dfa-prescreening',
    loadChildren: () =>
      import(
        './feature-components/dfa-prescreening/dfa-prescreening.module'
      ).then((m) => m.DFAPrescreeningModule),
  },
  {
    path: 'dfa-dashboard',
    loadChildren: () =>
      import(
        './feature-components/dashboard/dashboard.module'
      ).then((m) => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'invite-error',
    loadChildren: () =>
      import('./feature-components/invite-error/invite-error.module').then(
        (m) => m.InviteErrorModule
      )
  },
  {
    path: 'outage',
    loadChildren: () =>
      import('./feature-components/outage/outage.module').then(
        (m) => m.OutageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

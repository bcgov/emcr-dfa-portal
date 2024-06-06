import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { AuthGuard } from './core/services/auth.guard';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

// 2024-05-27 EMCRI-217 waynezen: replace AuthGuard with built-in from angular-auth-oidc-client
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
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-application-start',
    loadChildren: () =>
      import(
        './feature-components/dfa-application-start/dfa-application-start.module'
      ).then((m) => m.DFAApplicationStartModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-application-main',
    loadChildren: () =>
      import(
        './feature-components/dfa-application-main/dfa-application-main.module'
      ).then((m) => m.DFAApplicationMainModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-application-main/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-application-main/dfa-application-main.module'
      ).then((m) => m.DFAApplicationMainModule),
    canActivate: [AutoLoginPartialRoutesGuard]
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
    canActivate: [AutoLoginPartialRoutesGuard]
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
  // 2024-05-28 EMCRI-217 waynezen: relativeLinkResolution no longer supported in Angular v15
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

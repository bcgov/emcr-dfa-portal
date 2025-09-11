import { ErrorHandler, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { AuthGuard } from './core/services/auth.guard';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardModule } from './sharedModules/components/dashboard/dashboard.module';
import { LoginPageModule } from './login-page/login-page.module';
import { EligibilityService } from './core/api/services/eligibility.service'
import { ContactService } from './core/api/services/contact.service';
import { ProjectAppealComponent } from './sharedModules/project-dashboard-components/project-appeal/project-appeal.component';

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
    path: 'dfa-appeal-main/:id/:appealId',
    loadChildren: () =>
      import(
        './feature-components/appeal-main/appeal-main.module'
      ).then((m) => m.AppealMainModule),
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
    path: 'dfa-application/:id/projects',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-dashboard/dfa-project-dashboard.module'
      ).then((m) => m.DFAProjectModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-application/:id/project/:projId',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-dashboard/dfa-project-dashboard.module'
      ).then((m) => m.DFAProjectModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-project/:id/claims',
    loadChildren: () =>
      import(
        './feature-components/dfa-claim-dashboard/dfa-claim-dashboard.module'
      ).then((m) => m.DFAClaimModule),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  //{
  //  path: 'dfa-claim/invoices',
  //  loadChildren: () =>
  //    import(
  //      './sharedModules/forms/dfa-claim-main-forms/dfa-invoice-dashboard/dfa-invoice-dashboard.module'
  //    ).then((m) => m.DFAInvoiceModule),
  //  canActivate: [AuthGuard]
  //},
  {
    path: 'dfa-prescreening',
    loadChildren: () =>
      import(
        './feature-components/dfa-prescreening/dfa-prescreening.module'
      ).then((m) => m.DFAPrescreeningModule),
  },
  {
    path: 'dfa-dashboard',
    //component: DashboardModule,
    loadChildren: () =>
      import(
        './feature-components/dashboard/dashboard.module'
      ).then((m) => m.DashboardModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-project-main',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-main/dfa-project-main.module'
      ).then((m) => m.DFAProjectMainModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-project-main/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-main/dfa-project-main.module'
      ).then((m) => m.DFAProjectMainModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-project-view/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-main/dfa-project-main.module'
      ).then((m) => m.DFAProjectMainModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-project-amendment/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-project-amendment/dfa-project-amendment.module'
      ).then((m) => m.DFAProjectAmendmentModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
    {
    path: 'dfa-project-amendments/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-amendment-dashboard/dfa-amendment-dashboard.module'
      ).then((m) => m.DFAAmendmentModule),
    canActivate: [AutoLoginPartialRoutesGuard]
  },
    {
    path: 'dfa-amendment-main',
    loadChildren: () =>
      import(
        './feature-components/dfa-amendment-main/dfa-amendment-main.module'
      ).then((m) => m.DFAAmendmentMainModule),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-amendment-main/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-amendment-main/dfa-amendment-main.module'
      ).then((m) => m.DFAAmendmentMainModule),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-claim-main',
    loadChildren: () =>
      import(
        './feature-components/dfa-claim-main/dfa-claim-main.module'
      ).then((m) => m.DFAClaimMainModule),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'dfa-claim-main/:id',
    loadChildren: () =>
      import(
        './feature-components/dfa-claim-main/dfa-claim-main.module'
      ).then((m) => m.DFAClaimMainModule),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'app-claim-decision/:id',
    loadComponent: () =>
      import(
        './sharedModules/claim-dashboard-components/claim-decision/claim-decision.component' 
      ).then((m) => m.ClaimDecisionComponent),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'claim/:claimId/appeal/:appealId/edit',
    loadComponent: () =>
      import('./sharedModules/claim-dashboard-components/claim-appeal/claim-appeal.component')
        .then((m) => m.ClaimAppealComponent),
      canActivate: [AutoLoginPartialRoutesGuard]
  },
  {
    path: 'claim/:claimId/appeal/:appealId/view',
    loadComponent: () =>
      import('./sharedModules/claim-dashboard-components/claim-appeal/claim-appeal.component')
        .then((m) => m.ClaimAppealComponent),
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
  },
  // {
  //   path: 'project/:projectId/appeal/:appealId/edit',
  //   loadComponent: () =>
  //     import('./sharedModules/project-dashboard-components/project-appeal/project-appeal.component')
  //       .then((m) => m.ProjectAppealComponent),
  //     canActivate: [AutoLoginPartialRoutesGuard]
  // },
  // {
  //   path: 'project/:projectId/appeal/:appealId/view',
  //   loadComponent: () =>
  //     import('./sharedModules/project-dashboard-components/project-appeal/project-appeal.component')
  //       .then((m) => m.ProjectAppealComponent),
  //     canActivate: [AutoLoginPartialRoutesGuard]
  // }
  {
  path: 'project/:projectId/appeal/:appealId/view',
  component: ProjectAppealComponent,
  canActivate: [AutoLoginPartialRoutesGuard]
},
  {
  path: 'project/:projectId/appeal/:appealId/edit',
  component: ProjectAppealComponent,
  canActivate: [AutoLoginPartialRoutesGuard]
}

  // {
  //   path: 'api/contacts/login',
  //   component: EligibilityService,
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'api/eligibility/checkPublicEventsAvailable',
  //   component: EligibilityService,
  //   pathMatch: 'full'
  // }

];

@NgModule({
  // 2024-05-28 EMCRI-217 waynezen: relativeLinkResolution no longer supported in Angular v15
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

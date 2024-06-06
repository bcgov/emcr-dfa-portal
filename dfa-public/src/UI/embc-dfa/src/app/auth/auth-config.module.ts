import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
  imports: [AuthModule.forRoot({
    config: {
      configId: "dev",
      authority: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
      redirectUrl: 'http://localhost:5200',
      postLogoutRedirectUri: window.location.origin,
      clientId: 'dfa-enhancement-5415',
      scope: 'openid profile', // 'openid profile offline_access ' + your scopes
      responseType: 'code',
      silentRenew: true,
      useRefreshToken: true,
      renewTimeBeforeTokenExpiresInSeconds: 30,
    }
  })],
  exports: [AuthModule],
})
export class AuthConfigModule {}

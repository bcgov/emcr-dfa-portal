import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule, LogLevel, PassedInitialConfig, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

export const httpLoaderFactory = (httpClient: HttpClient) => {
  const config$ = httpClient.get<any>(`assets/config/oidc.json`).pipe(
    map((customConfig: any) => {
      return {
        //configId: customConfig.configId,
        authority: customConfig.authority,
        redirectUrl: customConfig.redirectUrl,
        postLogoutRedirectUri: customConfig.postLogoutRedirectUri,
        clientId: customConfig.clientId,
        scope: customConfig.scope, // 'openid profile offline_access ' + your scopes
        autoUserInfo: customConfig.auto_userinfo,
        customParamsAuthRequest: {
            prompt: customConfig.prompt,
            kc_idp_hint: customConfig.kc_idp_hint,
        },
        responseType: customConfig.responseType,
        silentRenew: customConfig.silentRenew,
        useRefreshToken: customConfig.useRefreshToken,
        renewTimeBeforeTokenExpiresInSeconds: customConfig.renewTimeBeforeTokenExpiresInSeconds,
        // secureRoutes: ['/api'],
        historyCleanupOff: true,
        // LogLevel: None = 0, Debug = 1, Warn = 2, Error = 3
        logLevel: Number.isInteger(parseInt(customConfig.log_level)) ? parseInt(customConfig.log_level) : LogLevel.None,

      };
    })
  );

  return new StsConfigHttpLoader(config$);
};

@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}

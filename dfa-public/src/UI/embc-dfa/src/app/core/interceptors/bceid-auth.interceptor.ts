import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { first, mergeMap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../core/services/login.service';
import { LoginResponse } from 'angular-auth-oidc-client';

@Injectable()
export class BceidAuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  /* 
   * 2024-07-08 EMCRI-363 waynezen: for some reason, the angular-auth-oidc-client pkg 
   *  isn't setting the Authorization: Bearer token in the header.
   *  Must manually set the Bearer token.
  */


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("/api")) {
      if (this.loginService?.isAuthenticated$) {
        return this.loginService.getAccessToken().pipe(
          first(),
          mergeMap((token) => {

            if (token) {
              // console.log('[DFA] bceid-auth.interceptor: authenticated! token: ' + token);
              req = req.clone({
                setHeaders: { 'Authorization': `Bearer ${token}` }
              });

              return next.handle(req);
            }
            // console.log('[DFA] bceid-auth.interceptor: not authenticated!');
            return next.handle(req);
          })
        );
      }
      // console.log('[DFA] bceid-auth.interceptor: not authenticated!');
      return next.handle(req);
    }
    // console.log('[DFA] bceid-auth.interceptor: not authenticated!');
    return next.handle(req);

  }
    
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable, ReplaySubject, switchMap, mergeMap, tap, map, of, retry } from 'rxjs';
import { AuthenticatedResult, AuthModule, AuthOptions, LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { CacheService } from '../../core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
// 2024-07-26 EMCRI-507 waynezen: re-write to centralize oidcSecurityService calls
export class LoginService  {

  private _isAuth: boolean | null = null;
  private _accesstoken: string = null;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private cacheService: CacheService) {  }

  public checkAuth(): Observable<LoginResponse> {
    return this.oidcSecurityService.checkAuth()
      .pipe(
        tap((response: LoginResponse) => { 
          // console.debug('[DFA] loginService called oidcSecurityService.checkAuth() isAuthenticated: ' + response?.isAuthenticated);
          this._isAuth = response?.isAuthenticated;
          
          this._accesstoken = response?.accessToken;

          if (response?.isAuthenticated) {
            this._isAuth = true;
            this.isAuthenticated.next(true);
          }
        }));
  }

  public authorize() : void {
    // console.debug("[DFA] loginService authorize");
    this._isAuth = false;
    this.oidcSecurityService.authorize();
  }

  private isAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject(false);

  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticated.asObservable();

  public getAccessToken(): Observable<string> {
      return this.oidcSecurityService.getAccessToken()
        .pipe(
          tap((response: string) => {
            if (response) {
              // console.debug('[DFA] loginService returning access_token: ' + response);
              this._accesstoken = response;
            }
          }));
    }

    public logOff(): void {
      this.oidcSecurityService.logoffAndRevokeTokens();
      this.isAuthenticated.next(false);
      this.cacheService.clear();
      localStorage.clear();
  
    }
}
  

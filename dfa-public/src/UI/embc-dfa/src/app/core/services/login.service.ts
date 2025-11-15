import { Injectable } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, delay, Observable, tap } from 'rxjs';
import { CacheService } from '../../core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
// 2024-07-26 EMCRI-507 waynezen: re-write to centralize oidcSecurityService calls
export class LoginService {
  private _isAuth: boolean | null = null;
  private _accesstoken: string = null;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private cacheService: CacheService
  ) {}

  public checkAuth(): Observable<LoginResponse> {
    return this.oidcSecurityService.checkAuth().pipe(
      tap((response: LoginResponse) => {
        this._isAuth = response?.isAuthenticated;
        this._accesstoken = response?.accessToken;

        if (response?.isAuthenticated) {
          this._isAuth = true;
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  public authorize(): void {
    this._isAuth = false;
    this.oidcSecurityService.authorize();
  }

  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticated.asObservable().pipe(delay(500));

  public forceAuthenticated(): void {
    this.isAuthenticated.next(true);
  }

  public getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken().pipe(
      tap((response: string) => {
        if (response) {
          this._accesstoken = response;
        }
      })
    );
  }

  public logOff(): void {
    this.oidcSecurityService.logoff('').subscribe((result) => {
      localStorage.clear();
      this.cacheService.clear();
      this.isAuthenticated.next(false);
    });
  }
}

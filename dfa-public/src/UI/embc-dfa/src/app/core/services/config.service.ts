import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../../environments/environment';
import { CaptchaConfiguration, Configuration, OutageInformation } from '../api/models';
import { ConfigurationService } from '../api/services';
import { EnvironmentInformation } from '../model/environment-information.model';
import * as globalConst from '../services/globalConstants';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public environmentBanner: EnvironmentInformation;
  private configurationGetEnvironmentInfoPath: string;

  public get configuration(): Configuration {
    return JSON.parse(this.cacheService.get('configuration'));
  }

  public set configuration(v: Configuration) {
    this.cacheService.set('configuration', v);
  }

  constructor(
    public configurationService: ConfigurationService,
    public cacheService: CacheService,
    public http: HttpClient,
    public alertService: AlertService,
    @Inject(APP_BASE_HREF) public baseHref: string
  ) {
    // Set path based on environment
    if (this.isLocalDevelopment()) {
      this.configurationGetEnvironmentInfoPath = 'assets/env/info.json';
    } else {
      this.configurationGetEnvironmentInfoPath = 'env/info.json';
    }
  }

  /**
   * Return `true` if running in development mode (not production).
   *
   * @return {*}  {boolean}
   */
  isLocalDevelopment(): boolean {
    return !environment.production;
  }

  public async loadConfig(): Promise<Configuration> {
    if (this.configuration !== null && !this.isLocalDevelopment()) {
      // Use cached configuration when available, except for local development
      return this.configuration;
    }

    const config$ = this.configurationService.configurationGetConfiguration().pipe(
      tap((c: Configuration) => {
        this.configuration = c;
      })
    );

    return lastValueFrom(config$);
  }

  public loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    return new Promise<EnvironmentInformation>((resolve, reject) => {
      let environment: EnvironmentInformation = {};
      this.getEnvironment().subscribe({
        next: (env) => {
          environment = env;
          this.setEnvironmentBanner(env);
          resolve(environment);
        },
        error: (error) => {
          if (error.status === 400 || error.status === 404) {
            this.environmentBanner = null;
          } else {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.systemError);
          }
          reject(error);
        }
      });
    });
  }

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner
      ? this.environmentBanner
      : JSON.parse(this.cacheService.get('environment'))
        ? JSON.parse(this.cacheService.get('environment'))
        : this.getEnvironmentInfo();
  }

  public setEnvironmentBanner(environmentBanner: EnvironmentInformation): void {
    this.environmentBanner = environmentBanner;
    this.cacheService.set('environment', environmentBanner);
  }

  public getOutageConfiguration(): Observable<OutageInformation> {
    return this.configurationService.configurationGetOutageInfo();
  }

  public getCaptchaConfiguration(): CaptchaConfiguration {
    return this.configuration.captcha;
  }

  private getEnvironmentInfo(): EnvironmentInformation {
    let environment: EnvironmentInformation = {};
    this.getEnvironment().subscribe({
      next: (env) => {
        environment = env;
        this.setEnvironmentBanner(env);
      },
      error: (error) => {
        console.error('Environment Info not found');
        //document.location.href = 'https://dfa.gov.bc.ca/error.html';
      }
    });
    return environment;
  }

  public getEnvironment(): Observable<EnvironmentInformation> {
    return this.http.get<EnvironmentInformation>(this.configurationGetEnvironmentInfoPath);
  }
}

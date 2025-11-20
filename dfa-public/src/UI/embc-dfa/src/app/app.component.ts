import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeoutService } from 'src/app/core/services/timeout.service';
import { EnvironmentInformation } from './core/model/environment-information.model';
import { AlertService } from './core/services/alert.service';
import { BootstrapService } from './core/services/bootstrap.service';
import { ConfigService } from './core/services/config.service';
import * as globalConst from './core/services/globalConstants';
import { LoginService } from './core/services/login.service';
import { OutageService } from './feature-components/outage/outage.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  public color = '#169BD5';
  public environment: EnvironmentInformation = {};
  public gapi: any;

  constructor(
    public outageService: OutageService,
    public router: Router,
    private alertService: AlertService,
    private bootstrapService: BootstrapService,
    private loginService: LoginService,
    private configService: ConfigService,
    private timeOutService: TimeoutService
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.environment = await this.configService.loadEnvironmentBanner();
      await this.bootstrapService.init();
      // await this.loginService.tryLogin();
    } catch (error) {
      this.isLoading = false;
      if (error.status === 400 || error.status === 404) {
        this.environment = null;
      } else {
        this.isLoading = false;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    } finally {
      this.isLoading = false;
    }

    this.loginService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Initialize the timeout service after confirming the user is authenticated
        this.timeOutService.init({
          idle: {
            idleTimeoutMinutes: this.configService.configuration.timeoutInfo?.idleTimeoutMinutes ?? 25,
            idleTimeoutWarningMinutes: this.configService.configuration.timeoutInfo?.idleTimeoutWarningMinutes ?? 5
          },
          absolute: {
            absoluteTimeoutMinutes: this.configService.configuration.timeoutInfo?.absoluteTimeoutMinutes ?? 470,
            absoluteTimeoutWarningMinutes:
              this.configService.configuration.timeoutInfo?.absoluteTimeoutWarningMinutes ?? 10
          }
        });
      }
    });
  }

  public closeOutageBanner($event: boolean): void {
    this.outageService.setShowOutageBanner($event);
    this.outageService.closeBannerbyUser = !$event;
  }
}

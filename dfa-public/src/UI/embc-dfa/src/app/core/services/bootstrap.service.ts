import { Injectable } from '@angular/core';
import { OutageService } from 'src/app/feature-components/outage/outage.service';
import { AlertService } from './alert.service';
import { ConfigService } from './config.service';
import * as globalConst from './globalConstants';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  constructor(
    private configService: ConfigService,
    private outageService: OutageService,
    private alertService: AlertService
  ) {}

  public async init(): Promise<void> {
    try {
      // Load the application configuration
      await this.configService.loadConfig();
    } catch (error) {
      this.alertService.clearAlert();
      this.alertService.setAlert('danger', globalConst.systemError);
    }

    if (this.outageService.displayOutageInfoInit()) {
      this.outageService.initOutageType();
    }
  }
}

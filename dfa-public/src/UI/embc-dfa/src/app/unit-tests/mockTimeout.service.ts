import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Idle } from '@ng-idle/core';
import { TimeoutConfiguration } from '../core/api/models';
import { CacheService } from '../core/services/cache.service';
import { LoginService } from '../core/services/login.service';
import { TimeoutService, TimeoutServiceConfig } from '../core/services/timeout.service';

@Injectable({
  providedIn: 'root'
})
export class MockTimeoutService extends TimeoutService {
  public timedOut = false;
  public timeOutInfoVal: TimeoutConfiguration;
  private state = 'Started';

  constructor(
    public idle: Idle,
    public dialog: MatDialog,
    public loginService: LoginService,
    public cacheService: CacheService
  ) {
    super(idle, dialog, loginService, cacheService);
  }

  init(options: TimeoutServiceConfig) {
    this.idle.setIdle(options.idle.idleTimeoutMinutes * 60);
    this.idle.setTimeout(options.idle.idleTimeoutWarningMinutes * 60);

    this.idle.onIdleStart.subscribe(() => {
      this.state = 'Idle';
    });

    this.idle.onTimeout.subscribe(() => {
      this.timedOut = true;
    });
  }

  getState(): string {
    return this.state;
  }

  getTimeOut(): boolean {
    return this.timedOut;
  }
}

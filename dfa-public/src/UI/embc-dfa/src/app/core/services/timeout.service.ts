import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { AbsoluteTimeOutDialogComponent } from 'src/app/core/components/dialog-components/absolute-time-out-dialog/absolute-time-out-dialog.component';
import { TimeoutConfiguration } from '../api/models';
import { IdleTimeOutDialogComponent } from '../components/dialog-components/idle-time-out-dialog/idle-time-out-dialog.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { CacheService } from './cache.service';
import { LoginService } from './login.service';

export type TimeoutServiceConfig = {
  /**
   * Idle timeout settings.
   * Configures the timeout that logs the user out after a period of inactivity.
   */
  idle: {
    /**
     * The number of minutes of inactivity before the user is considered `idle` and shown the idle timeout warning
     * dialog.
     */
    idleTimeoutMinutes: number;
    /**
     * The number of minutes the user must remain `idle`, before they are logged out.
     */
    idleTimeoutWarningMinutes: number;
  };
  /**
   * Absolute timeout settings.
   * Configures the timeout that logs the user out after a fixed amount of time, regardless of activity.
   */
  absolute?: {
    /**
     * The number of minutes before the user is shown the absolute timeout warning dialog.
     */
    absoluteTimeoutMinutes: number;
    /**
     * The number of minutes after the absolute timeout warning is shown before the user is logged out.
     */
    absoluteTimeoutWarningMinutes: number;
  };
};

@Injectable({
  providedIn: 'root'
})
export class TimeoutService implements OnDestroy {
  public timeOutInfoVal: TimeoutConfiguration;

  private absoluteTimeoutHandle: any;

  constructor(
    public idle: Idle,
    public dialog: MatDialog,
    public loginService: LoginService,
    public cacheService: CacheService
  ) {}

  /**
   * Configures and starts the timeout service.
   *
   * @example
   * ```typescript
   * // The user will be considered idle after 25 minutes of inactivity, and will be logged out 5 minutes after that if
   * // they remain idle. Effectively, the user has 30 minutes of inactivity before being logged out.
   * timeoutService.init(25, 5);
   * ```
   *
   * @param {TimeoutServiceConfig} options
   */
  init(options: TimeoutServiceConfig) {
    if (options.absolute && options.absolute.absoluteTimeoutMinutes > 0) {
      // Start the absolute timeout
      this.startAbsoluteTimeout(
        options.absolute.absoluteTimeoutMinutes,
        options.absolute.absoluteTimeoutWarningMinutes
      );
    }

    if (options.idle && options.idle.idleTimeoutMinutes > 0) {
      // Start the idle timeout
      this.startIdleTimeout(options.idle.idleTimeoutMinutes, options.idle.idleTimeoutWarningMinutes);
    }
  }

  /**
   * Clears the idle timeout, stopping idle monitoring.
   *
   * @private
   */
  public clearIdleTimeout() {
    this.idle.stop();
  }

  /**
   * Clears the absolute timeout, stopping the absolute timeout countdown.
   *
   * @private
   */
  public clearAbsoluteTimeout() {
    if (!this.absoluteTimeoutHandle) {
      return;
    }

    clearTimeout(this.absoluteTimeoutHandle);
    this.absoluteTimeoutHandle = null;
  }

  /**
   * Open the idle timeout warning dialog.
   *
   * @return {*}
   */
  private openIdleTimeOutDialog() {
    return this.dialog.open(DialogComponent, {
      data: {
        component: IdleTimeOutDialogComponent,
        initDialog: 1 * 60,
        idle: this.idle,
        hideCloseButton: true
      },
      width: '560px',
      disableClose: true
    });
  }

  /**
   * Open the absolute timeout warning dialog.
   *
   * @return {*}
   */
  private openAbsoluteTimeOutDialog(absoluteTimeoutWarningMinutes: number) {
    return this.dialog.open(DialogComponent, {
      data: {
        component: AbsoluteTimeOutDialogComponent,
        countdownMinutes: absoluteTimeoutWarningMinutes,
        hideCloseButton: true
      },
      width: '560px',
      disableClose: true
    });
  }

  /**
   * Configures and starts the idle timeout monitoring.
   *
   * Shows a warning dialog after `idleTimeoutMinutes` minutes of inactivity, and then log the user out after
   * `idleTimeoutWarningMinutes` minutes if they remain inactive. New activity resets the idle timeout.
   *
   * @private
   * @param {number} idleTimeoutMinutes The number of minutes of inactivity before the user is considered idle.
   * @param {number} idleTimeoutWarningMinutes The number of minutes the user must remain `idle`, before they
   * are logged out.
   */
  private startIdleTimeout(idleTimeoutMinutes: number, idleTimeoutWarningMinutes: number) {
    this.clearIdleTimeout();

    this.idle.setIdle(idleTimeoutMinutes * 60);
    this.idle.setTimeout(idleTimeoutWarningMinutes * 60);

    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      // Temporarily disable interrupts to allow the user to click the dialog button without
      // immediately cancelling the idle state on mouse movement.
      this.idle.clearInterrupts();

      this.openIdleTimeOutDialog()
        .afterClosed()
        .subscribe(() => {
          // Re-enable interrupts and resume watching for inactivity
          this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
          this.idle.watch();
        });
    });

    this.idle.onTimeout.subscribe(() => {
      this.dialog.closeAll();
      this.signOut();
    });

    // Start watching for inactivity
    this.idle.watch();
  }

  /**
   * Configures and starts an absolute timeout countdown.
   *
   * Shows a warning dialog after `absoluteTimeoutMinutes` minutes, and then log the user out after
   * `absoluteTimeoutWarningMinutes` minutes, regardless of continued activity.
   *
   * @param {number} absoluteTimeoutMinutes The number of minutes until the warning dialog is shown.
   * @param {number} absoluteTimeoutWarningMinutes The number of minutes after the warning is displayed before
   * the user is logged out.
   */
  private startAbsoluteTimeout(absoluteTimeoutMinutes: number, absoluteTimeoutWarningMinutes: number) {
    // Clear any existing absolute timeout
    this.clearAbsoluteTimeout();

    // Set a timeout to show the absolute timeout warning dialog
    this.absoluteTimeoutHandle = setTimeout(
      () => {
        // Show the absolute timeout warning dialog
        this.openAbsoluteTimeOutDialog(absoluteTimeoutWarningMinutes);

        // Set a new timeout to actually log out after the absolute timeout warning duration
        this.absoluteTimeoutHandle = setTimeout(
          () => {
            this.dialog.closeAll();
            this.signOut();
          },
          absoluteTimeoutWarningMinutes * 1000 * 60
        );
      },
      absoluteTimeoutMinutes * 1000 * 60
    );
  }

  /**
   * Signs the user out and clears the cache and local storage.
   *
   * @return {*}  {Promise<void>}
   */
  private async signOut(): Promise<void> {
    this.clearIdleTimeout();
    this.clearAbsoluteTimeout();

    this.loginService.logOff();
  }

  ngOnDestroy(): void {
    this.clearIdleTimeout();
    this.clearAbsoluteTimeout();
  }
}

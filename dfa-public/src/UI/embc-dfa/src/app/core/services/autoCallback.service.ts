import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

export type AutoCallbackParams = {
  /**
   * The function to call on a timer, or manually via `trigger`.
   */
  callback: () => void;
  /**
   * How often to call the callback function (seconds).
   */
  intervalSeconds?: number;
  /**
   * Only run the callback if the user has been idle for `intervalSeconds`.
   */
  whenIdle?: boolean;
  /**
   * Set to `true` to reset the interval timer after a manual trigger.
   *
   * @type {boolean}
   */
  resetOnManualTrigger?: boolean;
  /**
   * Set to `true` to catch and squash callback errors.
   */
  squashErrors?: boolean;
};

/**
 * Simple service that triggers a callback on a timer.
 *
 * @export
 * @class AutoCallbackService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class AutoCallbackService implements OnDestroy {
  private callbackSubject = new Subject<void>();

  private intervalSubscription?: Subscription;

  private idleTimeoutHandle?: ReturnType<typeof setTimeout>;
  private activitySubscription?: Subscription;

  private callbackSubscription?: Subscription;

  private params?: AutoCallbackParams;

  /**
   * Start auto-callback timer.
   *
   * @param {AutoCallbackParams} params
   */
  start(params: AutoCallbackParams): void {
    this.stop();

    this.params = params;

    if (params.whenIdle) {
      this.startIdleTimer(params);
    } else {
      this.startIntervalTimer(params);
    }

    this.startManualTriggerSubscription(params);
  }

  /**
   * Start the interval timer.
   *
   * Calls the callback function every `intervalSeconds` seconds.
   *
   * @private
   * @param {AutoCallbackParams} { callback, intervalSeconds, squashErrors }
   */
  private startIntervalTimer({ callback, intervalSeconds, squashErrors }: AutoCallbackParams): void {
    this.intervalSubscription?.unsubscribe();

    const interval = (intervalSeconds ?? 60) * 1000;

    this.intervalSubscription = timer(interval, interval).subscribe(() => {
      try {
        callback();
      } catch (error) {
        if (!squashErrors) {
          throw error;
        }
      }
    });
  }

  /**
   * Start an idle countdown timer.
   *
   * Calls the callback function if there is no user activity for `intervalSeconds` seconds.
   *
   * @private
   * @param {AutoCallbackParams} params
   */
  private startIdleTimer(params: AutoCallbackParams): void {
    this.activitySubscription?.unsubscribe();
    clearTimeout(this.idleTimeoutHandle);

    // Monitor user activity events
    const activityEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'click'),
      fromEvent(window, 'focus')
    ).pipe(throttleTime(5000)); // Throttle to avoid excessive resets

    // Subscribe to user activity events, resetting the idle timer on each event
    this.activitySubscription = activityEvents$.subscribe(() => {
      // Reset the idle countdown timer on user activity
      this.startIdleCountdown(params);
    });

    // Start the initial idle countdown timer
    this.startIdleCountdown(params);
  }

  /**
   * Starts a countdown, that upon reaching 0 triggers the callback.
   *
   * @param {AutoCallbackParams} { callback, intervalSeconds, squashErrors }
   */
  startIdleCountdown({ callback, intervalSeconds, squashErrors }: AutoCallbackParams) {
    clearTimeout(this.idleTimeoutHandle);

    let interval = (intervalSeconds ?? 60) * 1000;

    interval = 10000;

    this.idleTimeoutHandle = setTimeout(() => {
      try {
        callback();
      } catch (error) {
        if (!squashErrors) {
          throw error;
        }
      }
    }, interval);
  }

  /**
   * Create the manual trigger subscription. Must be called once during start().
   *
   * @private
   * @param {AutoCallbackParams} { callback, squashErrors }
   */
  private startManualTriggerSubscription({ callback, squashErrors }: AutoCallbackParams): void {
    this.callbackSubscription?.unsubscribe();

    this.callbackSubscription = this.callbackSubject.pipe(debounceTime(1000)).subscribe(() => {
      try {
        callback();
      } catch (error) {
        if (!squashErrors) {
          throw error;
        }
      }
    });
  }

  /**
   * Manually trigger the callback.
   */
  trigger(): void {
    this.callbackSubject.next();

    if (this.params?.resetOnManualTrigger) {
      if (this.params?.whenIdle) {
        this.startIdleCountdown(this.params);
      } else {
        this.startIntervalTimer(this.params);
      }
    }
  }

  /**
   * Reset and restart all timers.
   *
   * @param {AutoCallbackParams} params
   */
  reset(params: AutoCallbackParams): void {
    this.start(params);
  }

  /**
   * Stop/unsubscribe all timers.
   *
   * Must call `stop` in your components `ngOnDestroy`.
   */
  stop(): void {
    this.intervalSubscription?.unsubscribe();

    this.activitySubscription?.unsubscribe();
    clearTimeout(this.idleTimeoutHandle);

    this.callbackSubscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stop();
  }
}

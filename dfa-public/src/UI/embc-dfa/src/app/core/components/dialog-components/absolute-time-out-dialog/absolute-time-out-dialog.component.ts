import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * A dialog displaying a warning that the user will be logged out soon due to reaching a maximum session length.
 *
 * Used in conjunction with `timeout.service.ts`.
 *
 * @export
 * @class AbsoluteTimeOutDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-absolute-time-out-dialog',
  templateUrl: './absolute-time-out-dialog.component.html',
  styleUrls: ['./absolute-time-out-dialog.component.scss'],
  standalone: false
})
export class AbsoluteTimeOutDialogComponent implements OnInit, OnDestroy {
  @Input() countdownMinutes: number;
  @Output() outputEvent = new EventEmitter<string>();

  private intervalId: any;

  countdown: number;

  constructor() {}

  ngOnInit(): void {
    this.countdown = this.countdownMinutes * 60; // Convert to seconds

    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  close(): void {
    this.outputEvent.emit('close');
  }
}

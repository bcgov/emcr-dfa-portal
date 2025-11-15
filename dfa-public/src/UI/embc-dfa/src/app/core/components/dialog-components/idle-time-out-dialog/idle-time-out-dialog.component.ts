import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Idle } from '@ng-idle/core';

/**
 * A dialog displaying a warning that the user will be logged out soon due to inactivity.
 *
 * Used in conjunction with `timeout.service.ts`.
 *
 * @export
 * @class IdleTimeOutDialogComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-idle-time-out-dialog',
  templateUrl: './idle-time-out-dialog.component.html',
  styleUrls: ['./idle-time-out-dialog.component.scss'],
  standalone: false,
})
export class IdleTimeOutDialogComponent implements OnInit {
  @Input() idle: Idle;
  @Input() initDialog: number;
  @Output() outputEvent = new EventEmitter<string>();
  countdown: number;

  constructor() {}

  ngOnInit(): void {
    this.countdown = this.initDialog;
    this.idle.onIdleEnd.subscribe(() => {
      this.outputEvent.emit('close');
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.countdown = countdown;
    });
  }

  close(): void {
    this.outputEvent.emit('close');
  }
}

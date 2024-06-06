import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// 2024-05-27 EMCRI-217 waynezen: re-write to use new BCeID async Auth
export class LoginService  {

  private logoutStatus:BehaviorSubject<string> = new BehaviorSubject<string>('');
  private currentStatus:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentPortalUser: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getLogoutStatus = this.logoutStatus.asObservable();
  getCurrentStatus = this.currentStatus.asObservable();
  getCurrentPortalUser = this.currentPortalUser.asObservable();

  constructor() { }

  logoutUser(status){
    this.logoutStatus.next(status);
  }

  currentUser(status){
    this.currentStatus.next(status);
  }

  emitCurrentPortalUser(user) {
    this.currentPortalUser.next(user);
  }

}

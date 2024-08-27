import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FormCreationService } from '../core/services/formCreation.service';
import { LoginService } from '../core/services/login.service';
import { LoginResponse } from 'angular-auth-oidc-client';
import { first, last } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
//  private formCreationService: FormCreationService,
    private loginService: LoginService,
  ) {

    // console.debug('[DFA] login-page constructor');
  }

  ngOnInit(): void {
    //this.formCreationService.clearProfileData();
    // console.debug('[DFA] login page component!');

  // 2024-07-28 EMCRI-507 waynezen; 
   this.loginService
    .checkAuth()
    .pipe(first())
    .subscribe((response: LoginResponse) => {
        // console.debug('[DFA] login-page isAuthenticated123: ' + response?.isAuthenticated);
        if (response?.isAuthenticated)
          {
            this.router.navigate(['/dfa-dashboard']);
          }
          else
          {
            this.router.navigate(['/']);
          }
    });
  } 

  verifyUser(): void {
  }

  login() {

    this.loginService.authorize();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FormCreationService } from '../core/services/formCreation.service';
import { LoginService } from '../core/services/login.service';
import { LoginResponse } from 'angular-auth-oidc-client';
import { first, last, tap } from 'rxjs';
import { ContactService } from 'src/app/core/api/services';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private router: Router,
//  private formCreationService: FormCreationService,
    private loginService: LoginService,
    private contactService: ContactService,
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
            // 2024-09-23 EMCRI-663 waynezen: audit event for when a user successfully logs in - example only
            this.contactService.contactCreateAuditEvent({eventMoniker: 'logged in'})
            .pipe(tap())
            .subscribe((response: String) => {
              // console.debug('[DFA] created audit event?');
            });
                  
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

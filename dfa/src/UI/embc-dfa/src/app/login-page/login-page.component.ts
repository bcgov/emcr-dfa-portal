import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormCreationService } from 'src/app/core/services/formCreation.service';
import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  constructor(
    private router: Router,
    private formCreationService: FormCreationService,
    private loginService: LoginService
  ) {
    this.loginService.logout();
  }
  ngOnInit(): void {
    this.formCreationService.clearProfileData();
  }

  verifyUser(): void {
    this.router.navigate(['/verified-registration']);
  }
}

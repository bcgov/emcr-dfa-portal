import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from '../core/services/login.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(waitForAsync(() => {
    let loginService: jasmine.SpyObj<LoginService>;
    TestBed.configureTestingModule({
    declarations: [LoginPageComponent],
    imports: [RouterTestingModule,
        ReactiveFormsModule,
        OAuthModule.forRoot()],
    providers: [
        UntypedFormBuilder,
        { provides: LoginService, useValue: loginService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

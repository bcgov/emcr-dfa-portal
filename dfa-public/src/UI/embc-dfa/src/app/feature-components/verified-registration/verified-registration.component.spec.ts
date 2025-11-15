import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifiedRegistrationComponent } from './verified-registration.component';

describe('VerifiedRegistrationComponent', () => {
  let app: VerifiedRegistrationComponent;
  let fixture: ComponentFixture<VerifiedRegistrationComponent>;
  let component: VerifiedRegistrationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VerifiedRegistrationComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, MatDialogModule],
      providers: [
        UntypedFormBuilder,
        VerifiedRegistrationComponent,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedRegistrationComponent);
    app = fixture.componentInstance;
    component = TestBed.inject(VerifiedRegistrationComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(app).toBeTruthy();
  });
});

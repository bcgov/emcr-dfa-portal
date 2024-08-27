import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsaAddressComponent } from './usa-address.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UsaAddressComponent', () => {
  let component: UsaAddressComponent;
  let fixture: ComponentFixture<UsaAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [UsaAddressComponent],
    imports: [MatAutocompleteModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsaAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

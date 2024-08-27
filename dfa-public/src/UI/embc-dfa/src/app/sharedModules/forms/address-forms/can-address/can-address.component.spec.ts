import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanAddressComponent } from './can-address.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CanAddressComponent', () => {
  let component: CanAddressComponent;
  let fixture: ComponentFixture<CanAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [CanAddressComponent],
    imports: [MatAutocompleteModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

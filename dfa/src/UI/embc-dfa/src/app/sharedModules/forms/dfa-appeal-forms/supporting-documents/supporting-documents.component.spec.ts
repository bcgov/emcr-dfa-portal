import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import SupportingDocumentsComponent from 'src/app/sharedModules/forms/dfa-application-main-forms/supporting-documents/supporting-documents.component';

describe('SupportingDocumentsComponent', () => {
  let component: SupportingDocumentsComponent;
  let fixture: ComponentFixture<SupportingDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SupportingDocumentsComponent],
      imports: [MatAutocompleteModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

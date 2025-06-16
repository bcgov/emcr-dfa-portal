import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppealDocumentsComponent } from 'src/app/feature-components/appeal-main/appeal-documents/appeal-documents.component';

describe('AppealDocumentsComponent', () => {
  let component: AppealDocumentsComponent;
  let fixture: ComponentFixture<AppealDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppealDocumentsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppealDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

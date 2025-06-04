import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppealProjectDetailsComponent } from 'src/app/feature-components/appeal-main/appeal-project-details/appeal-project-details.component';

describe('AppealProjectDetailsComponent', () => {
  let component: AppealProjectDetailsComponent;
  let fixture: ComponentFixture<AppealProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppealProjectDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppealProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

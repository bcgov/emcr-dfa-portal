import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealMainComponent } from './appeal-main.component';

describe('AppealMainComponent', () => {
  let component: AppealMainComponent;
  let fixture: ComponentFixture<AppealMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppealMainComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppealMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

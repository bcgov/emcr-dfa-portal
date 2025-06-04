import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealConfirmationDialogComponent } from './appeal-confirmation-dialog.component';

describe('AppealConfirmationDialogComponent', () => {
  let component: AppealConfirmationDialogComponent;
  let fixture: ComponentFixture<AppealConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppealConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppealConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

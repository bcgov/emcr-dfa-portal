import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAppealRationaleComponent } from './project-appeal-rationale.component';

describe('ProjectAppealRationaleComponent', () => {
  let component: ProjectAppealRationaleComponent;
  let fixture: ComponentFixture<ProjectAppealRationaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAppealRationaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAppealRationaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

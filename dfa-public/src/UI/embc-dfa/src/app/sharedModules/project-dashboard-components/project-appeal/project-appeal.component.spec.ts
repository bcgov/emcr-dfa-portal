import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAppealComponent } from './project-appeal.component';

describe('ProjectAppealComponent', () => {
  let component: ProjectAppealComponent;
  let fixture: ComponentFixture<ProjectAppealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAppealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAppealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

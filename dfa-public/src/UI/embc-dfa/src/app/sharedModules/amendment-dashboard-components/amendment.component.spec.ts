import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfaDashProjectComponent } from './project.component';

describe('DfaApplicationComponent', () => {
  let component: DfaDashProjectComponent;
  let fixture: ComponentFixture<DfaDashProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DfaDashProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DfaDashProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplication1Component } from './create-application1.component';

describe('CreateApplication1Component', () => {
  let component: CreateApplication1Component;
  let fixture: ComponentFixture<CreateApplication1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApplication1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateApplication1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutageBannerComponent } from './outage-banner.component';

describe('OutageBannerComponent', () => {
  let component: OutageBannerComponent;
  let fixture: ComponentFixture<OutageBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutageBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutageBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

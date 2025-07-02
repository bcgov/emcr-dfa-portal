import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewingComponent } from './document-viewing.component';

describe('DocumentViewingComponent', () => {
  let component: DocumentViewingComponent;
  let fixture: ComponentFixture<DocumentViewingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentViewingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentViewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

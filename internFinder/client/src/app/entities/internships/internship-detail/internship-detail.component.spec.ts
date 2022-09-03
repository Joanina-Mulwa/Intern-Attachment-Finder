import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipDetailComponent } from './internship-detail.component';

describe('InternshipDetailComponent', () => {
  let component: InternshipDetailComponent;
  let fixture: ComponentFixture<InternshipDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

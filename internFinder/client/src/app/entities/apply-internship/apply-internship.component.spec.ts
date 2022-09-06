import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyInternshipComponent } from './apply-internship.component';

describe('ApplyInternshipComponent', () => {
  let component: ApplyInternshipComponent;
  let fixture: ComponentFixture<ApplyInternshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyInternshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyInternshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

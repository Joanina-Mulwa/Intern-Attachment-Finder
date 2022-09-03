import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipEditComponent } from './internship-edit.component';

describe('InternshipEditComponent', () => {
  let component: InternshipEditComponent;
  let fixture: ComponentFixture<InternshipEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternshipEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternshipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

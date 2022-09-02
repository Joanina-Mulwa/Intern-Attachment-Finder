import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioDetailComponent } from './bio-detail.component';

describe('BioDetailComponent', () => {
  let component: BioDetailComponent;
  let fixture: ComponentFixture<BioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

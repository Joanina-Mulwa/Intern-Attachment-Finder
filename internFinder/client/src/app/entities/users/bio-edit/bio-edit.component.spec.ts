import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioEditComponent } from './bio-edit.component';

describe('BioEditComponent', () => {
  let component: BioEditComponent;
  let fixture: ComponentFixture<BioEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

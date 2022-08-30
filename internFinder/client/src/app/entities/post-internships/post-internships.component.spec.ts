import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInternshipsComponent } from './post-internships.component';

describe('PostInternshipsComponent', () => {
  let component: PostInternshipsComponent;
  let fixture: ComponentFixture<PostInternshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostInternshipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

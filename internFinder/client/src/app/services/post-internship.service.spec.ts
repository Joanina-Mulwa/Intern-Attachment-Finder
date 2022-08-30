import { TestBed } from '@angular/core/testing';

import { PostInternshipService } from './post-internship.service';

describe('PostInternshipService', () => {
  let service: PostInternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostInternshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

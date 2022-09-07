import { TestBed } from '@angular/core/testing';

import { ApplyInternshipService } from './apply-internship.service';

describe('ApplyInternshipService', () => {
  let service: ApplyInternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplyInternshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

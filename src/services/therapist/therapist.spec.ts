import { TestBed } from '@angular/core/testing';

import { TherapistService } from './therapist';

describe('Therapist', () => {
  let service: TherapistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TherapistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

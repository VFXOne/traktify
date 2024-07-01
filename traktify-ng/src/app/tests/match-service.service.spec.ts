import { TestBed } from '@angular/core/testing';

import { MatchService } from '../services/match.service';

describe('MatchServiceService', () => {
  let service: MatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WorkSpaceTeamService } from './work-space-team.service';

describe('WorkSpaceTeamService', () => {
  let service: WorkSpaceTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSpaceTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

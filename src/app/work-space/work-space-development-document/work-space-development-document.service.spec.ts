import { TestBed } from '@angular/core/testing';
import { WorkspaceService } from '../workspace.service';


describe('WorkSpaceService', () => {
  let service: WorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

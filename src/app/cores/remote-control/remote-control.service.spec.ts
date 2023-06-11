import { TestBed } from '@angular/core/testing';

import { RemoteControlService } from './remote-control.service';

describe('RemoteControlService', () => {
  let service: RemoteControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

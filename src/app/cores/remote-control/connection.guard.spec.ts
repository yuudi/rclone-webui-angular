import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { connectionGuard } from './connection.guard';
import { ConnectionService, NoAuthentication } from './connection.service';

describe('connectionGuard', () => {
  let mockConnectionService: any;
  let mockRouter: any;
  let originalConnectSelf: boolean;

  beforeEach(() => {
    originalConnectSelf = environment.connectSelf;

    mockConnectionService = {
      activateConnection: vi.fn(),
      getActiveConnection: vi.fn(),
      getConnectionsValue: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  afterEach(() => {
    environment.connectSelf = originalConnectSelf;
  });

  const runGuard = () => {
    return TestBed.runInInjectionContext(() =>
      connectionGuard(null as any, null as any),
    );
  };

  it('should activate self connection and return true if connectSelf is enabled', async () => {
    environment.connectSelf = true;
    const result = await runGuard();
    expect(result).toBe(true);
    expect(mockConnectionService.activateConnection).toHaveBeenCalledWith(
      'self',
      NoAuthentication,
    );
  });

  it('should return true if there is an active connection', async () => {
    environment.connectSelf = false;
    mockConnectionService.getActiveConnection.mockReturnValue({
      id: 'active-conn',
    });

    const result = await runGuard();
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should activate the connection if only one saved connection exists with saved credentials', async () => {
    environment.connectSelf = false;
    mockConnectionService.getActiveConnection.mockReturnValue(null);
    mockConnectionService.getConnectionsValue.mockResolvedValue([
      { id: 'only-conn', authentication: 'some-auth' },
    ]);

    const result = await runGuard();
    expect(result).toBe(true);
    expect(mockConnectionService.activateConnection).toHaveBeenCalledWith(
      'only-conn',
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to connection page and return false if no active connection and no single saved connection with credentials', async () => {
    environment.connectSelf = false;
    mockConnectionService.getActiveConnection.mockReturnValue(null);
    mockConnectionService.getConnectionsValue.mockResolvedValue([]);

    const result = await runGuard();
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['connection']);
  });
});

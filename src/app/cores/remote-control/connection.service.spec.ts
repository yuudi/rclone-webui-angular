import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppStorageService } from '../storage/app-storage.service';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
  let service: ConnectionService;
  let mockAppStorageService: any;
  let mockStorageItem: any;
  let storageValue: any[];

  beforeEach(() => {
    storageValue = [];
    mockStorageItem = {
      get: vi.fn().mockImplementation(() => Promise.resolve(storageValue)),
      set: vi.fn().mockImplementation((val) => {
        storageValue = val;
      }),
      asObservable: vi.fn().mockImplementation(() => of(storageValue)),
    };

    mockAppStorageService = {
      getObservableItem: vi.fn().mockReturnValue(mockStorageItem),
    };

    TestBed.configureTestingModule({
      providers: [
        ConnectionService,
        { provide: AppStorageService, useValue: mockAppStorageService },
      ],
    });

    service = TestBed.inject(ConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(mockAppStorageService.getObservableItem).toHaveBeenCalledWith(
      'connections',
      expect.any(Function),
    );
  });

  it('should save connection and generate uuid', async () => {
    const conn = await service.saveConnection(
      { displayName: 'Local rclone', remoteAddress: 'http://localhost:5572' },
      { username: 'user', password: 'password' },
    );

    expect(conn.id).toBeTruthy();
    expect(conn.displayName).toBe('Local rclone');
    expect(conn.remoteAddress).toBe('http://localhost:5572');
    expect(conn.authentication).toBe(btoa('user:password'));
    expect(storageValue.length).toBe(1);
    expect(storageValue[0]).toEqual(conn);
  });

  it('should throw error if name already exists when saving', async () => {
    storageValue = [
      {
        id: '123',
        displayName: 'DupName',
        remoteAddress: 'http://localhost:5572',
        isSameOrigin: false,
        authentication: null,
      },
    ];

    await expect(
      service.saveConnection({
        displayName: 'DupName',
        remoteAddress: 'http://another',
      }),
    ).rejects.toThrow('Name already exists');
  });

  it('should get connection by id', async () => {
    const conn = {
      id: 'conn-id',
      displayName: 'Name',
      remoteAddress: 'http://localhost:5572',
      isSameOrigin: false,
      authentication: null,
    };
    storageValue = [conn];

    const result = await service.getConnection('conn-id');
    expect(result).toEqual(conn);

    const notFound = await service.getConnection('non-existent');
    expect(notFound).toBeNull();
  });

  it('should update connection credentials and fields', async () => {
    const conn = {
      id: 'conn-id',
      displayName: 'Name',
      remoteAddress: 'http://localhost:5572',
      isSameOrigin: false,
      authentication: null,
    };
    storageValue = [conn];

    await service.updateConnection(
      'conn-id',
      { displayName: 'New Name' },
      { username: 'foo', password: 'bar' },
    );
    expect(storageValue[0].displayName).toBe('New Name');
    expect(storageValue[0].authentication).toBe(btoa('foo:bar'));
  });

  it('should activate connection and expose it', async () => {
    const conn = {
      id: 'conn-id',
      displayName: 'Name',
      remoteAddress: 'http://localhost:5572',
      isSameOrigin: false,
      authentication: btoa('u:p'),
    };
    storageValue = [conn];

    expect(service.getActiveConnection()).toBeNull();

    await service.activateConnection('conn-id');
    expect(service.getActiveConnection()).toEqual(conn);
  });

  it('should delete connection', async () => {
    const conn = {
      id: 'conn-id',
      displayName: 'Name',
      remoteAddress: 'http://localhost:5572',
      isSameOrigin: false,
      authentication: null,
    };
    storageValue = [conn];

    await service.deleteConnection('conn-id');
    expect(storageValue.length).toBe(0);
  });
});

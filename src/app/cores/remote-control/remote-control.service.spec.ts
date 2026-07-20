import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RemoteControlService } from './remote-control.service';
import { ConnectionService, NoAuthentication } from './connection.service';

describe('RemoteControlService', () => {
  let service: RemoteControlService;
  let httpMock: HttpTestingController;
  let mockConnectionService: any;

  beforeEach(() => {
    mockConnectionService = {
      getActiveConnection: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RemoteControlService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ConnectionService, useValue: mockConnectionService },
      ],
    });

    service = TestBed.inject(RemoteControlService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('call', () => {
    it('should throw error if active connection is not set', () => {
      mockConnectionService.getActiveConnection.mockReturnValue(null);
      expect(() => service.call('noop')).toThrow('Remote address is not set');
    });

    it('should make post request with auth header if credentials exist', async () => {
      mockConnectionService.getActiveConnection.mockReturnValue({
        remoteAddress: 'http://localhost:5572',
        authentication: 'dXNlcjpwYXNz',
      });

      const responsePromise = service.call<{ success: boolean }>('noop', { arg: 'val' });

      const req = httpMock.expectOne('http://localhost:5572/noop');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ arg: 'val' });
      expect(req.request.headers.get('Authorization')).toBe('Basic dXNlcjpwYXNz');

      req.flush({ success: true });

      const result = await responsePromise;
      expect(result).toEqual({ success: true });
    });

    it('should handle and translate http errors', async () => {
      mockConnectionService.getActiveConnection.mockReturnValue({
        remoteAddress: 'http://localhost:5572',
        authentication: null,
      });

      const responsePromise = service.call('noop');

      const req = httpMock.expectOne('http://localhost:5572/noop');
      req.flush({ error: 'invalid password' }, { status: 401, statusText: 'Unauthorized' });

      await expect(responsePromise).rejects.toThrow('invalid password');
    });
  });

  describe('getDownloadUrl', () => {
    it('should construct correct download url', () => {
      mockConnectionService.getActiveConnection.mockReturnValue({
        remoteAddress: 'http://localhost:5572',
      });
      const url = service.getDownloadUrl('drive', 'path/to/file.txt');
      expect(url).toBe('http://localhost:5572/[drive:]/path/to/file.txt');
    });
  });

  describe('testConnection', () => {
    it('should verify connection success on 200', async () => {
      const conn = {
        remoteAddress: 'http://localhost:5572',
        credential: { username: 'user', password: 'password' },
      };

      const testPromise = service.testConnection(conn, false);

      const req = httpMock.expectOne('http://localhost:5572/rc/noop');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Basic dXNlcjpwYXNzd29yZA==');
      req.flush({}, { status: 200, statusText: 'OK' });

      expect(await testPromise).toBe(true);
    });

    it('should return false on failure', async () => {
      const conn = {
        remoteAddress: 'http://localhost:5572',
        credential: NoAuthentication,
      };

      const testPromise = service.testConnection(conn, true);

      const req = httpMock.expectOne('http://localhost:5572/rc/noopauth');
      req.flush({}, { status: 500, statusText: 'Internal Error' });

      expect(await testPromise).toBe(false);
    });
  });
});

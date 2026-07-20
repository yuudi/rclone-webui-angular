import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { AppStorageService } from 'src/app/cores/storage';
import { NewBackendComponent } from './new-backend.component';
import { NewBackendService } from './new-backend.service';

describe('NewBackendComponent', () => {
  let component: NewBackendComponent;
  let fixture: ComponentFixture<NewBackendComponent>;
  let mockNewBackendService: any;
  let mockConnectionService: any;
  let mockAppStorageService: any;
  let mockStorageItem: any;
  let mockRouter: any;
  let mockSnackBar: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockNewBackendService = {
      getProviders: vi.fn().mockResolvedValue([
        { Name: 'local', Description: 'Local Disk', Options: [] },
        {
          Name: 's3',
          Description: 'Amazon S3',
          Options: [{ Name: 'token', DefaultStr: '' }],
        },
      ]),
      createBackend: vi.fn().mockResolvedValue(undefined),
    };

    mockConnectionService = {
      getActiveConnection: vi
        .fn()
        .mockReturnValue({ remoteAddress: 'http://localhost:5572' }),
    };

    mockStorageItem = {
      get: vi.fn().mockResolvedValue(true),
      set: vi.fn(),
    };

    mockAppStorageService = {
      getItem: vi.fn().mockReturnValue(mockStorageItem),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    mockDialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(1), // 1 = continue
      }),
    };

    await TestBed.configureTestingModule({
      imports: [NewBackendComponent, BrowserAnimationsModule],
      providers: [
        { provide: NewBackendService, useValue: mockNewBackendService },
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: AppStorageService, useValue: mockAppStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    TestBed.overrideComponent(NewBackendComponent, {
      set: {
        providers: [
          { provide: NewBackendService, useValue: mockNewBackendService },
          { provide: ConnectionService, useValue: mockConnectionService },
          { provide: AppStorageService, useValue: mockAppStorageService },
          { provide: Router, useValue: mockRouter },
          { provide: MatSnackBar, useValue: mockSnackBar },
          { provide: MatDialog, useValue: mockDialog },
        ],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(NewBackendComponent);
    component = fixture.componentInstance;
  });

  it('should create and load providers on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(mockNewBackendService.getProviders).toHaveBeenCalled();
    const providers = await component.providers;
    expect(providers?.length).toBe(2);
  });

  it('should dismiss hint', () => {
    component.hintDismissClicked();
    expect(mockStorageItem.set).toHaveBeenCalledWith(false);
    expect(component.requiredFieldHint).toBe(false);
  });

  it('should select local provider without auth warning', () => {
    const provider = { Name: 'local', Description: 'Local', Options: [] };
    component.providerSelectedChanged(provider);
    expect(component.providerSelected).toEqual(provider);
    expect(component.providerNeedAuth).toBe(false);

    component.providerSelectedConfirmed();
    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('should select remote provider requiring auth and warning dialog if remote connection', () => {
    // Set connection to non-local address
    mockConnectionService.getActiveConnection.mockReturnValue({
      remoteAddress: 'http://example.com:5572',
    });
    const provider = {
      Name: 's3',
      Description: 'S3',
      Options: [{ Name: 'token', DefaultStr: '' }],
    };
    component.providerSelectedChanged(provider);
    expect(component.providerSelected).toEqual(provider);
    expect(component.providerNeedAuth).toBe(true);

    component.providerSelectedConfirmed();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should save/create backend and navigate back', async () => {
    component.newBackendName.setValue('my-backend');
    component.providerSelected = {
      Name: 'local',
      Description: 'Local',
      Options: [],
    };
    component.providerOptions = {};

    await component.saveClicked();
    expect(mockNewBackendService.createBackend).toHaveBeenCalledWith(
      'my-backend',
      'local',
      {},
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['rclone', 'drive']);
  });
});

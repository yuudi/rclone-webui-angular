import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ConnectionService } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectionEditorComponent } from './connection-editor.component';

describe('ConnectionEditorComponent', () => {
  let component: ConnectionEditorComponent;
  let fixture: ComponentFixture<ConnectionEditorComponent>;
  let mockConnectionService: any;
  let mockRemoteControlService: any;
  let mockRouter: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockConnectionService = {
      checkNameExists: vi.fn().mockResolvedValue(false),
      saveConnection: vi.fn().mockResolvedValue({
        id: 'new-id',
        displayName: 'New Connection',
        remoteAddress: 'http://127.0.0.1:5572',
      }),
      updateConnection: vi.fn().mockResolvedValue(undefined),
      activateConnection: vi.fn().mockResolvedValue(undefined),
    };

    mockRemoteControlService = {
      testConnection: vi.fn().mockResolvedValue(true),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConnectionEditorComponent, ReactiveFormsModule],
      providers: [
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: RemoteControlService, useValue: mockRemoteControlService },
        { provide: Router, useValue: mockRouter },
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(ConnectionEditorComponent, {
        set: {
          providers: [{ provide: MatSnackBar, useValue: mockSnackBar }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConnectionEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    fixture.detectChanges();
    expect(component.connectionForm.value.displayName).toBe('New Connection');
    expect(component.connectionForm.value.notProtected).toBe(false);
  });

  it('should patch form when input connection is provided', () => {
    component.connection = {
      id: 'existing-id',
      displayName: 'Existing Connection',
      remoteAddress: 'https://rclone-remote.org',
      isSameOrigin: false,
      authentication: 'basic-auth-str',
    };
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.connectionForm.value.displayName).toBe(
      'Existing Connection',
    );
    expect(component.connectionForm.value.remoteAddress).toBe(
      'https://rclone-remote.org',
    );
  });

  it('should validate insecure contexts correctly', () => {
    fixture.detectChanges();
    const addressControl = component.connectionForm.controls.remoteAddress;

    // Secure context: localhost
    addressControl.setValue('http://localhost:5572');
    expect(addressControl.errors).toBeNull();

    // Secure context: 127.0.0.1
    addressControl.setValue('http://127.0.0.1:5572');
    expect(addressControl.errors).toBeNull();

    // Secure context: https
    addressControl.setValue('https://remote.com');
    expect(addressControl.errors).toBeNull();

    // Insecure context: http remote domain
    addressControl.setValue('http://remote.com');
    expect(addressControl.errors?.['insecureContext']).toBe(true);
  });

  it('should test connection successfully and show snackbar', async () => {
    fixture.detectChanges();
    component.connectionForm.patchValue({
      displayName: 'Test',
      remoteAddress: 'http://127.0.0.1:5572',
      notProtected: true,
    });

    await component.testConnectionClicked();

    expect(mockRemoteControlService.testConnection).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      expect.stringContaining('successful'),
      'OK',
      expect.any(Object),
    );
  });

  it('should add connection, activate, and navigate on connectButtonClicked when new connection', async () => {
    fixture.detectChanges();
    component.connectionForm.patchValue({
      displayName: 'New Connection Custom',
      remoteAddress: 'http://127.0.0.1:5572',
      notProtected: true,
      remember: true,
    });

    await component.connectButtonClicked();

    expect(mockConnectionService.saveConnection).toHaveBeenCalled();
    expect(mockConnectionService.activateConnection).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should update connection, activate, and navigate on connectButtonClicked when editing connection', async () => {
    component.connection = {
      id: 'existing-id',
      displayName: 'Existing Connection',
      remoteAddress: 'https://rclone-remote.org',
      isSameOrigin: false,
      authentication: 'basic-auth-str',
    };
    component.ngOnChanges();
    fixture.detectChanges();

    component.connectionForm.patchValue({
      displayName: 'Updated Connection Name',
      remoteAddress: 'https://rclone-remote-updated.org',
      notProtected: true,
    });

    await component.connectButtonClicked();

    expect(mockConnectionService.updateConnection).toHaveBeenCalledWith(
      'existing-id',
      {
        displayName: 'Updated Connection Name',
        remoteAddress: 'https://rclone-remote-updated.org',
      },
      undefined,
    );
    expect(mockConnectionService.activateConnection).toHaveBeenCalledWith(
      'existing-id',
      null,
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

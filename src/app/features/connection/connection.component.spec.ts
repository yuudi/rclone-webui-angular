import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConnectionComponent } from './connection.component';
import { ConnectionService, NotSaved } from 'src/app/cores/remote-control/connection.service';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { PromptPasswordComponent } from './prompt-password/prompt-password.component';

describe('ConnectionComponent', () => {
  let component: ConnectionComponent;
  let fixture: ComponentFixture<ConnectionComponent>;
  let mockConnectionService: any;
  let mockRemoteControlService: any;
  let mockRouter: any;
  let mockSnackBar: any;
  let mockDialog: any;

  const mockConnections = [
    {
      id: 'conn1',
      displayName: 'Mock PC',
      remoteAddress: 'http://127.0.0.1:5572',
      isSameOrigin: true,
      authentication: 'some-basic-auth',
    },
    {
      id: 'conn2',
      displayName: 'Not Saved PC',
      remoteAddress: 'http://127.0.0.1:5573',
      isSameOrigin: false,
      authentication: NotSaved,
    }
  ];

  beforeEach(async () => {
    mockConnectionService = {
      getConnections: vi.fn().mockReturnValue(of(mockConnections)),
      activateConnection: vi.fn().mockResolvedValue(undefined),
      deleteConnection: vi.fn().mockResolvedValue(undefined),
      checkNameExists: vi.fn().mockResolvedValue(false),
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

    mockDialog = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConnectionComponent],
      providers: [
        { provide: ConnectionService, useValue: mockConnectionService },
        { provide: RemoteControlService, useValue: mockRemoteControlService },
        { provide: Router, useValue: mockRouter },
        provideNoopAnimations(),
      ],
    })
    .overrideComponent(ConnectionComponent, {
      set: {
        providers: [
          { provide: MatDialog, useValue: mockDialog },
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionComponent);
    component = fixture.componentInstance;
  });

  it('should create and load connections', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.connections$).toBeTruthy();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mock PC');
    expect(compiled.textContent).toContain('Not Saved PC');
  });

  it('should select connection on connectSelected', () => {
    const conn = mockConnections[0];
    component.connectSelected(conn);
    expect(component.selectedConnection).toBe(conn);
  });

  it('should call deleteConnection on connectDeleted', () => {
    const conn = mockConnections[0];
    component.connectDeleted(conn);
    expect(mockConnectionService.deleteConnection).toHaveBeenCalledWith(conn.id);
  });

  it('should activate connection and navigate when auth is present', async () => {
    const conn = mockConnections[0];
    await component.connectClicked(conn);
    expect(mockConnectionService.activateConnection).toHaveBeenCalledWith(conn.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should open prompt dialog when auth is NotSaved', async () => {
    const conn = mockConnections[1];
    await component.connectClicked(conn);
    expect(mockDialog.open).toHaveBeenCalledWith(PromptPasswordComponent, {
      data: conn,
    });
    expect(mockConnectionService.activateConnection).not.toHaveBeenCalled();
  });
});

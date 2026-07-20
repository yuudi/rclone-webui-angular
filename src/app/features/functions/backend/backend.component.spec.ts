import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BackendComponent } from './backend.component';
import { BackendService } from './backend.service';

describe('BackendComponent', () => {
  let component: BackendComponent;
  let fixture: ComponentFixture<BackendComponent>;
  let mockBackendService: any;
  let mockRouter: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockBackendService = {
      getBackends: vi.fn().mockResolvedValue({
        local: { type: 'local' },
      }),
      getBackendInfo: vi.fn().mockResolvedValue({
        Features: { About: true },
      }),
      getBackendUsage: vi.fn().mockReturnValue(
        of({
          total: 1000,
          used: 500,
          free: 500,
        }),
      ),
      createBackend: vi.fn().mockResolvedValue(undefined),
      deleteBackend: vi.fn().mockResolvedValue(undefined),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockDialog = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BackendComponent, BrowserAnimationsModule],
      providers: [
        { provide: BackendService, useValue: mockBackendService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    TestBed.overrideComponent(BackendComponent, {
      set: {
        providers: [
          { provide: BackendService, useValue: mockBackendService },
          { provide: Router, useValue: mockRouter },
          { provide: MatDialog, useValue: mockDialog },
        ],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(BackendComponent);
    component = fixture.componentInstance;
  });

  it('should create and load backends on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(mockBackendService.getBackends).toHaveBeenCalled();
    expect(component.backendList.length).toBe(1);
    expect(component.backendList[0].id).toBe('local');
  });

  it('should browse to backend', () => {
    component.backendBrowse('local');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['rclone', 'explore'], {
      queryParams: { drive: 'local' },
    });
  });

  it('should delete backend', async () => {
    component.backendList = [{ id: 'local', config: { type: 'local' } }];
    await component.backendDelete('local');
    expect(mockBackendService.deleteBackend).toHaveBeenCalledWith('local');
    expect(component.backendList.length).toBe(0);
  });

  it('should duplicate backend when user inputs a name', async () => {
    const dialogRefMock = {
      afterClosed: () => of('new-local'),
    };
    mockDialog.open.mockReturnValue(dialogRefMock);
    component.backendList = [{ id: 'local', config: { type: 'local' } }];

    const result = await component.backendDuplicate({
      id: 'local',
      config: { type: 'local', someOption: 'val' } as any,
    });
    expect(result).toBe(1);
    expect(mockBackendService.createBackend).toHaveBeenCalledWith(
      'new-local',
      'local',
      { someOption: 'val' },
    );
    expect(component.backendList.some((b) => b.id === 'new-local')).toBe(true);
  });

  it('should rename backend by duplicating and deleting', async () => {
    const dialogRefMock = {
      afterClosed: () => of('new-local'),
    };
    mockDialog.open.mockReturnValue(dialogRefMock);
    component.backendList = [{ id: 'local', config: { type: 'local' } }];

    // Spy on duplicate and delete
    const duplicateSpy = vi
      .spyOn(component, 'backendDuplicate')
      .mockResolvedValue(1);
    const deleteSpy = vi.spyOn(component, 'backendDelete').mockResolvedValue();

    await component.backendRename({ id: 'local', config: { type: 'local' } });
    expect(duplicateSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith('local');
  });
});

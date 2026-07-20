import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CronComponent } from './cron.component';
import { CronService } from './cron.service';

describe('CronComponent', () => {
  let component: CronComponent;
  let fixture: ComponentFixture<CronComponent>;
  let mockCronService: any;
  let mockSchedular: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockSchedular = {
      getTasks: vi.fn().mockResolvedValue([
        {
          id: '1',
          active: true,
          schedule: '* * * * *',
          operation: 'sync',
          params: {},
        },
      ]),
    };

    mockCronService = {
      getSchedular: vi.fn().mockReturnValue(mockSchedular),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CronComponent, BrowserAnimationsModule],
      providers: [
        { provide: CronService, useValue: mockCronService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    });

    TestBed.overrideComponent(CronComponent, {
      set: {
        providers: [
          { provide: CronService, useValue: mockCronService },
          { provide: MatSnackBar, useValue: mockSnackBar },
        ],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(CronComponent);
    component = fixture.componentInstance;
  });

  it('should create and load tasks on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(mockCronService.getSchedular).toHaveBeenCalled();
    expect(mockSchedular.getTasks).toHaveBeenCalled();
    const tasks = await component.tasks;
    expect(tasks.length).toBe(1);
  });

  it('should open snackbar when new cron is clicked', () => {
    fixture.detectChanges();
    component.newCronClicked();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Not implemented yet', 'OK');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CronService } from '../cron.service';
import { CronEditorComponent } from './cron-editor.component';

describe('CronEditorComponent', () => {
  let component: CronEditorComponent;
  let fixture: ComponentFixture<CronEditorComponent>;
  let mockCronService: any;

  beforeEach(async () => {
    mockCronService = {
      validateExpression: vi.fn().mockResolvedValue(true),
      toTask: vi.fn().mockResolvedValue({
        id: 'new-task-id',
        active: true,
        schedule: '* * * * *',
        operation: 'sync/sync',
        params: {},
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CronEditorComponent,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: CronService, useValue: mockCronService }],
    });

    TestBed.overrideComponent(CronEditorComponent, {
      set: {
        providers: [{ provide: CronService, useValue: mockCronService }],
      },
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(CronEditorComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should validate cron expression asynchronously with debounce', async () => {
    vi.useFakeTimers();
    fixture.detectChanges();
    const expressionControl = component.cronForm.controls.expression;
    expressionControl.setValue('invalid-cron');

    expect(expressionControl.pending).toBe(true);

    // Fast forward debounce time
    vi.advanceTimersByTime(1000);

    // Wait for the validator promise to resolve
    await Promise.resolve();
    await Promise.resolve();

    expect(mockCronService.validateExpression).toHaveBeenCalledWith(
      'invalid-cron',
    );
  });

  it('should emit new task when save is clicked and operation is sync', async () => {
    fixture.detectChanges();
    component.cronForm.setValue({
      advancedCron: true,
      expression: '0 0 * * *',
      type: 'sync',
      from: '/src',
      to: '/dest',
    });

    let emittedTask: any = null;
    component.taskChange.subscribe((t) => (emittedTask = t));

    await component.saveClicked();

    expect(mockCronService.toTask).toHaveBeenCalledWith(
      '0 0 * * *',
      'sync/sync',
      { srcFs: '/src', dstFs: '/dest', createEmptySrcDirs: true },
    );
    expect(emittedTask).toEqual({
      id: 'new-task-id',
      active: true,
      schedule: '* * * * *',
      operation: 'sync/sync',
      params: {},
    });
  });

  it('should emit new task when save is clicked and operation is copy', async () => {
    fixture.detectChanges();
    component.cronForm.setValue({
      advancedCron: true,
      expression: '0 0 * * *',
      type: 'copy',
      from: '/src',
      to: '/dest',
    });

    await component.saveClicked();

    expect(mockCronService.toTask).toHaveBeenCalledWith(
      '0 0 * * *',
      'sync/copy',
      {
        srcFs: '/src',
        dstFs: '/dest',
        createEmptySrcDirs: true,
        deleteEmptySrcDirs: false,
      },
    );
  });

  it('should emit new task when save is clicked and operation is bisync', async () => {
    fixture.detectChanges();
    component.cronForm.setValue({
      advancedCron: true,
      expression: '0 0 * * *',
      type: 'bisync',
      from: '/src',
      to: '/dest',
    });

    await component.saveClicked();

    expect(mockCronService.toTask).toHaveBeenCalledWith(
      '0 0 * * *',
      'sync/bisync',
      { path1: '/src', path2: '/dest', resync: true, maxDelete: 100 },
    );
  });
});

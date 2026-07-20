import { TestBed } from '@angular/core/testing';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import { CronService } from './cron.service';

describe('CronService', () => {
  let service: CronService;
  let mockSchedular: any;
  let originalDesktop: any;

  beforeEach(() => {
    mockSchedular = {
      validate: vi.fn(),
      addTask: vi.fn(),
      getTasks: vi.fn(),
      removeTask: vi.fn(),
      activateTask: vi.fn(),
      deactivateTask: vi.fn(),
    };

    originalDesktop = (globalThis as any)['RWA_DESKTOP'];
    (globalThis as any)['RWA_DESKTOP'] = {
      version: '1.0.0',
      executeId: vi.fn().mockResolvedValue('123'),
      schedular: mockSchedular
    };

    TestBed.configureTestingModule({
      providers: [CronService]
    });
    service = TestBed.inject(CronService);
  });

  afterEach(() => {
    (globalThis as any)['RWA_DESKTOP'] = originalDesktop;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get schedular from RWA_DESKTOP', () => {
    const schedular = service.getSchedular();
    expect(schedular).toBe(mockSchedular);
  });

  it('should validate expression', async () => {
    // '@startup' should always be valid
    let valid = await service.validateExpression('@startup');
    expect(valid).toBe(true);

    mockSchedular.validate.mockResolvedValue(true);
    valid = await service.validateExpression('* * * * *');
    expect(mockSchedular.validate).toHaveBeenCalledWith('* * * * *');
    expect(valid).toBe(true);

    mockSchedular.validate.mockResolvedValue(false);
    valid = await service.validateExpression('invalid');
    expect(valid).toBe(false);
  });

  it('should create a task using toTask', async () => {
    mockSchedular.validate.mockResolvedValue(true);
    const task = await service.toTask('* * * * *', 'sync', { path: '/data' });
    expect(task.id).toBeTruthy();
    expect(task.active).toBe(true);
    expect(task.schedule).toBe('* * * * *');
    expect(task.operation).toBe('sync');
    expect(task.params).toEqual({ path: '/data' });
  });

  it('should throw error when toTask is called with invalid expression', async () => {
    mockSchedular.validate.mockResolvedValue(false);
    await expect(service.toTask('invalid', 'sync', {})).rejects.toThrow('Invalid cron expression');
  });
});

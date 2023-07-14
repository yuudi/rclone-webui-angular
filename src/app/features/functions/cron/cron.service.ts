import { Injectable } from '@angular/core';

import { v4 as uuid } from 'uuid';

type CronExpression = string;

export interface Task {
  id: string;
  active: boolean;
  schedule: CronExpression | '@startup';
  operation: string;
  params: Record<string, unknown>;
}

export interface Schedular {
  validate: (expression: string) => Promise<boolean>;
  addTask: (t: Task) => Promise<void>;
  getTasks: () => Promise<Task[]>;
  removeTask: (id: string) => Promise<void>;
  activateTask: (id: string) => Promise<void>;
  deactivateTask: (id: string) => Promise<void>;
}

interface ElectronBridge {
  version: string;
  executeId: () => Promise<string>;
  schedular: Schedular;
}

@Injectable({
  providedIn: 'root',
})
export class CronService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private electronBridge?: ElectronBridge = globalThis['RWA_DESKTOP'];

  getSchedular() {
    return this.electronBridge?.schedular;
  }

  validateExpression(expression: string): Promise<boolean> {
    if (expression === '@startup') {
      return Promise.resolve(true);
    }
    const schedular = this.getSchedular();
    if (!schedular) {
      throw new Error('Schedular not available');
    }
    return schedular.validate(expression);
  }

  async toTask(
    expression: string,
    operation: string,
    params: Record<string, unknown>,
  ): Promise<Task> {
    const valid = await this.validateExpression(expression);
    if (!valid) {
      throw new Error('Invalid cron expression');
    }
    return {
      id: uuid(),
      active: true,
      schedule: expression,
      operation,
      params,
    };
  }
}

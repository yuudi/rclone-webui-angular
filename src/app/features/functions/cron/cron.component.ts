import { Component, OnInit } from '@angular/core';

import { CronService, Schedular, Task } from './cron.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cron',
  templateUrl: './cron.component.html',
  styleUrls: ['./cron.component.scss'],
})
export class CronComponent implements OnInit {
  schedular!: Schedular;
  tasks!: Promise<Task[]>;
  constructor(
    private cronService: CronService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const schedular = this.cronService.getSchedular();
    if (!schedular) {
      throw new Error('Schedular not available');
    }
    this.schedular = schedular;
    this.tasks = schedular.getTasks();
  }

  newCronClicked() {
    this.snackBar.open('Not implemented yet', 'OK');
  }
}

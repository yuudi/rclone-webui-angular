import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-easy-cron',
  templateUrl: './easy-cron.component.html',
  styleUrls: ['./easy-cron.component.scss'],
})
export class EasyCronComponent {
  @Output() valueChange = new EventEmitter<string>();

  fieldEveryCount = 1;
  fieldEveryUnit: 'hour' | 'day' = 'day';
  fieldAtHour = 0;
  fieldAtMinute = 0;

  private toCronExpression(): string {
    if (this.fieldEveryUnit === 'hour') {
      return `0 ${this.fieldAtMinute} */${this.fieldEveryCount} * *`;
    } else if (this.fieldEveryUnit === 'day') {
      return `0 ${this.fieldAtMinute} ${this.fieldAtHour} */${this.fieldEveryCount} *`;
    } else {
      throw new Error('invalid fieldEveryUnit');
    }
  }

  onValueChange(): void {
    this.valueChange.emit(this.toCronExpression());
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-easy-cron',
  templateUrl: './easy-cron.component.html',
  styleUrls: ['./easy-cron.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
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

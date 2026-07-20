import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import { EasyCronComponent } from './easy-cron.component';

describe('EasyCronComponent', () => {
  let component: EasyCronComponent;
  let fixture: ComponentFixture<EasyCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyCronComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EasyCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit correct cron expression for hour unit', () => {
    let emittedValue = '';
    component.valueChange.subscribe((val) => emittedValue = val);

    component.fieldEveryUnit = 'hour';
    component.fieldEveryCount = 4;
    component.fieldAtMinute = 15;

    component.onValueChange();

    expect(emittedValue).toBe('0 15 */4 * *');
  });

  it('should emit correct cron expression for day unit', () => {
    let emittedValue = '';
    component.valueChange.subscribe((val) => emittedValue = val);

    component.fieldEveryUnit = 'day';
    component.fieldEveryCount = 2;
    component.fieldAtHour = 3;
    component.fieldAtMinute = 45;

    component.onValueChange();

    expect(emittedValue).toBe('0 45 3 */2 *');
  });
});

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SingleClickDirective } from './single-click.directive';
import { vi } from 'vitest';

@Component({
  template: `
    <button [appSingleClickDelay]="300" (appSingleClick)="onSingleClick($event)">Click Me</button>
  `,
  imports: [SingleClickDirective],
  standalone: true,
})
class TestHostComponent {
  clickedEvent: MouseEvent | null = null;
  onSingleClick(event: MouseEvent) {
    this.clickedEvent = event;
  }
}

describe('SingleClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonEl: DebugElement;
  let hostComponent: TestHostComponent;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    buttonEl = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should emit appSingleClick when clicked once', () => {
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    expect(hostComponent.clickedEvent).toBeNull();

    vi.advanceTimersByTime(300);
    expect(hostComponent.clickedEvent).toBeTruthy();
  });

  it('should NOT emit appSingleClick when clicked twice (double click)', () => {
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    vi.advanceTimersByTime(100);

    buttonEl.nativeElement.click();
    fixture.detectChanges();

    vi.advanceTimersByTime(300);
    expect(hostComponent.clickedEvent).toBeNull();
  });
});

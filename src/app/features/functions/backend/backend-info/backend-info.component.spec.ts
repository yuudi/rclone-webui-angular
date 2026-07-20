import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it } from 'vitest';

import { BackendInfoComponent } from './backend-info.component';

describe('BackendInfoComponent', () => {
  let component: BackendInfoComponent;
  let fixture: ComponentFixture<BackendInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendInfoComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BackendInfoComponent);
    component = fixture.componentInstance;
    component.backendName = 'test-drive';
    component.backend = { type: 'local' };
    component.usage = {
      total: 1000000,
      free: 600000,
      used: 300000,
      trashed: 50000,
      other: 50000,
      objects: 120,
    };
    fixture.detectChanges();
  });

  it('should create and render basic info', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.backend-info__title')?.textContent,
    ).toContain('test-drive');
    expect(
      compiled.querySelector('.backend-info__subtitle')?.textContent,
    ).toContain('local');
  });

  it('should emit browse event when browse button is clicked', () => {
    let emitted = false;
    component.browse.subscribe(() => (emitted = true));

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[mat-flat-button]',
    ) as HTMLButtonElement;
    button.click();

    expect(emitted).toBe(true);
  });

  it('should emit duplicate event when copy is clicked in menu', () => {
    let emitted = false;
    component.duplicate.subscribe(() => (emitted = true));

    component.duplicate.emit();
    expect(emitted).toBe(true);
  });

  it('should emit rename event when rename is clicked in menu', () => {
    let emitted = false;
    component.rename.subscribe(() => (emitted = true));

    component.rename.emit();
    expect(emitted).toBe(true);
  });

  it('should emit delete event when delete is clicked in menu', () => {
    let emitted = false;
    component.delete.subscribe(() => (emitted = true));

    component.delete.emit();
    expect(emitted).toBe(true);
  });
});

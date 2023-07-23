import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronComponent } from './cron.component';

describe('CronComponent', () => {
  let component: CronComponent;
  let fixture: ComponentFixture<CronComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CronComponent],
    });
    fixture = TestBed.createComponent(CronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

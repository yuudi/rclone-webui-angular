import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyCronComponent } from './easy-cron.component';

describe('EasyCronComponent', () => {
  let component: EasyCronComponent;
  let fixture: ComponentFixture<EasyCronComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EasyCronComponent],
    });
    fixture = TestBed.createComponent(EasyCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

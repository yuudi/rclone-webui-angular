import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendInfoComponent } from './backend-info.component';

describe('BackendInfoComponent', () => {
  let component: BackendInfoComponent;
  let fixture: ComponentFixture<BackendInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackendInfoComponent],
    });
    fixture = TestBed.createComponent(BackendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

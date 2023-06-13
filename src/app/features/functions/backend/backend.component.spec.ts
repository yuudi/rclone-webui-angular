import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendComponent } from './backend.component';

describe('BackendComponent', () => {
  let component: BackendComponent;
  let fixture: ComponentFixture<BackendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackendComponent],
    });
    fixture = TestBed.createComponent(BackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

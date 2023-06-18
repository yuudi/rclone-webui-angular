import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBackendComponent } from './new-backend.component';

describe('NewBackendComponent', () => {
  let component: NewBackendComponent;
  let fixture: ComponentFixture<NewBackendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewBackendComponent],
    });
    fixture = TestBed.createComponent(NewBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

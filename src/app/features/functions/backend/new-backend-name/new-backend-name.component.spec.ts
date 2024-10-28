import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBackendNameComponent } from './new-backend-name.component';

describe('NewBackendNameComponent', () => {
  let component: NewBackendNameComponent;
  let fixture: ComponentFixture<NewBackendNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewBackendNameComponent],
    });
    fixture = TestBed.createComponent(NewBackendNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

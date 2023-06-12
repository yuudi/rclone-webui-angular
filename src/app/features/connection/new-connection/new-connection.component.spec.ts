import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConnectionComponent } from './new-connection.component';

describe('NewConnectionComponent', () => {
  let component: NewConnectionComponent;
  let fixture: ComponentFixture<NewConnectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewConnectionComponent],
    });
    fixture = TestBed.createComponent(NewConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

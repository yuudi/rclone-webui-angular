import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMountDialogComponent } from './new-mount-dialog.component';

describe('NewMountDialogComponent', () => {
  let component: NewMountDialogComponent;
  let fixture: ComponentFixture<NewMountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMountDialogComponent]
    });
    fixture = TestBed.createComponent(NewMountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

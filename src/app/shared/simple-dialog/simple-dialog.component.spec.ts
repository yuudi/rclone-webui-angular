import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDialogComponent } from './simple-dialog.component';

describe('SimpleDialogComponent', () => {
  let component: SimpleDialogComponent;
  let fixture: ComponentFixture<SimpleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SimpleDialogComponent],
    });
    fixture = TestBed.createComponent(SimpleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

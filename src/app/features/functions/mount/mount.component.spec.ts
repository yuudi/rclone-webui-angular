import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountComponent } from './mount.component';

describe('MountComponent', () => {
  let component: MountComponent;
  let fixture: ComponentFixture<MountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MountComponent],
    });
    fixture = TestBed.createComponent(MountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

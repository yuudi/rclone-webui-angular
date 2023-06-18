import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathSplitterComponent } from './path-splitter.component';

describe('PathSplitterComponent', () => {
  let component: PathSplitterComponent;
  let fixture: ComponentFixture<PathSplitterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PathSplitterComponent],
    });
    fixture = TestBed.createComponent(PathSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

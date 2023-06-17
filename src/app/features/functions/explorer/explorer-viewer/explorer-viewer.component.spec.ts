import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerViewerComponent } from './explorer-viewer.component';

describe('ExplorerViewerComponent', () => {
  let component: ExplorerViewerComponent;
  let fixture: ComponentFixture<ExplorerViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorerViewerComponent],
    });
    fixture = TestBed.createComponent(ExplorerViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

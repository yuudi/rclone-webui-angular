import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PathSplitterComponent } from './path-splitter.component';

describe('PathSplitterComponent', () => {
  let component: PathSplitterComponent;
  let fixture: ComponentFixture<PathSplitterComponent>;
  let mockSnackBar: any;

  beforeEach(() => {
    mockSnackBar = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [PathSplitterComponent, NoopAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: mockSnackBar }],
    });
    fixture = TestBed.createComponent(PathSplitterComponent);
    component = fixture.componentInstance;
    component.backend = 'test-backend';
    component.path = 'test-path';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

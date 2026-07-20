import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyDialogComponent } from './copy-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CopyDialogComponent', () => {
  let component: CopyDialogComponent;
  let fixture: ComponentFixture<CopyDialogComponent>;
  let mockDialogRef: any;

  beforeEach(() => {
    mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CopyDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { content: 'test content' } },
      ],
    });
    fixture = TestBed.createComponent(CopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

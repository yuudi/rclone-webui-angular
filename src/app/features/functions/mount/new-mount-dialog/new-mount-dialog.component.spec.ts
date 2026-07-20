import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NewMountDialogComponent } from './new-mount-dialog.component';

describe('NewMountDialogComponent', () => {
  let component: NewMountDialogComponent;
  let fixture: ComponentFixture<NewMountDialogComponent>;
  let mockDialog: any;
  let mockDialogRef: any;

  beforeEach(() => {
    mockDialog = {
      open: vi.fn(),
    };

    mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [NewMountDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            osType: 'linux',
            fsOptions: ['drive1', 'drive2'],
          },
        },
      ],
    });
    fixture = TestBed.createComponent(NewMountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

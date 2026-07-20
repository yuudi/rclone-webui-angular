import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenameDialogComponent } from './rename-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RenameDialogComponent', () => {
  let component: RenameDialogComponent;
  let fixture: ComponentFixture<RenameDialogComponent>;
  let mockDialogRef: any;

  beforeEach(() => {
    mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RenameDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Rename File',
            name: 'old-name.txt',
            existNames: [],
          },
        },
      ],
    });
    fixture = TestBed.createComponent(RenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

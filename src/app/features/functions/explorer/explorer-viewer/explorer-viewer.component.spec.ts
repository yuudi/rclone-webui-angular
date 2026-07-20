import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RemoteControlService } from 'src/app/cores/remote-control/remote-control.service';
import { ExplorerService } from '../explorer.service';
import { ExplorerViewerComponent } from './explorer-viewer.component';

describe('ExplorerViewerComponent', () => {
  let component: ExplorerViewerComponent;
  let fixture: ComponentFixture<ExplorerViewerComponent>;
  let mockSnackBar: any;
  let mockDialog: any;
  let mockRC: any;
  let mockExplorerService: any;

  beforeEach(() => {
    mockSnackBar = {
      open: vi.fn(),
    };

    mockDialog = {
      open: vi.fn(),
    };

    mockRC = {
      call: vi.fn(),
      downloadFile: vi.fn(),
    };

    mockExplorerService = {
      listChildren: vi.fn().mockResolvedValue([]),
    };

    TestBed.configureTestingModule({
      imports: [ExplorerViewerComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: RemoteControlService, useValue: mockRC },
        { provide: ExplorerService, useValue: mockExplorerService },
      ],
    });
    fixture = TestBed.createComponent(ExplorerViewerComponent);
    component = fixture.componentInstance;
    component.backend = 'test-backend';
    component.path = 'test-path';
    component.actions = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

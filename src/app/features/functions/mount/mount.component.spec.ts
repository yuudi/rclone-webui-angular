import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MountComponent } from './mount.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MountService } from './mount.service';
import { BackendService } from '../backend/backend.service';
import { ExplorerService } from '../explorer/explorer.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MountComponent', () => {
  let component: MountComponent;
  let fixture: ComponentFixture<MountComponent>;
  let mockSnackBar: any;
  let mockDialog: any;
  let mockMountService: any;
  let mockBackendService: any;
  let mockExplorerService: any;

  beforeEach(() => {
    mockSnackBar = {
      open: vi.fn(),
    };

    mockDialog = {
      open: vi.fn(),
    };

    mockMountService = {
      getOsType: vi.fn().mockResolvedValue('linux'),
      getMountSettings: vi.fn().mockReturnValue(of([])),
    };

    mockBackendService = {
      listBackends: vi.fn().mockResolvedValue([]),
    };

    mockExplorerService = {
      createEmptyFolder: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [MountComponent, NoopAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MountService, useValue: mockMountService },
        { provide: BackendService, useValue: mockBackendService },
        { provide: ExplorerService, useValue: mockExplorerService },
      ],
    });
    fixture = TestBed.createComponent(MountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

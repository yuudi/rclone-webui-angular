import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BackendService } from '../backend/backend.service';
import { ExplorerComponent } from './explorer.component';
import { ExplorerService } from './explorer.service';

describe('ExplorerComponent', () => {
  let component: ExplorerComponent;
  let fixture: ComponentFixture<ExplorerComponent>;
  let mockRoute: any;
  let mockSnackBar: any;
  let mockDialog: any;
  let mockExplorerService: any;
  let mockBackendService: any;

  beforeEach(() => {
    mockRoute = {
      queryParams: of({}),
    };

    mockSnackBar = {
      open: vi.fn(),
    };

    mockDialog = {
      open: vi.fn(),
    };

    mockExplorerService = {
      getOsType: vi.fn().mockResolvedValue('linux'),
    };

    mockBackendService = {
      listBackends: vi.fn().mockResolvedValue([]),
      getBackendInfo: vi.fn().mockReturnValue({}),
      checkWindowsDriveExist: vi.fn().mockResolvedValue(false),
    };

    TestBed.configureTestingModule({
      imports: [ExplorerComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ExplorerService, useValue: mockExplorerService },
        { provide: BackendService, useValue: mockBackendService },
      ],
    });
    fixture = TestBed.createComponent(ExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

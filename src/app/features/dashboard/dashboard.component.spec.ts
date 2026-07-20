import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: any;

  beforeEach(async () => {
    mockDashboardService = {
      getBackends: vi.fn().mockResolvedValue({ remotes: ['drive1', 'drive2'] }),
      getVersion: vi.fn().mockResolvedValue({
        version: '1.62.2',
        decomposed: [1, 62, 2],
        isGit: false,
        isBeta: false,
        os: 'linux',
        arch: 'amd64',
        goVersion: 'go1.20',
        linking: 'static',
        goTags: 'none',
      }),
      getStat: vi.fn().mockReturnValue(
        of({
          bytes: 100,
          checks: 0,
          deletes: 0,
          elapsedTime: 1.5,
          errors: 0,
          eta: 0,
          fatalError: false,
          lastError: '',
          renames: 0,
          retryError: false,
          speed: 50,
          totalBytes: 500,
          totalChecks: 0,
          totalTransfers: 0,
          transferTime: 1.5,
          transfers: 5,
          checking: [],
          transferring: [
            {
              bytes: 10,
              eta: 5,
              name: 'file1.txt',
              percentage: 20,
              speed: 2,
              speedAvg: 2,
              size: 50,
            },
          ],
        }),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    // Allow macro/microtasks to complete
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.backends).toEqual(['drive1', 'drive2']);
    expect(component.version?.version).toBe('1.62.2');
  });

  it('should render backends, version and statistics', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Check that backends text is rendered
    expect(compiled.textContent).toContain('2 Backends are connected');

    // Check version is rendered
    expect(compiled.textContent).toContain('1.62.2');
    expect(compiled.textContent).toContain('linux-amd64');

    // Check stats are rendered
    expect(compiled.textContent).toContain('Speed');
    expect(compiled.textContent).toContain('Transferred');
  });

  it('should update goToPath and handle inputs', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    component.goToPath = 'my-drive:folder';
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('my-drive:folder');
  });
});

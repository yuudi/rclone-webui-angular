import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobComponent } from './job.component';
import { JobService } from './job.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('JobComponent', () => {
  let component: JobComponent;
  let fixture: ComponentFixture<JobComponent>;
  let mockJobService: any;

  beforeEach(() => {
    mockJobService = {
      getJobs: vi.fn().mockReturnValue(of([])),
      removeJob: vi.fn(),
      killJob: vi.fn(),
      removeFinishedJobs: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [JobComponent, NoopAnimationsModule],
      providers: [
        { provide: JobService, useValue: mockJobService }
      ]
    });
    fixture = TestBed.createComponent(JobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

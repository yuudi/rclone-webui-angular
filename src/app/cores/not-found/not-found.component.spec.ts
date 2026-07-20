import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Not Found header and home link', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    const link = fixture.debugElement.query(By.css('a'));
    expect(heading.nativeElement.textContent).toContain('Not Found');
    expect(link.nativeElement.textContent).toContain('return home');
    expect(link.nativeElement.getAttribute('routerLink')).toBe('/dashboard');
  });
});

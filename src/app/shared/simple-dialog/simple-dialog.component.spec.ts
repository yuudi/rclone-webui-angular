import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { SimpleDialogComponent } from './simple-dialog.component';

describe('SimpleDialogComponent', () => {
  let component: SimpleDialogComponent<string>;
  let fixture: ComponentFixture<SimpleDialogComponent<string>>;

  const mockDialogData = {
    title: 'Test Title',
    message: 'Test Message',
    actions: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleDialogComponent, MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockDialogData }],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const titleEl = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    const messageEl = fixture.debugElement.query(By.css('.message'));
    expect(titleEl.nativeElement.textContent).toContain('Test Title');
    expect(messageEl.nativeElement.textContent).toContain('Test Message');
  });

  it('should render action buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Yes');
    expect(buttons[1].nativeElement.textContent).toContain('No');
  });
});

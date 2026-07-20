import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FunctionsComponent } from './functions.component';
import { provideRouter } from '@angular/router';

describe('FunctionsComponent', () => {
  let component: FunctionsComponent;
  let fixture: ComponentFixture<FunctionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FunctionsComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(FunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

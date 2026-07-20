import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FunctionsComponent } from './functions.component';

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

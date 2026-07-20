import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it } from 'vitest';

import { NewBackendNameComponent } from './new-backend-name.component';

describe('NewBackendNameComponent', () => {
  let component: NewBackendNameComponent;
  let fixture: ComponentFixture<NewBackendNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBackendNameComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { occupiedList: ['drive1', 'drive2'] },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBackendNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.data.occupiedList).toEqual(['drive1', 'drive2']);
  });
});

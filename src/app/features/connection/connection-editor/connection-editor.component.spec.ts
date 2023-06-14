import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionEditorComponent } from './connection-editor.component';

describe('ConnectionEditorComponent', () => {
  let component: ConnectionEditorComponent;
  let fixture: ComponentFixture<ConnectionEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionEditorComponent],
    });
    fixture = TestBed.createComponent(ConnectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

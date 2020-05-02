import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeviceCastComponent } from './dialog-device-cast.component';

describe('DialogDeviceCastComponent', () => {
  let component: DialogDeviceCastComponent;
  let fixture: ComponentFixture<DialogDeviceCastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeviceCastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeviceCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

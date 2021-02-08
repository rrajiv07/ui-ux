import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinchComponentComponent } from './pinch-component.component';

describe('PinchComponentComponent', () => {
  let component: PinchComponentComponent;
  let fixture: ComponentFixture<PinchComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinchComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinchComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

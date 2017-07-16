import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiScanComponent } from './wifi-scan.component';

describe('WifiScanComponent', () => {
  let component: WifiScanComponent;
  let fixture: ComponentFixture<WifiScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifiScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

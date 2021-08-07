import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyDetectionComponent } from './currency-detection.component';

describe('CurrencyDetectionComponent', () => {
  let component: CurrencyDetectionComponent;
  let fixture: ComponentFixture<CurrencyDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

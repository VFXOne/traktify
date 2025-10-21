import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySpinnerComponent } from '../components/display/property-spinner/property-spinner.component';

describe('PropertySpinnerComponent', () => {
  let component: PropertySpinnerComponent;
  let fixture: ComponentFixture<PropertySpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

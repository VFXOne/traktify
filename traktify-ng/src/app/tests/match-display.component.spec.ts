import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDisplayComponent } from '../components/display/match-display/match-display.component';

describe('MatchDisplayComponent', () => {
  let component: MatchDisplayComponent;
  let fixture: ComponentFixture<MatchDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

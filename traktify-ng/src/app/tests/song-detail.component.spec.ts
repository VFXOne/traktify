import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongDetailComponent } from '../components/song-detail/song-detail.component';

describe('SongDetailComponent', () => {
  let component: SongDetailComponent;
  let fixture: ComponentFixture<SongDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

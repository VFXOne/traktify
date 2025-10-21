import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSelectorComponent } from '../components/containers/playlist-selector/playlist-selector.component';

describe('PlaylistSelectorComponent', () => {
  let component: PlaylistSelectorComponent;
  let fixture: ComponentFixture<PlaylistSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

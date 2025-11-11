import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlaylistSettingsComponent} from '../components/settings/playlist-settings/playlist-settings.component';

describe('PlaylistSettingsComponent', () => {
  let component: PlaylistSettingsComponent;
  let fixture: ComponentFixture<PlaylistSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

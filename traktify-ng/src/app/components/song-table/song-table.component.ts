import {Component, computed} from '@angular/core';
import {MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PlaylistSelectionService} from '../../facades/playlist-selection.facade';
import {SongListDisplayComponent} from '../display/song-list-display/song-list-display.component';
import {SongDetailDialogComponent} from '../song-detail/song-detail-dialog.component';

@Component({
  selector: 'app-song-table[songs]',
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawerContent,
    MatSortModule,
    MatProgressSpinner,
    SongListDisplayComponent,
    SongDetailDialogComponent
  ],
  templateUrl: './song-table.component.html',
  styleUrl: './song-table.component.scss'
})
export class SongTableComponent {
  readonly songs = computed(() => this.playlistSelection.selectedPlaylist$()?.songList ?? []);
  readonly songsLoaded = this.playlistSelection.isPlaylistSelected;

  constructor(private playlistSelection: PlaylistSelectionService) {
  }
}

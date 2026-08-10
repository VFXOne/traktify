import {Component, computed, OnInit, signal} from '@angular/core';
import {PlaylistSynchronizationFacade} from '../../../facades/playlist-synchronization.facade';
import {MatListItemLine, MatListItemTitle, MatListOption, MatListSubheaderCssMatStyler, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {SpotifyPlaylist} from '../../../models/playlist-spotify.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-playlist-settings',
  standalone: true,
  imports: [
    MatListSubheaderCssMatStyler,
    MatFormField,
    MatInput,
    FormsModule,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatSelectionList,
    MatListOption,
    MatListItemTitle,
    MatListItemLine,
    MatLabel,
    MatPaginator,
    MatProgressSpinner
  ],
  templateUrl: './playlist-settings.component.html',
  styleUrl: './playlist-settings.component.scss'
})
export class PlaylistSettingsComponent implements OnInit {

  private playlists = computed(() => this.playlistService.spotifyPlaylists().filter(p => p.name.toLowerCase().includes(this.searchString().toLowerCase())));

  readonly playlistsLoading = this.playlistService.loading;
  readonly selectionLoading = signal<boolean>(false);

  readonly searchString = signal('');

  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly pageLength = computed(() => this.playlists().length);

  readonly paginatedPlaylists = computed(() => {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.playlists().slice(startIndex, endIndex);
  });

  constructor(private playlistService: PlaylistSynchronizationFacade) {
  }

  ngOnInit(): void {
    void this.playlistService.initSpotifyPlaylists();
    console.log(this.playlists());
  }

  pageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  onSearchChange(event: Event): void {
    event.stopPropagation();
  }

  resetSearch(): void {
    this.searchString.set('');
  }

  onSelectionChange(event: MatSelectionListChange) {
    for (const option of event.options) {
      const playlist = option.value as SpotifyPlaylist;
      if (option.selected && !playlist.isSynchronized) {
        this.syncPlaylists(playlist).then(() => {});
      } else if (!option.selected && playlist.isSynchronized) {
        this.unsyncPlaylist(playlist).then(() => {});
      }
    }
  }


  async syncPlaylists(playlist: SpotifyPlaylist) {
    this.selectionLoading.set(true);
    playlist.isSynchronized = await this.playlistService.synchronizeSpotifyPlaylist(playlist.id);
    this.selectionLoading.set(false);
  }

  async unsyncPlaylist(playlist: SpotifyPlaylist) {
    this.selectionLoading.set(true);
    playlist.isSynchronized = await this.playlistService.unsynchronizeSpotifyPlaylist(playlist.id);
    this.selectionLoading.set(false);
  }

}

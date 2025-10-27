import {Component, computed, OnInit, Signal} from '@angular/core';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Playlist} from '../../../models/playlist.model';
import {PlaylistGroup} from '../../../models/playlist-group';
import {RouterLink} from '@angular/router';
import {GroupEditingService} from '../../../facades/group-editing.facade';
import {MatchingSelectionService} from '../../../facades/matching-selection.facade';
import {SongSelectionService} from '../../../facades/song-selection.facade';

@Component({
  selector: 'app-filter-selector',
  standalone: true,
  imports: [
    MatChipListbox,
    MatChipOption,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatSlideToggle,
    NgIf,
    MatButton,
    MatAccordion,
    NgForOf,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filter-selector.component.html',
  styleUrl: './filter-selector.component.scss'
})
export class FilterSelectorComponent implements OnInit {
  groupList: Signal<SelectablePlaylistGroup[]> = computed(() => this.groupService.groups().map(g => this.mapToSelectableGroup(g)));

  constructor(private groupService: GroupEditingService, private matchingService: MatchingSelectionService, private songService: SongSelectionService) {
  }

  ngOnInit(): void {
    this.groupService.loadGroups();
  }

  selectAllPlaylists(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.playlists.forEach(p => {
      p.selected = true;
    });
  }

  deselectAllPlaylists(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.playlists.forEach(p => {
      p.selected = false;
    });
  }

  toggleGroup(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.selected = !group.selected;
    group.playlists.forEach(p => {
      p.selected = group.selected;
    });
  }

  togglePlaylist(group: SelectablePlaylistGroup, playlist: SelectablePlaylist) {
    playlist.selected = !playlist.selected;
  }

  private mapToSelectableGroup(g: PlaylistGroup): SelectablePlaylistGroup {
    const selectablePlaylists: SelectablePlaylist[] = g.playlists?.map(p => this.mapToSelectablePlaylist(p));
    return {
      selected: true,
      opened: false,
      name: g.name,
      playlists: selectablePlaylists
    };
  }

  private mapToSelectablePlaylist(playlist: Playlist): SelectablePlaylist {
    return {
      selected: true,
      playlist: playlist
    };
  }

  private getSelectedPlaylists(): Playlist[] {
    return this.groupList()
      .filter(g => g.selected)
      .flatMap(g => g.playlists)
      .filter(p => p.selected)
      .map(p => p.playlist);
  }

  goMatch() {
    this.matchingService.getMatchingSongs(this.songService.selectedSong$()!, this.getSelectedPlaylists());
  }
}

export interface SelectablePlaylist {
  selected: boolean;
  playlist: Playlist;
}

export interface SelectablePlaylistGroup {
  selected: boolean;
  opened: boolean;
  name: string;
  playlists: SelectablePlaylist[];
}

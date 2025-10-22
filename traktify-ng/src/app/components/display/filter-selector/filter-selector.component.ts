import {Component, computed, Input, OnInit, Signal} from '@angular/core';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Playlist} from '../../../models/playlist.model';
import {PlaylistGroup} from '../../../models/playlist-group';
import {RouterLink} from '@angular/router';
import {GroupEditingService} from '../../../facades/group-editing.facade';

@Component({
  selector: 'app-filter-selector[playlistForm]',
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
  ],
  templateUrl: './filter-selector.component.html',
  styleUrl: './filter-selector.component.scss'
})
export class FilterSelectorComponent implements OnInit {
  @Input({required: true}) playlistForm!: FormGroup;
  groupList: Signal<SelectablePlaylistGroup[]> = computed(() => this.groupService.groups().map(g => this.getSelectableGroup(g)));

  constructor(private groupService: GroupEditingService) {
  }

  ngOnInit(): void {
    this.groupService.loadGroups();
  }

  selectAllPlaylists(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.playlists.forEach(p => {
      p.selected = true;
      if (group.selected) {
        this.addSelectedPlaylistToForm(p);
      }
    });
  }

  deselectAllPlaylists(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.playlists.forEach(p => {
      p.selected = false;
      this.deleteSelectedPlaylistFromForm(p);
    });
  }

  toggleGroup(event: any, group: SelectablePlaylistGroup) {
    event?.stopPropagation();

    group.selected = !group.selected;
    group.playlists.forEach(p => {
      if (group.selected) {
        if (p.selected) {
          this.addSelectedPlaylistToForm(p);
        }
      } else {
        this.deleteSelectedPlaylistFromForm(p);
      }
    });
  }

  togglePlaylist(group: SelectablePlaylistGroup, playlist: SelectablePlaylist) {
    playlist.selected = !playlist.selected;

    if (playlist.selected) {
      if (group.selected) {
        this.addSelectedPlaylistToForm(playlist);
      }
    } else {
      this.deleteSelectedPlaylistFromForm(playlist);
    }
  }

  get playlists(): FormArray {
    return (this.playlistForm.get('playlists') as FormArray);
  }

  addSelectedPlaylistToForm(playlist: SelectablePlaylist) {
    if (!this.playlists.controls.find(c => c.value.playlistID == playlist.playlist.id)) {
      const playlistForm = new FormGroup({
        playlistID: new FormControl(playlist.playlist.id, Validators.required),
      });
      this.playlists.push(playlistForm);
    }
  }

  deleteSelectedPlaylistFromForm(playlist: SelectablePlaylist) {
    const index = this.playlists.controls.findIndex(c => c.value.playlistID == playlist.playlist.id);
    if (index > -1) {
      this.playlists.removeAt(index);
    }
  }

  private getSelectableGroup(g: PlaylistGroup): SelectablePlaylistGroup {
    let selectablePlaylists: SelectablePlaylist[] = g.playlists?.map(p => this.getSelectablePlaylist(p));
    return {
      selected: true,
      opened: false,
      name: g.name,
      playlists: selectablePlaylists
    };
  }

  private getSelectablePlaylist(p: Playlist): SelectablePlaylist {
    return {
      selected: true,
      playlist: p
    };
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

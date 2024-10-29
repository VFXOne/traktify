import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupService} from '../../services/group.service';
import {Playlist} from '../../models/playlist.model';

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
    NgForOf
  ],
  templateUrl: './filter-selector.component.html',
  styleUrl: './filter-selector.component.scss'
})
export class FilterSelectorComponent implements OnInit {
  @Input({required: true}) playlistForm!: FormGroup;
  groupList: SelectablePlaylistGroup[] = [];

  @ViewChild('chiplist', {static: true}) chipList!: MatChipListbox;

  constructor(private groupService: GroupService) {
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groupList = groups.map(g => {
        let selectablePlaylists: SelectablePlaylist[] = g.playlistList.map(p => {
          return {
            selected: true,
            playlist: p
          };
        });
        return {
          selected: true,
          opened: false,
          name: g.name,
          playlists: selectablePlaylists
        };
      });
      this.groupList.forEach(g => g.playlists.forEach(p => {
        this.addSelectedPlaylistToForm(p);
      }));
    });
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

import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PlaylistGroup} from '../../models/playlist-group';
import {MatListOption, MatListSubheaderCssMatStyler, MatSelectionList} from '@angular/material/list';
import {Playlist} from '../../models/playlist.model';
import {PlaylistService} from '../../services/playlist.service';
import {NgForOf} from '@angular/common';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteGroupDialogComponent, EditGroupDialogComponent, NewGroupDialogComponent} from './group-settings-dialogs.component';
import {first} from 'rxjs';
import {GroupEditingService} from '../../facades/group-editing.facade';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-group-settings',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatIconButton,
    MatIcon,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatSelectionList,
    MatListOption,
    NgForOf,
    MatListSubheaderCssMatStyler,
    MatFormField,
    MatInput,
    MatLabel,
    MatPaginator,
    MatFabButton,
    MatSuffix,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './group-settings.component.html',
  styleUrl: './group-settings.component.scss'
})
export class GroupSettingsComponent implements OnInit {
  readonly groupList = this.groupService.groups;
  readonly playlists: WritableSignal<Playlist[]> = signal([]);

  readonly paginatedPlaylists: Signal<Playlist[]>;

  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly pageLength = computed(() => this.playlists().length);

  readonly searchString = signal('');

  readonly dialog = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);

  constructor(private playlistService: PlaylistService, private groupService: GroupEditingService) {
    this.paginatedPlaylists = computed(() => {
      let index = 0, startIndex = this.pageIndex() * this.pageSize(), endIndex = startIndex + this.pageSize();

      return this.playlists().filter(() => {
        index++;
        return (index > startIndex && index <= endIndex);
      })
        .filter(p => p.name.toLowerCase().includes(this.searchString().toLowerCase()));
    });

  }

  ngOnInit() {
    this.groupService.loadGroups();

    this.playlistService.getPlaylists().pipe(first()).subscribe(p => {
      this.playlists.set(p);
    });
  }

  pageChange(event: PageEvent) {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  isInPlaylist(playlist: Playlist, group: PlaylistGroup): boolean {
    return group.playlists?.findIndex(p => p.id === playlist.id) > -1;
  }

  onSearchChange(event: Event): void {
    event.stopPropagation();
  }

  resetSearch(): void {
    this.searchString.set('');
  }

  async onPlaylistSelectionChange(playlist: Playlist, group: PlaylistGroup, selected: boolean) {
    if (selected) {
      this.addPlaylistToGroup(group, playlist);
    } else {
      this.removePlaylistFromGroup(group, playlist);
    }
  }

  openNewGroupDialog() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {});
    dialogRef.afterClosed().subscribe(async newName => {
      if (newName !== undefined) {
        try {
          await this.groupService.createGroup(newName);
          this.snackBarNotif('Group created successfully!');
        } catch (error) {
          this.snackBarNotif('An error occurred');
        }
      }
    });
  }

  openEditGroupDialog(event: Event, group: PlaylistGroup) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EditGroupDialogComponent, {data: {name: group.name}});
    dialogRef.afterClosed().subscribe(async newName => {
      if (group.name !== newName) {
        try {
          group.name = newName;
          await this.groupService.renameGroup(group);
          this.snackBarNotif('Name edited!');
        } catch (error) {
          this.snackBarNotif('An error occurred');
        }
      }
    });
  }

  openDeleteGroupDialog(event: Event, group: PlaylistGroup) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteGroupDialogComponent, {data: {name: group.name}});
    dialogRef.afterClosed().subscribe(async _ => {
      try {
        await this.groupService.deleteGroup(group);
        this.snackBarNotif('Group deleted!');
      } catch (error) {
        this.snackBarNotif('An error occurred');
      }
    });
  }

  async addPlaylistToGroup(group: PlaylistGroup, playlist: Playlist) {
    if (!group.playlists) {
      group.playlists = [];
    }
    try {
      await this.groupService.addPlaylistToGroup(playlist, group);
    } catch (error) {
      this.snackBarNotif('An error occurred');
    }
  }

  async removePlaylistFromGroup(group: PlaylistGroup, playlist: Playlist) {
    try {
      await this.groupService.removePlaylistFromGroup(playlist, group);
    } catch (error) {
      this.snackBarNotif('An error occurred');
    }
  }

  private snackBarNotif(message: string): void {
    this.snackbar.open(message, undefined, {duration: 3000});
  }
}

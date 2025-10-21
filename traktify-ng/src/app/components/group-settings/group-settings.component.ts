import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {GroupService} from '../../services/group.service';
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
  readonly groupList: WritableSignal<PlaylistGroup[]> = signal([]);
  readonly playlists: WritableSignal<Playlist[]> = signal([]);

  readonly paginatedPlaylists: Signal<Playlist[]>;

  readonly pageIndex = signal(0);
  readonly pageSize = signal(5)
  readonly pageLength = computed(() => this.playlists().length);

  readonly searchString = signal('');

  readonly dialog = inject(MatDialog);
  readonly snackbar = inject(MatSnackBar);

  //TODO séparer entre une façade et un composant d'affichage
  constructor(private groupService: GroupService, private playlistService: PlaylistService) {
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
    this.groupService.getGroups().pipe(first()).subscribe(g => this.groupList.set(g));

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

  openNewGroupDialog(): void {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {});

    dialogRef.afterClosed().subscribe(newName => {
      if (newName !== undefined) {
        this.addNewGroup({
          id: '',
          name: newName,
          playlists: []
        });
      }
    });
  }

  openEditGroupDialog(event: Event, group: PlaylistGroup): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EditGroupDialogComponent, {data: {name: group.name}});
    dialogRef.afterClosed().subscribe(newName => {
      let oldName = group.name;
      if (oldName !== newName) {
        this.groupService.editGroup(group).subscribe({
          next: (ok) => {
            if (ok) {
              group.name = newName;
              this.snackBarNotif('Name edited!');
            } else {
              this.snackBarNotif('An error occurred');
            }
          },
          error: (err) => {
            console.log(err);
            this.snackBarNotif('An error occurred, see logs');
          }
        });
      }
    });
  }

  openDeleteGroupDialog(event: Event, group: PlaylistGroup): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteGroupDialogComponent, {data: {name: group.name}});
    dialogRef.afterClosed().subscribe(_ => {
      this.groupService.deleteGroup(group).subscribe({
        next: (ok) => {
          if (ok) {
            this.groupService.getGroups().subscribe(g => this.groupList.set(g));
            this.snackBarNotif('Group deleted!');
          } else {
            this.snackBarNotif('An error occurred');
          }
        },
        error: (err) => {
          console.log(err);
          this.snackBarNotif('An error occurred, see logs');
        }
      });
    });
  }

  onPlaylistSelectionChange(playlist: Playlist, group: PlaylistGroup, selected: boolean): void {
    if (selected) {
      this.addPlaylistToGroup(group, playlist);
    } else {
      this.removePlaylistFromGroup(group, playlist);
    }
  }

  addNewGroup(group: PlaylistGroup): void {
    this.groupService.createGroup(group).subscribe({
      next: (newGroup) => {
        this.groupList().push(newGroup);
        this.snackBarNotif('New group created!');
        return newGroup;
      },
      error: (err) => {
        console.log(err);
        this.snackBarNotif('An error occurred');
      }
    });
  }

  addPlaylistToGroup(group: PlaylistGroup, playlist: Playlist): void {
    if (!group.playlists) {
      group.playlists = [];
    }
    group.playlists.push(playlist);
    this.groupService.addPlaylistToGroup(group, playlist);
  }

  removePlaylistFromGroup(group: PlaylistGroup, playlist: Playlist): void {
    group.playlists = group.playlists.filter(p => p.name !== playlist.name);
    this.groupService.deletePlaylistFromGroup(group, playlist);
  }

  private snackBarNotif(message: string): void {
    this.snackbar.open(message, undefined, {duration: 3000});
  }
}

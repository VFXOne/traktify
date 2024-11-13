import {Component, OnInit, ViewChild} from '@angular/core';
import {SongService} from '../../services/song.service';
import {Song} from '../../models/song.model';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {SongDetailComponent} from '../song-detail/song-detail.component';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {DurationPipe} from '../../pipes/duration.pipe';
import {MatSort, MatSortHeader, MatSortModule, Sort} from '@angular/material/sort';
import {NgIf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-song-table',
  standalone: true,
  imports: [
    CdkDropList,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatIcon,
    ArtistsDisplayPipe,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    CdkDrag,
    RouterLinkActive,
    RouterLink,
    SongDetailComponent,
    MatDrawerContainer,
    MatDrawerContent,
    MatDrawer,
    DurationPipe,
    MatSort,
    MatSortModule,
    MatSortHeader,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './song-table.component.html',
  styleUrl: './song-table.component.scss'
})

export class SongTableComponent implements OnInit {
  @ViewChild('table', {static: true}) table!: MatTable<Song>;
  @ViewChild('songDrawer', {static: true}) songDrawer!: MatDrawer;

  displayColumns: string[] = ['index', 'name', 'artists', 'key', 'bpm', 'duration'];

  songs: Song[] = [];
  sortedSongs: Song[] = [];
  selectedSong: Song | undefined;
  songsLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private songService: SongService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.songsLoaded = false;
      console.log('load songs');
      this.songService.getSongsFromPlaylist(id).subscribe(songs => {
        this.songs = songs;
        this.songsLoaded = true;
        console.log('songs loaded');
        this.table.renderRows();
      });
    });
  }

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.songs.findIndex(s => s.id === event.item.data.id);
    const currentIndex = event.currentIndex;

    this.swapSongIndexes(previousIndex, currentIndex);

    moveItemInArray(this.songs, previousIndex, currentIndex);
    this.table.renderRows();
  }

  private swapSongIndexes(previousIndex: number, newIndex: number): void {
    const song1 = this.songs.at(previousIndex);
    const song2 = this.songs.at(newIndex);
    // @ts-ignore
    song1.index = newIndex + 1;
    // @ts-ignore
    song2.index = previousIndex + 1;
  }

  protected selectSongToDisplay(id: string) {
    this.selectedSong = this.songs.find(s => s.id === id);
    this.songDrawer.open();
  }

  protected sortTable(sort: Sort) {
    this.sortedSongs = new SongTableSorter().sortSongs(sort, this.songs);
    this.table.renderRows();
  }
}

export class SongTableSorter {

  public sortSongs(sort: Sort, songs: Song[]): Song[] {
    if (!sort.active || sort.direction === '') {
      sort.active = 'index';
      sort.direction = 'asc';
    }

    return songs.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'index':
          return this.compare(a.index, b.index, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'artists':
          return this.compare(a.artists[0].name, b.artists[0].name, isAsc);
        case 'key':
          return this.compare(a.audioInfo?.camelotKey, b.audioInfo?.camelotKey, isAsc);
        case 'bpm':
          return this.compare(a.audioInfo?.tempo, b.audioInfo?.tempo, isAsc);
        case 'duration':
          return this.compare(a.duration_ms, b.duration_ms, isAsc);
        case 'energy':
          return this.compare(a.audioInfo?.energy, b.audioInfo?.energy, isAsc);
        case 'danceability':
          return this.compare(a.audioInfo?.danceability, b.audioInfo?.danceability, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

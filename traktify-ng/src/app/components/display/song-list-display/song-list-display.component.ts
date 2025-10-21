import {Component, input, InputSignal, OnInit, ViewChild} from '@angular/core';
import {ArtistsDisplayPipe} from '../../../pipes/artists-display.pipe';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {DurationPipe} from '../../../pipes/duration.pipe';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {RouterLinkActive} from '@angular/router';
import {Song} from '../../../models/song.model';
import {SongSelectionService} from '../../../facades/song-selection.facade';

@Component({
  selector: 'song-list-display',
  standalone: true,
  imports: [
    ArtistsDisplayPipe,
    CdkDrag,
    CdkDropList,
    DurationPipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    RouterLinkActive,
    MatHeaderCellDef
  ],
  templateUrl: './song-list-display.component.html',
  styleUrl: './song-list-display.component.scss'
})
export class SongListDisplayComponent implements OnInit {
  readonly songs: InputSignal<Song[]> = input.required({transform: (value) => this.sortedSongs = value});

  sortedSongs: Song[] = [];

  @ViewChild('table', {static: true}) table!: MatTable<Song>;
  displayColumns: string[] = ['index', 'name', 'artists', 'key', 'bpm', 'duration'];

  constructor(private songSelectionService: SongSelectionService) {
  }

  ngOnInit(): void {
    this.table.renderRows();
  }

  onSongClick(songID: string): void {
    this.songSelectionService.selectSongByID(songID);
  }

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.sortedSongs.findIndex(s => s.id === event.item.data.id);
    const currentIndex = event.currentIndex;

    this.swapSongIndexes(previousIndex, currentIndex);

    moveItemInArray(this.sortedSongs, previousIndex, currentIndex);
    this.table.renderRows();
  }

  private swapSongIndexes(previousIndex: number, newIndex: number): void {
    const song1 = this.sortedSongs.at(previousIndex);
    const song2 = this.sortedSongs.at(newIndex);
    // @ts-ignore
    song1.index = newIndex + 1;
    // @ts-ignore
    song2.index = previousIndex + 1;
  }

  protected sortTable(sort: Sort) {
    this.sortedSongs = new SongTableSorter().sortSongs(sort, this.sortedSongs);
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

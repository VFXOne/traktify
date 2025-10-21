import {Component, input, InputSignal, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Song} from '../../models/song.model';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatchService} from '../../services/match.service';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {DurationPipe} from '../../pipes/duration.pipe';
import {FilterSelectorComponent} from '../display/filter-selector/filter-selector.component';
import {SongTableSorter} from '../display/song-list-display/song-list-display.component';

@Component({
  selector: 'app-match-selector[song]',
  standalone: true,
  imports: [
    FilterSelectorComponent,
    MatButton,
    ReactiveFormsModule,
    MatDivider,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCellDef,
    MatCell,
    ArtistsDisplayPipe,
    DurationPipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './match-selector.component.html',
  styleUrl: './match-selector.component.scss'
})
export class MatchSelectorComponent implements OnInit, OnChanges {
  song: InputSignal<Song | undefined> = input.required<Song | undefined>();
  @ViewChild('matchTable', {static: true}) table!: MatTable<Song>;
  displayColumns: string[] = ['name', 'key', 'bpm', 'duration', 'energy', 'danceability'];

  matchForm!: FormGroup;
  matchList: Song[] = [];

  matchedSongID: string = '';

  constructor(private builder: FormBuilder, private matchService: MatchService) {
  }

  ngOnInit(): void {
    this.matchForm = this.builder.group({
      playlists: this.builder.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.song()?.id !== this.matchedSongID) {
      this.matchList = [];
    }
  }

  onSubmit() {
    this.matchedSongID = this.song()!.id;
    this.matchService.getSongsMatching(this.song()!.id, this.getSelectedPlaylistsIDs()).subscribe(songs => {
      this.matchList = songs;
      this.table.renderRows();
    });
  }

  getSelectedPlaylistsIDs(): string[] {
    const playlistIDs: string[] = [];
    const formIDs = this.matchForm.get('playlists') as FormArray;
    formIDs.controls.forEach(control => playlistIDs.push(control.value.playlistID));
    return playlistIDs;
  }

  sortTable(sort: Sort) {
    this.matchList = new SongTableSorter().sortSongs(sort, this.matchList);
    this.table.renderRows();
  }
}

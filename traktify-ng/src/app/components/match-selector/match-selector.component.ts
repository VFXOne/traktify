import {Component, computed, input, InputSignal, OnInit, Signal, ViewChild} from '@angular/core';
import {Song} from '../../models/song.model';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDivider} from '@angular/material/divider';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {DurationPipe} from '../../pipes/duration.pipe';
import {FilterSelectorComponent} from '../display/filter-selector/filter-selector.component';
import {MatchingSelectionService} from '../../facades/matching-selection.facade';

@Component({
  selector: 'app-match-selector[song]',
  standalone: true,
  imports: [
    FilterSelectorComponent,
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
export class MatchSelectorComponent implements OnInit {
  song: InputSignal<Song> = input.required<Song>();

  @ViewChild('matchTable', {static: true}) table!: MatTable<Song>;
  displayColumns: string[] = ['name', 'key', 'bpm', 'duration', 'energy', 'danceability'];

  matchList: Signal<Song[]> = computed(() => this.matchService.matchedSongs() == null ? [] : this.matchService.matchedSongs()!);

  constructor(private matchService: MatchingSelectionService) {
  }

  ngOnInit(): void {
  }

  sortTable(sort: Sort) {
    //TODO trouver comment trier la liste
    // this.displaySongs = new SongTableSorter().sortSongs(sort, this.matchList());
    this.table.renderRows();
  }
}

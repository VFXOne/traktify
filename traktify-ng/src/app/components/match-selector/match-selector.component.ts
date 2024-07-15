import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Song} from '../../models/song.model';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import {FilterSelectorComponent} from '../filter-selector/filter-selector.component';
import {GroupFilter} from '../../models/group-filter';
import {GroupService} from '../../services/group.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatchService} from '../../services/match.service';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {DurationPipe} from '../../pipes/duration.pipe';

@Component({
  selector: 'app-match-selector[song]',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatLabel,
    MatSlideToggle,
    MatExpansionPanelTitle,
    MatFormField,
    MatSelect,
    MatOption,
    MatChipListbox,
    MatChipOption,
    FilterSelectorComponent,
    MatCheckbox,
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
export class MatchSelectorComponent implements OnInit {
  @Input({required: true}) song!: Song;
  @ViewChild('matchTable', {static: true}) table!: MatTable<Song>;
  displayColumns: string[] = ['name', 'key', 'bpm', 'duration', 'energy', 'danceability'];

  groupList: GroupFilter[] = [];
  matchForm!: FormGroup;
  matchList: Song[] = [];

  constructor(private groupService: GroupService, private builder: FormBuilder, private matchService: MatchService) {
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe(groups => {
      this.groupList = groups;
    });

    this.matchForm = this.builder.group({
      playlists: this.builder.array([])
    });
  }

  onSubmit() {
    console.log(this.getSelectedPlaylistsIDs());
    this.matchService.getSonsMatching(this.song.id, this.getSelectedPlaylistsIDs()).subscribe(songs => {
      this.matchList = songs;
      this.table.renderRows();
    });
  }

  getSelectedPlaylistsIDs(): string[] {
    const playlistIDs: string[] = [];
    const formIDs = this.matchForm.get('playlists') as FormArray;
    formIDs.controls.forEach(control => control.get('id'));
    return playlistIDs;
  }

  sortTable(sort: Sort) {
    //TODO

    this.table.renderRows();
  }
}

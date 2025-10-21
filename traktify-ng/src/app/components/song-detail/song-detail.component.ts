import {Component, Inject} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {PropertySpinnerComponent} from '../display/property-spinner/property-spinner.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatchSelectorComponent} from '../match-selector/match-selector.component';
import {DurationPipe} from '../../pipes/duration.pipe';
import {NgIf} from '@angular/common';
import {Song} from '../../models/song.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardTitleGroup,
    ArtistsDisplayPipe,
    MatCardContent,
    PropertySpinnerComponent,
    MatGridList,
    MatGridTile,
    MatchSelectorComponent,
    DurationPipe,
    NgIf
  ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss'
})
export class SongDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public song: Song) {
  }

}

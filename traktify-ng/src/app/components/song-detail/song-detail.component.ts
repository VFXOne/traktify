import {Component, Input} from '@angular/core';
import {Song} from '../../models/song.model';
import {MatDrawer} from '@angular/material/sidenav';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {ArtistsDisplayPipe} from '../../pipes/artists-display.pipe';
import {PropertySpinnerComponent} from '../property-spinner/property-spinner.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatDivider} from '@angular/material/divider';
import {MatchSelectorComponent} from '../match-selector/match-selector.component';
import {DurationPipe} from '../../pipes/duration.pipe';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-song-detail[song]',
  standalone: true,
  imports: [
    MatDrawer,
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
    MatDivider,
    MatchSelectorComponent,
    DurationPipe,
    NgIf
  ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss'
})
export class SongDetailComponent {
  @Input({required: true}) song!: Song;
}

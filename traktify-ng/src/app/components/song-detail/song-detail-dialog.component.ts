import {Component, effect, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SongSelectionService} from '../../facades/song-selection.facade';
import {SongDetailComponent} from './song-detail.component';

@Component({
  selector: 'app-song-detail-dialog',
  standalone: true,
  template: ''
})
export class SongDetailDialogComponent {
  private readonly dialog = inject(MatDialog);

  private readonly dialogConfig = {
    width: '90vw',
    height: '90vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: 'song-detail-dialog-panel',
  }

  constructor(private songsSelection: SongSelectionService) {
    effect(() => {
      const song = this.songsSelection.selectedSong$();
      if (song) {
        this.dialog.open(SongDetailComponent, {
          ...this.dialogConfig,
          data: song
        })
      }
    })
  }
}

import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {PlaylistSelectorComponent} from '../playlist-selector/playlist-selector.component';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [RouterOutlet, MatIconButton, MatToolbar, MatIcon, MatDrawer, MatDrawerContainer, MatDrawerContent, PlaylistSelectorComponent, RouterLink],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss'
})
export class FrameComponent {
  title = 'traktify-ng';
}

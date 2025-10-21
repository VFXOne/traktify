import { Component } from '@angular/core';
import {MatCard, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {GroupSettingsComponent} from '../../group-settings/group-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatIcon,
    MatCardHeader,
    MatTabGroup,
    MatTab,
    GroupSettingsComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}

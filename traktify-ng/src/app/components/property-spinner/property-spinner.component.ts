import {Component, Input} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-property-spinner',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgStyle
  ],
  templateUrl: './property-spinner.component.html',
  styleUrl: './property-spinner.component.scss'
})
export class PropertySpinnerComponent {
  @Input() value: number | undefined = 0;
  @Input() size: number = 70;
  @Input() label: string = "";
}

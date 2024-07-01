import {AfterViewInit, Component, Input, signal, ViewChild} from '@angular/core';
import {GroupFilter} from '../../models/group-filter';
import {MatChipListbox, MatChipOption, MatChipSelectionChange} from '@angular/material/chips';
import {MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-filter-selector[group]',
  standalone: true,
  imports: [
    MatChipListbox,
    MatChipOption,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatSlideToggle,
    NgIf,
    MatButton
  ],
  templateUrl: './filter-selector.component.html',
  styleUrl: './filter-selector.component.scss'
})
export class FilterSelectorComponent implements AfterViewInit {
  @Input({required: true}) group!: GroupFilter;
  @Input({required: true}) playlistForm!: FormGroup;
  readonly panelOpenState = signal(false);

  @ViewChild('chiplist', {static: true}) chipList!: MatChipListbox;

  constructor() {
  }

  ngAfterViewInit() {
    this.selectAll(null);
  }

  selectAll(event: any) {
    event?.stopPropagation();
    this.chipList._chips?.toArray().forEach(item => item.select());
  }

  deselectAll(event: any) {
    event?.stopPropagation();
    this.chipList._chips?.toArray().forEach(item => item.deselect());
  }

  toggleSelect(event: any, slider: MatSlideToggle) {
    event?.stopPropagation();

    let selectedChips = this.chipList.selected as MatChipOption[];
    if (slider.checked) {
      selectedChips.forEach(chip => this.addID(chip.value));
    } else {
      selectedChips.forEach(chip => this.removeID(chip.value));
    }
  }

  chipSelected(event: MatChipSelectionChange) {
    if (event.selected) {
      this.addID(event.source.value);
    } else {
      this.removeID(event.source.value);
    }
  }

  get playlists(): FormArray {
    return (this.playlistForm.get('playlists') as FormArray);
  }

  addID(ID: string) {
    this.playlists.push(
      new FormGroup({
        id: new FormControl(ID, Validators.required),
      })
    );
  }

  removeID(ID: string) {
    const index = this.playlists.controls.findIndex(formID => formID.value.id === ID);
    if (index !== -1) {
      this.playlists.removeAt(index);
    }
  }
}

import { Component, computed, input, output } from '@angular/core';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.css',
})
export class TagComponent {
  data = input.required<Tag>();
  removable = input<boolean>();

  remove = output<string>();

  onRemove() {
    console.log('On Remove');
    this.remove.emit(this.data().name);
  }

  get styles() {
    return {
      'background-color': `color-mix(in srgb, ${this.data().color} 45%, white)`,
      'border-color': `color-mix(in srgb, ${this.data().color} 45%, white)`,
    };
  }
}

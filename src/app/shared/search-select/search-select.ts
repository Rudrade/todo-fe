import {
  Component,
  computed,
  inject,
  input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserListService } from '../../services/userListService';

@Component({
  selector: 'app-search-select',
  imports: [ReactiveFormsModule],
  templateUrl: './search-select.html',
  styleUrl: './search-select.css',
})
export class SearchSelectComponent implements OnChanges {
  private userListService = inject(UserListService);

  options = input.required<string[]>();
  multiple = input<boolean>(false);
  selected = input<string | string[]>();
  hasColor = input<boolean>(false);

  selectOption = output<string>();
  createOption = output<string | null>();

  searchInput = new FormControl('');
  private searchTerm = signal<string>('');
  showDropdown = false;
  selectedOptions = signal<string[]>([]);
  filteredOptions = computed(() => {
    if (this.searchTerm().length > 0) {
      const lowercaseTerm = this.searchTerm().toLowerCase();
      return this.options().filter((option) => option.toLowerCase().includes(lowercaseTerm));
    } else if (this.multiple()) {
      return this.options().filter(
        (option) => !this.selectedOptions().find((opt) => opt === option)
      );
    }
    return [...this.options()];
  });

  constructor() {
    this.searchInput.valueChanges.subscribe((value) => {
      this.filterOptions(value || '');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      if (this.multiple()) {
        this.selectedOptions.set(changes['selected'].currentValue);
      } else {
        this.onSelectOption(changes['selected'].currentValue);
      }
    }
  }

  onSearchInputFocus() {
    this.showDropdown = true;
    this.filterOptions(this.searchInput.value || '');
  }

  onCreateOption() {
    this.createOption.emit(this.searchInput.value);
    if (this.multiple()) {
      this.searchInput.setValue('');
    }
    this.showDropdown = false;
  }

  onSelectOption(option: string) {
    this.selectOption.emit(option);
    if (this.multiple()) {
      this.selectedOptions.set([...this.selectedOptions(), option]);
      this.searchInput.setValue('');
    } else {
      this.searchInput.setValue(option, { emitEvent: false });
    }
    this.showDropdown = false;
  }

  listColor(name: string) {
    return this.userListService.listColorByName(name);
  }

  hasCreateOption(): boolean {
    const searchTerm = this.searchInput.value?.trim().toLowerCase();
    return !!searchTerm && !this.options().some((option) => option.toLowerCase() === searchTerm);
  }

  filterOptions(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.showDropdown = true;
    console.log('[SearchSelect] filterOption:', this.searchTerm());
  }

  get createOptionText(): string {
    const searchTerm = this.searchInput.value?.trim();
    return searchTerm ? `Create "${searchTerm}"` : '';
  }
}

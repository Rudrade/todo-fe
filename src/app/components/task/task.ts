import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/taskService';
import { take } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { UserListService } from '../../services/userListService';

@Component({
  selector: 'app-task',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);
  private userListService = inject(UserListService);

  close = output<void>();
  refreshTasks = output<void>();
  data = input<Task | undefined>();

  private currentId = '';
  private createdOption = false;

  listOptions = this.userListService.userLists;
  searchInput = new FormControl('');
  filteredOptions: string[] = [];
  showDropdown = false;
  selectedOption = '';

  form = new FormGroup({
    title: new FormControl(this.data()?.title, {
      validators: [Validators.required],
    }),
    description: new FormControl(this.data()?.description),
    dueDate: new FormControl(this.data()?.dueDate),
    list: new FormControl(''),
  });

  constructor() {
    effect(() => {
      console.log('[Data]', this.data());
      if (this.data()?.id) {
        this.currentId = this.data()!.id;
      }

      this.form.patchValue({
        title: this.data()?.title,
        description: this.data()?.description,
        dueDate: this.data()?.dueDate,
      });
      this.selectOption(this.data()?.listName || '');
    });

    this.searchInput.valueChanges.subscribe((value) => {
      this.filterOptions(value || '');
    });
  }

  filterOptions(searchTerm: string) {
    const lowercaseTerm = searchTerm.toLowerCase();
    this.filteredOptions = this.listOptions()
      .map((opt) => opt.name)
      .filter((option) => option.toLowerCase().includes(lowercaseTerm));
    this.showDropdown = true;
  }

  selectOption(option: string) {
    console.log('Selected option', option);
    this.selectedOption = option;
    this.searchInput.setValue(option, { emitEvent: false });
    this.form.patchValue({ list: option });
    this.showDropdown = false;
  }

  onSearchInputFocus() {
    this.showDropdown = true;
    this.filterOptions(this.searchInput.value || '');
  }

  get createOptionText(): string {
    const searchTerm = this.searchInput.value?.trim();
    return searchTerm ? `Create "${searchTerm}"` : '';
  }

  hasCreateOption(): boolean {
    const searchTerm = this.searchInput.value?.trim().toLowerCase();
    return (
      !!searchTerm && !this.listOptions().some((option) => option.name.toLowerCase() === searchTerm)
    );
  }

  createOption() {
    const newOption = this.searchInput.value?.trim();
    console.log('Create Option: ', newOption);
    if (
      newOption &&
      !this.listOptions()
        .map((opt) => opt.name)
        .includes(newOption)
    ) {
      this.createdOption = true;
    }
    this.selectOption(newOption || '');
    this.showDropdown = false;
  }

  listColor(name: string) {
    return this.userListService.listColorByName(name);
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.title?.invalid) {
      this.title.markAsDirty();
    }

    if (this.form.valid) {
      const title = this.title?.value ? this.title.value : '';

      console.log('selectedOption', this.selectedOption);

      this.taskService
        .saveTask({
          id: this.currentId,
          title,
          description: this.description?.value,
          dueDate: this.dueDate?.value,
          completed: false,
          listName: this.selectedOption,
        })
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.id) {
              this.currentId = resp.id;
            }
            this.alertService.addAlert('success', 'Task created with success');
            this.refreshTasks.emit();
            if (this.createdOption) {
              this.userListService.fetchUserLists();
            }
          },
          error: (error) => {
            this.alertService.addAlert('error', error?.error);
          },
        });
    }
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get dueDate() {
    return this.form.get('dueDate');
  }
}

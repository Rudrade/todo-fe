import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/taskService';
import { take } from 'rxjs';
import { AlertService } from '../../services/alertService';
import { UserListService } from '../../services/userService';
import { TagsService } from '../../services/tagsService';
import { TagComponent } from '../tag/tag';
import { SearchSelectComponent } from '../../shared/search-select/search-select';
import { Tag } from '../../models/tag';

@Component({
  selector: 'app-task',
  imports: [ReactiveFormsModule, CommonModule, TagComponent, SearchSelectComponent],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);
  private userListService = inject(UserListService);
  private tagService = inject(TagsService);

  close = output<void>();
  refreshTasks = output<void>();
  data = input<Task | undefined>();

  private currentId = '';

  listOptions = this.userListService.userLists;
  selectedList = '';

  selectedTags = signal<Tag[]>([]);
  selectedOptions = computed(() => {
    return this.selectedTags().map((tag) => tag.name);
  });
  constructor() {
    effect(() => {
      const current = this.selectedTags();
      const updated = current.map(
        (tag) => this.tagService.userTags().find((t) => t.name === tag.name) ?? tag
      );
      const changed = updated.some((tag, idx) => tag !== current[idx]);
      if (changed) {
        this.selectedTags.set(updated);
      }
    });

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
      this.selectList(this.data()?.listName || '');

      const tagArr: Tag[] = [];
      this.data()?.tags?.forEach((tag) => tagArr.push(tag));
      this.selectedTags.set(tagArr);
    });
  }
  userTags = computed(() => {
    return this.tagService
      .userTags()
      .filter((tag) => !this.selectedTags().find((t) => t.name === tag.name));
  });

  form = new FormGroup({
    title: new FormControl(this.data()?.title, {
      validators: [Validators.required],
    }),
    description: new FormControl(this.data()?.description),
    dueDate: new FormControl(this.data()?.dueDate),
  });

  get userListOptions() {
    return this.listOptions().map((opt) => opt.name);
  }

  selectList(list: string) {
    this.selectedList = list;
    console.log('List selected in taskComponent: ', list);
  }

  createList(name: string | null) {
    const newOption = name?.trim();
    this.selectList(newOption || '');
  }

  selectTag(name: string) {
    const tag = this.userTags().find((tag) => tag.name === name);
    if (tag) {
      this.selectedTags.update((arr) => [...arr, tag]);
    }
  }

  createTag(name: string | null) {
    const newTag = name?.trim();
    if (newTag && !this.userTagOptions.includes(newTag)) {
      this.selectedTags.update((arr) => [
        ...arr,
        {
          color: '',
          name: newTag,
        },
      ]);
    }
  }

  removeTag(name: string) {
    this.selectedTags.set(this.selectedTags().filter((tag) => tag.name !== name));
  }

  get userTagOptions() {
    return this.userTags().map((tag) => tag.name);
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

      this.taskService
        .saveTask({
          id: this.currentId,
          title,
          description: this.description?.value,
          dueDate: this.dueDate?.value,
          completed: false,
          listName: this.selectedList,
          tags: this.selectedTags(),
        })
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.id) {
              this.currentId = resp.id;
            }
            this.alertService.addAlert('success', 'Task created with success');
            this.refreshTasks.emit();
          },
          error: (error) => {
            const errMsg = error?.message ? error?.message : error?.error;
            this.alertService.addAlert('error', errMsg);
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

import { Component, effect, inject, input, output } from '@angular/core';
import { Task } from '../../models/task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/taskService';
import { take } from 'rxjs';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-task',
  imports: [ReactiveFormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);

  close = output<void>();
  refreshTasks = output<void>();
  data = input<Task | undefined>();

  private currentId = '';

  form = new FormGroup({
    title: new FormControl(this.data()?.title, {
      validators: [Validators.required],
    }),
    description: new FormControl(this.data()?.description),
    dueDate: new FormControl(this.data()?.dueDate),
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
    });
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

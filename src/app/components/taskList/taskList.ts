import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../services/taskService';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  private currentFilter = '';

  tasks = this.taskService.tasks;
  taskCount = signal<Number | undefined>(undefined);
  isFetchingData = signal<boolean>(false);

  // TODO: Click renders details form component (Incluing new task)
  // TODO: Filter all
  // TODO: Pagination
  // TODO: Fix menu active window
  // TODO: Impl notifications

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (param) => {
        this.currentFilter = param['filter'];
        this.fetchTasks(this.currentFilter);
      },
    });
  }

  private fetchTasks(filter: string) {
    this.isFetchingData.set(true);
    this.taskService.fetchTasks(filter).subscribe({
      next: (response) => {
        this.tasks.set(response.tasks);
        this.taskCount.set(response.count);
      },
      complete: () => {
        this.isFetchingData.set(false);
      },
    });
  }

  onCompleteTask(id: string) {
    const subscription = this.taskService.removeTask(id).subscribe({
      complete: () => this.fetchTasks(this.currentFilter),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}

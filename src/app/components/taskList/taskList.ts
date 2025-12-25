import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../services/taskService';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../services/alertService';
import { Task } from '../../models/task';
import { TaskComponent } from '../task/task';
import { UserListService } from '../../services/userService';
import { TagsService } from '../../services/tagsService';

@Component({
  selector: 'app-task-list',
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
  imports: [TaskComponent],
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private userListService = inject(UserListService);
  private tagService = inject(TagsService);

  private currentFilter = '';
  private currentSearchTerm = '';

  tasks = this.taskService.tasks;
  taskCount = signal<Number | undefined>(undefined);
  isFetchingData = signal<boolean>(false);
  currentTask = signal<Task | undefined>(undefined);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (param) => {
        this.currentFilter = param['filter'];
        this.currentSearchTerm = param['searchTerm'];
        console.log('[TaskList.Param] ', param);
        this.fetchTasks(this.currentFilter, this.currentSearchTerm);
      },
      error: (error) => this.alertService.addAlert('error', error.message),
    });
  }

  refreshTasks() {
    this.fetchTasks(this.currentFilter, this.currentSearchTerm);
  }

  private fetchTasks(filter: string, searchTearm: string | undefined) {
    this.isFetchingData.set(true);
    this.taskService
      .fetchTasks(filter, searchTearm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('[TaskList fetchTasks next] ', response);
          this.tasks.set(response.tasks);
          this.taskCount.set(response.count);
        },
        complete: () => {
          console.log('[TaskList fetchTasks complete] ...');
          this.isFetchingData.set(false);
          this.userListService.fetchUserLists();
          this.tagService.fetchTags();
        },
        error: (error) => this.alertService.addAlert('error', error.message),
      });
  }

  onCompleteTask(id: string) {
    const subscription = this.taskService.removeTask(id).subscribe({
      next: () => this.alertService.addAlert('success', 'Task completed'),
      complete: () => this.fetchTasks(this.currentFilter, this.currentSearchTerm),
      error: (error) => this.alertService.addAlert('error', error.message),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onOpenTask(task: Task) {
    this.currentTask.set(task);
    console.log('[CurrentTask]', this.currentTask());
  }

  onCreateTask() {
    this.currentTask.set({
      id: '',
      title: '',
      description: undefined,
      dueDate: undefined,
      completed: false,
      listName: undefined,
      tags: [],
    });
  }

  onCloseTask() {
    this.currentTask.set(undefined);
  }

  get filterName() {
    if (this.currentFilter === 'upcoming') {
      return 'Upcoming';
    } else if (this.currentFilter === 'today') {
      return 'Today';
    } else if (this.currentFilter === 'search') {
      return 'Search';
    } else if (this.currentFilter === 'list') {
      return this.currentSearchTerm;
    } else {
      return 'All';
    }
  }

  listColor(listName: string) {
    return this.userListService.listColorByName(listName);
  }
}

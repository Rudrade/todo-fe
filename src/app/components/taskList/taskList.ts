import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../services/taskService';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../services/alertService';
import { Task } from '../../models/task';
import { TaskComponent } from '../task/task';
import { UserListService } from '../../services/userListService';
import { TagsService } from '../../services/tagsService';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
  imports: [TaskComponent, TranslatePipe],
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly alertService = inject(AlertService);
  private readonly userListService = inject(UserListService);
  private readonly tagService = inject(TagsService);
  private readonly translate = inject(TranslateService);

  private currentFilter = '';
  private currentSearchTerm = '';

  tasks = this.taskService.tasks;
  taskCount = signal<number | undefined>(undefined);
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
      next: () => this.alertService.addAlert('success', this.translate.instant('task.completed')),
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

  get filterLabelKey() {
    if (this.currentFilter === 'upcoming') {
      return 'taskList.filter.upcoming';
    }
    if (this.currentFilter === 'today') {
      return 'taskList.filter.today';
    }
    if (this.currentFilter === 'search') {
      return 'taskList.filter.search';
    }
    return 'taskList.filter.all';
  }

  get filterValue() {
    if (this.currentFilter === 'list' || this.currentFilter === 'search') {
      return this.currentSearchTerm;
    }
    return undefined;
  }

  listColor(listName: string) {
    return this.userListService.listColorByName(listName);
  }
}

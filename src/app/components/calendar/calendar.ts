import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task } from '../../models/task';
import { AlertService } from '../../services/alertService';
import { TaskService } from '../../services/taskService';
import { TaskComponent } from '../task/task';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  imports: [CommonModule, TaskComponent],
})
export class CalendarComponent {
  private taskService = inject(TaskService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthRef = signal(this.startOfMonth(new Date()));
  tasks = this.taskService.tasks;
  currentTask = signal<Task | undefined>(undefined);

  monthLabel = computed(() => {
    return this.monthRef().toLocaleString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  });

  weeks = computed<CalendarDay[][]>(() => {
    const firstDay = this.startOfMonth(this.monthRef());
    const daysInMonth = this.daysInMonth(this.monthRef());
    const startOffset = firstDay.getDay();
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - startOffset);

    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const taskMap = this.mapTasksByDate(this.tasks());

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < totalCells; i++) {
      const currentDate = new Date(gridStart);
      currentDate.setDate(gridStart.getDate() + i);
      const key = this.toDateKey(currentDate);

      const day: CalendarDay = {
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === this.monthRef().getMonth(),
        tasks: key ? taskMap.get(key) ?? [] : [],
      };

      if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(day);
    }

    return weeks;
  });

  constructor() {
    this.fetchTasks();
  }

  changeMonth(step: number) {
    const current = this.monthRef();
    this.monthRef.set(new Date(current.getFullYear(), current.getMonth() + step, 1));
  }

  goToToday() {
    this.monthRef.set(this.startOfMonth(new Date()));
  }

  isToday(date: Date) {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  onOpenTask(task: Task) {
    this.currentTask.set(task);
  }

  onCloseTask() {
    this.currentTask.set(undefined);
  }

  onRefreshTasks() {
    this.fetchTasks();
    this.onCloseTask();
  }

  private fetchTasks() {
    this.taskService
      .fetchTasks('', undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const normalized = response.tasks.map((task) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          this.taskService.tasks.set(normalized);
        },
        error: (error) => this.alertService.addAlert('error', error.message),
      });
  }

  private mapTasksByDate(tasks: Task[]) {
    const result = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const key = this.toDateKey(task.dueDate);
      if (!key) {
        return;
      }
      const bucket = result.get(key) ?? [];
      bucket.push(task);
      result.set(key, bucket);
    });
    return result;
  }

  private toDateKey(dateValue: Date | string | undefined | null) {
    if (!dateValue) {
      return undefined;
    }
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) {
      return undefined;
    }
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private daysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
}

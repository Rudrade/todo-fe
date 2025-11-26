import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly();

  ngOnInit(): void {
    this.fetchTasks();
  }

  private fetchTasks(): void {
    const subscription = this.httpClient
      .get<Task[]>('http://localhost:8080/todo/api/all')
      .subscribe({
        next: (data) => this.tasks.set(data),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

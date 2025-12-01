import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskListResponse } from '../models/taskListResponse';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient);
  tasks = signal<Task[]>([]);

  fetchTasks(
    filter: string | undefined,
    searchTerm: string | undefined
  ): Observable<TaskListResponse> {
    console.log('[FetchTasksService]', filter);
    const params: any = {};
    if (filter) {
      params['filter'] = filter;
      if (searchTerm) {
        params['searchTerm'] = searchTerm;
      }
    }

    return this.httpClient.get<TaskListResponse>('http://localhost:8080/todo/api/task', {
      params,
    });
  }

  removeTask(id: string) {
    return this.httpClient.delete('http://localhost:8080/todo/api/task/remove/' + id);
  }
}

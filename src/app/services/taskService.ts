import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskListResponse } from '../models/taskListResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'task';
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

    return this.httpClient.get<TaskListResponse>(this.baseUrl, {
      params,
    });
  }

  removeTask(id: string) {
    return this.httpClient.delete(this.baseUrl + '/remove/' + id);
  }

  saveTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl + '/save', task);
  }
}

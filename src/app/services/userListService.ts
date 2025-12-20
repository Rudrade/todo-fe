import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private httpClient = inject(HttpClient);

  private lists = signal<string[]>([]);
  userLists = this.lists.asReadonly();

  fetchUserLists() {
    return this.httpClient.get<string[]>(environment.apiUrl + 'task/lists');
  }

  updateUserList(lst: string[]) {
    this.lists.set(lst);
  }
}

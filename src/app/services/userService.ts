import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserList } from '../models/userList';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private readonly httpClient = inject(HttpClient);

  private readonly lists = signal<UserList[]>([]);
  userLists = this.lists.asReadonly();

  constructor() {
    this.fetchUserLists();
  }

  fetchUserLists() {
    this.httpClient
      .get<UserListResponse>(environment.apiUrl + 'task/lists')
      .pipe(take(1))
      .subscribe({
        next: (resp) => this.lists.set(resp.lists),
        complete: () => console.log('List fetched: ', this.lists()),
      });
  }

  getListByName(name: string) {
    return this.userLists().find((lst) => lst.name === name);
  }

  listColor(color: string) {
    if (!color || color === '') {
      color = '#000';
    }
    return `background-color: ${color}; border-color: ${color};`;
  }

  listColorByName(listName: string) {
    const list = this.getListByName(listName);
    return this.listColor(list?.color || '');
  }
}

interface UserListResponse {
  lists: UserList[];
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUsersUrl = environment.apiUrl + 'users';

  listUsers(options: {
    onlyActive: boolean;
    filterField: 'USERNAME' | 'EMAIL';
    filterValue: string;
  }) {
    let params = new HttpParams().set('active', options.onlyActive);
    if (options.filterValue?.trim()) {
      params = params
        .set('searchType', options.filterField)
        .set('searchTerm', options.filterValue.trim());
    }

    return this.httpClient.get<UsersResonse>(this.baseUsersUrl, { params });
  }

  registerUser(
    username: string,
    email: string,
    password: string,
    role: 'ROLE_ADMIN' | 'ROLE_USER'
  ) {
    return this.httpClient.post(this.baseUsersUrl + '/register', {
      username,
      email,
      password,
      role,
    });
  }

  getUser(id: string) {
    return this.httpClient.get<User>(`${this.baseUsersUrl}/${id}`);
  }

  updateUser(user: Partial<User> & { id: string }) {
    return this.httpClient.patch<User>(`${this.baseUsersUrl}/${user.id}`, user);
  }

  changeUserStatus(id: string, active: boolean) {
    return this.httpClient.patch(`${this.baseUsersUrl}/${id}`, {
      active,
    });
  }
}

interface UsersResonse {
  users: User[];
}

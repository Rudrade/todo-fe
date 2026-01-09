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

  updateUser(user: FormData, id: string) {
    return this.httpClient.patch<UpdateUser>(`${this.baseUsersUrl}/${id}`, user);
  }

  changeUserStatus(id: string, active: boolean) {
    const payload = new FormData();
    payload.append('active', `${active}`);

    return this.httpClient.patch(`${this.baseUsersUrl}/${id}`, payload);
  }

  activateUser(id: string) {
    return this.httpClient.post(`${this.baseUsersUrl}/activate/${id}`, {});
  }

  fetchRequests(filterField: 'USERNAME' | 'EMAIL', filterValue: string) {
    let params;
    if (filterValue) {
      params = new HttpParams().set('filterType', filterField).set('filterValue', filterValue);
    }

    return this.httpClient.get<{ requests: User[] }>(`${this.baseUsersUrl}/requests`, { params });
  }

  sendMail(id: string) {
    return this.httpClient.patch(`${this.baseUsersUrl}/requests/mail/${id}`, {});
  }

  deleteUserRequest(id: string) {
    return this.httpClient.delete(`${this.baseUsersUrl}/requests/${id}`);
  }

  resetPassword(body: Partial<{ username: string; email: string }>) {
    return this.httpClient.post(`${this.baseUsersUrl}/reset-password`, body);
  }

  setNewPassword(password: string, id: string) {
    return this.httpClient.patch(`${this.baseUsersUrl}/reset-password/${id}`, {
      password,
    });
  }
}

interface UsersResonse {
  users: User[];
}

interface UpdateUser {
  id: string;
  username: string;
  password: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  active: boolean;
  oldPassword: string;
  imageUrl: string;
}

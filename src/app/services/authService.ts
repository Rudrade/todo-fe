import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  getAuthToken(username: string): Observable<string> {
    const href = 'http://localhost:8080/todo/auth/login'; // TODO: Import config file with profiles

    return this.httpClient
      .post<AuthResponse>(href, {
        username: username,
      })
      .pipe(map((res) => res.token));
  }
}

interface AuthResponse {
  token: string;
  expiresIn: number;
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private href = environment.apiAuthUrl;

  getAuthToken(username: string): Observable<string> {
    return this.httpClient
      .post<AuthResponse>(this.href, {
        username: username,
      })
      .pipe(map((res) => res.token));
  }
}

interface AuthResponse {
  token: string;
  expiresIn: number;
}

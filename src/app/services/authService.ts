import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from './alertService';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly href = environment.apiAuthUrl;
  private readonly keyStorage = 'sessionData';

  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  getAuthToken() {
    // Get cookie
    let authToken = sessionStorage.getItem(this.keyStorage);
    if (!authToken) {
      this.logout();
      return;
    }

    // Verify if cookie is valid
    if (!this.isTokenValid(authToken)) {
      this.httpClient
        .get<AuthResponse>(this.href + 'refresh', {
          headers: {
            Authorization: 'Bearer ' + authToken,
          },
        })
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            authToken = res.token;
            this.setToken(res.token);
          },
          error: () => {
            this.logout();
          },
        });
    }

    // If cookie is valid, return token
    return authToken;
  }

  isUserAuthenticated(): boolean {
    // Get token
    const authToken = sessionStorage.getItem(this.keyStorage);

    // Token is valid
    return !!authToken && this.isTokenValid(authToken);
  }

  isAdminUser(): boolean {
    return this.getUserRoles() === 'ROLE_ADMIN';
  }

  private getUserRoles(): string {
    const authToken = sessionStorage.getItem(this.keyStorage);
    if (!authToken) return '';

    try {
      const decodedToken = jwtDecode(authToken) as { role: string };
      return decodedToken.role;
    } catch (error) {
      console.warn('Unable to decode token for roles', error);
    }

    return '';
  }

  private isTokenValid(authToken: string) {
    const decodedToken = jwtDecode(authToken);
    if (!decodedToken || !decodedToken.exp) return false;

    const now = new Date().getTime();
    const exp = decodedToken.exp * 1000 - 60000; // exp date - 60s
    const valid = exp > now;
    return valid;
  }

  logout() {
    this.alertService.clearAllAlerts();
    sessionStorage.removeItem(this.keyStorage);
    this.router.navigate(['/login']);
  }

  fetchAuthToken(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(this.href + 'login', {
      username,
      password,
    });
  }

  setToken(authToken: string) {
    sessionStorage.setItem(this.keyStorage, authToken);
  }
}

interface AuthResponse {
  token: string;
}

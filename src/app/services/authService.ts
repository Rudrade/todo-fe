import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from './alertService';

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
    const authToken = sessionStorage.getItem(this.keyStorage);
    if (!authToken) {
      // Redirect to login page
      this.logout();
      return;
    }

    // Verify if cookie is valid
    if (!this.isTokenValid(authToken)) {
      this.logout(); // TODO: Refresh token in backend
      return;
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

  private isTokenValid(authToken: string) {
    const decodedToken = jwtDecode(authToken);
    if (!decodedToken || !decodedToken.exp) return false;

    const now = new Date().getTime();
    const exp = decodedToken.exp * 1000;
    const valid = exp > now;
    return valid;
  }

  logout() {
    this.alertService.clearAllAlerts();
    sessionStorage.removeItem(this.keyStorage);
    this.router.navigate(['/login']);
  }

  fetchAuthToken(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(this.href, {
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

import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authService';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const isUserAuthenticated = authService.isUserAuthenticated();
  console.log('[AuthGuard]', isUserAuthenticated);
  if (!isUserAuthenticated) {
    authService.logout();
  }

  return isUserAuthenticated;
};

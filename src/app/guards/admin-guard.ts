import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated() && authService.isAdminUser()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};


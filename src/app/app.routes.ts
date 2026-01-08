import { Routes } from '@angular/router';
import { TaskListComponent } from './components/taskList/taskList';
import { CalendarComponent } from './components/calendar/calendar';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { UsersComponent } from './components/users/users';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { WrapperComponent } from './components/wrapper/wrapper';
import { ActivationPage } from './landing-pages/activation-page/activation-page';
import { SettingsComponent } from './components/settings/settings';
import { ConfirmGuard } from './guards/confirm-guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password';
import { PasswordResetPage } from './landing-pages/password-reset-page/password-reset-page';

export const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      {
        path: 'tasks',
        component: TaskListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
        canDeactivate: [ConfirmGuard],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
  },
  {
    path: 'resetPassword/:id',
    component: PasswordResetPage,
  },
  {
    path: 'mailActivation/:id',
    component: ActivationPage,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

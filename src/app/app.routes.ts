import { Routes } from '@angular/router';
import { TaskListComponent } from './components/taskList/taskList';
import { CalendarComponent } from './components/calendar/calendar';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { WrapperComponent } from './components/wrapper/wrapper';

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
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

import { Routes } from '@angular/router';
import { TaskListComponent } from './components/taskList/taskList';
import { CalendarComponent } from './components/calendar/calendar';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TaskListComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
];

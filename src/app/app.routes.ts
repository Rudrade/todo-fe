import { Routes } from '@angular/router';
import { TaskListComponent } from './components/taskList/taskList';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TaskListComponent,
  },
];

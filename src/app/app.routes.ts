import { Routes } from '@angular/router';
import { TaskList } from './components/taskList/taskList';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TaskList,
  },
];

import { Routes } from '@angular/router';
import { TaskList } from './components/taskList/taskList';
import { TaskComponent } from './components/task/task';

export const routes: Routes = [
  {
    path: 'tasks',
    component: TaskList,
    children: [
      {
        path: 'new',
        component: TaskComponent,
        pathMatch: 'full',
      },
    ],
  },
];

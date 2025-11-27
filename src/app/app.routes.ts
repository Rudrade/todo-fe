import { Routes } from '@angular/router';
import { TaskList } from './components/taskList/taskList';
import { TaskComponent } from './components/task/task';
import { App } from './app.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks-container',
  template: '',
  standalone: true,
})
export class TasksContainerComponent {}

export const routes: Routes = [
  {
    path: 'tasks',
    component: TasksContainerComponent,
    children: [
      {
        path: '',
        component: TaskList,
        outlet: 'task-list',
      },
      {
        path: 'detail/:id',
        component: TaskComponent,
        outlet: 'task-detail',
      },
    ],
  },
];

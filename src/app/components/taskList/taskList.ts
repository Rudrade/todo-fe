import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/taskService';

@Component({
  selector: 'app-task-list',
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
})
export class TaskList {
  private taskService = inject(TaskService);
}

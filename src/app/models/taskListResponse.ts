import { Task } from './task';

export interface TaskListResponse {
  count: Number;
  tasks: Task[];
}

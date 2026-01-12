import { Task } from './task';

export interface TaskListResponse {
  count: number;
  tasks: Task[];
}

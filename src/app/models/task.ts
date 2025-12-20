export interface Task {
  id: string;
  title: string;
  description: string | undefined | null;
  dueDate: Date | undefined | null;
  completed: boolean;
  listName: string | undefined | null;
}

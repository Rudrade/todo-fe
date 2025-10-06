import { Component } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { Task } from "../../models/task";

@Component({
    selector: 'task-list',
    templateUrl: './taskList.html',
    styleUrls: ['./taskList.css'],
    imports: [MatTableModule]
})
export class TaskList {
    columnsToDisplay: string[] = ['title', 'description', 'dueDate'];
    taskArray: Task[] = [
        {
            id: '0999',
            title: 'teste',
            description: 'Descricao',
            dueDate: new Date(),
            completed: false
        }
    ];
}
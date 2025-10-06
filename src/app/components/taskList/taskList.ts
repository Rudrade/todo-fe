import { Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { Task } from "../../models/task";
import { TaskService } from "../../services/taskService";
import { catchError, map, of, pipe, startWith, switchMap, merge } from "rxjs";

@Component({
    selector: 'task-list',
    templateUrl: './taskList.html',
    styleUrls: ['./taskList.css'],
    imports: [MatTableModule]
})
export class TaskList {
    constructor(private taskService: TaskService) {}

    columnsToDisplay: string[] = ['title', 'description', 'dueDate'];
    data: Task[] = [];
    isLoadingResults = true;

    ngAfterViewInit() {
        merge().
            pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.taskService!.getTasks()
                        .pipe(catchError(() => of(null)));
                }),
                map(data => {
                    this.isLoadingResults = false;
                    
                    if (data === null) {
                        return [];
                    }

                    return data;
                }),
            )
            .subscribe(data => (this.data = data));
    }

}
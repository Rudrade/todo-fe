import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Task } from "../models/task";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(private httpClient: HttpClient) {}

    getTasks() : Observable<Task[]> {
        const href = 'http://localhost:8080/todo/api/all'; // TODO: Import config file with profiles

        return this.httpClient.get<Task[]>(href);
    }

}
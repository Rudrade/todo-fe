import { Component, inject, signal } from '@angular/core';
import { TaskList } from './components/taskList/taskList';
import { AuthService } from './services/authService';

@Component({
  selector: 'app-root',
  imports: [TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('todo-fe');

  authService = inject(AuthService);

  ngAfterViewInit() {
    this.authService.getAuthToken('rui')
      .subscribe(authToken => {
        sessionStorage.setItem('sessionData', authToken);
      });
  }
}

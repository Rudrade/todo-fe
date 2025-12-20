import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from './services/authService';
import { Menu } from './components/menu/menu';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './shared/alert/alert';
import { AlertService } from './services/alert.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Menu, RouterOutlet, AlertComponent],
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  alerts = this.alertService.allAlerts;

  ngOnInit() {
    this.authService
      .getAuthToken('rui')
      .pipe(take(1))
      .subscribe({
        next: (authToken) => sessionStorage.setItem('sessionData', authToken),
        error: (error) => {
          this.alertService.addAlert('error', error.message);
        },
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AlertService } from '../../services/alertService';
import { AlertComponent } from '../../shared/alert/alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  alerts = this.alertService.allAlerts;

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const password = this.form.get('password')?.value;
      if (username && password) {
        this.authService
          .fetchAuthToken(username, password)
          .pipe(take(1))
          .subscribe({
            next: (resp) => {
              this.authService.setToken(resp.token);
              this.router.navigate(['/']);
            },
            error: (error) => this.alertService.addAlert('error', error.message),
          });
      }
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert';
import { AlertService } from '../../services/alertService';
import { AuthService } from '../../services/authService';
import { UserService } from '../../services/userService';

type RegisterForm = FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}>;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  alerts = this.alertService.allAlerts;
  error = signal<string | null>(null);

  form: RegisterForm = this.fb.group(
    {
      username: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      email: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
      confirmPassword: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [this.passwordsMatchValidator()] }
  );

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('[Register] Form valid');
    console.log('[Form] ', this.form);

    const { username, email, password } = this.form.getRawValue();
    this.userService
      .registerUser(username, email, password, 'ROLE_USER')
      .pipe(take(1))
      .subscribe({
        next: (nxt) => {
          console.log('[Next]', nxt);
          this.alertService.addAlert(
            'success',
            'Register completed. Please check your email for confirmation.'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error.set(err.error.message);
        },
      });
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }
}

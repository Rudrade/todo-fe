import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/userService';
import { take } from 'rxjs';
import { AuthService } from '../../services/authService';
import { AlertService } from '../../services/alertService';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  imports: [ReactiveFormsModule],
})
export class SettingsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.group(
    {
      username: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      oldPassword: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: this.formBuilder.control('', {
        nonNullable: true,
      }),
      confirmNewPassword: this.formBuilder.control('', {
        nonNullable: true,
      }),
    },
    { validators: [this.newPasswordsMatchValidator()] }
  );

  private data: User | undefined = undefined;
  get hasPendingChanges() {
    return (
      (this.form.controls.username.touched &&
        this.data?.username !== this.form.controls.username.value) ||
      (this.form.controls.email.touched && this.data?.email !== this.form.controls.email.value) ||
      (this.form.controls.password.touched && this.form.controls.password.value !== '')
    );
  }

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) {
      this.alertService.addAlert('error', 'Error getting data.');
      return;
    }

    this.userService
      .getUser(id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.data = res;
          this.form.patchValue({
            username: res.username,
            email: res.email,
          });
        },
        error: (err) => this.alertService.addErrorAlert(err),
      });
  }

  private newPasswordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('password')?.value;
      const confirmPassword = control.get('confirmNewPassword')?.value;
      if (newPassword && newPassword !== confirmPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (!this.form.valid) return;

    const payload = {
      id: this.data!.id,
      ...this.form.getRawValue(),
    };

    this.userService
      .updateUser(payload)
      .pipe(take(1))
      .subscribe({
        next: () => this.alertService.addAlert('success', 'Changes succefully'),
        error: (err) => this.alertService.addErrorAlert(err),
      });
  }
}

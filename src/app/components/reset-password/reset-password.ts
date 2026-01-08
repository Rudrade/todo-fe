import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/userService';
import { take } from 'rxjs';
import { translateErrorMessage } from '../../shared/util/appUtil';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  form = this.formBuilder.group(
    {
      username: this.formBuilder.control('', { nonNullable: true }),
      email: this.formBuilder.control('', { nonNullable: true, validators: [Validators.email] }),
    },
    { validators: [this.oneFilledValidator()] }
  );

  submitting = signal<boolean>(false);
  message = signal<string | undefined>(undefined);
  private readonly isError = signal<boolean>(false);

  private oneFilledValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.get('username')?.value;
      const email = control.get('email')?.value;
      if (username || email) {
        return null;
      }
      return { oneFilled: true };
    };
  }

  get messageClass() {
    return `text-${this.isError() ? 'danger' : 'success'}`;
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.message.set(undefined);

    const body = this.form.getRawValue();
    this.userService
      .resetPassword(body)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isError.set(false);
          this.message.set("Please check the account's email for a reset link.");
          this.submitting.set(false);
        },
        error: (err) => {
          this.isError.set(true);
          this.message.set(translateErrorMessage(err));
          this.submitting.set(false);
        },
      });
  }
}

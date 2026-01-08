import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/userService';
import { take } from 'rxjs';
import { translateErrorMessage } from '../../shared/util/appUtil';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './password-reset-page.html',
  styleUrl: './password-reset-page.css',
})
export class PasswordResetPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  form = this.formBuilder.group(
    {
      newPassword: this.formBuilder.control('', { validators: [Validators.required] }),
      newPasswordConfirm: this.formBuilder.control('', { validators: [Validators.required] }),
    },
    { validators: [this.newPasswordsMatchValidator()] }
  );

  submitting = signal<boolean>(false);
  errorMessage = signal<string | undefined>(undefined);
  success = signal<boolean>(false);

  private newPasswordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('newPasswordConfirm')?.value;
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsDirty();
      return;
    }

    const password = this.form.controls.newPassword.value;
    const id = this.route.snapshot.paramMap.get('id');

    if (!password || !id) {
      return;
    }

    this.submitting.set(true);

    this.userService
      .setNewPassword(password, id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
          this.success.set(false);
          this.errorMessage.set(translateErrorMessage(err));
        },
      });
  }
}

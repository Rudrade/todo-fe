import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alertService';
import { UserService } from '../../services/userService';
import { User } from '../../models/user';
import { take } from 'rxjs';
import { translateErrorMessage } from '../../shared/util/appUtil';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css'],
})
export class UserDetailComponent {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  data = input<User | undefined>();
  close = output<void>();
  refreshUsers = output<void>();

  submitting = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    role: new FormControl<'ROLE_USER' | 'ROLE_ADMIN'>('ROLE_USER', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const user = this.data();
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
        });
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.form.invalid || !this.data()?.id) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const payload = {
      id: this.data()!.id,
      ...this.form.getRawValue(),
    };
    this.userService
      .updateUser(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.addAlert('success', 'User updated');
          this.refreshUsers.emit();
        },
        error: (error) => {
          this.alertService.addAlert('error', translateErrorMessage(error));
          this.submitting.set(false);
        },
        complete: () => {
          this.submitting.set(false);
        },
      });
  }

  onChangeStatus(status: boolean) {
    const id = this.data()?.id;
    if (!id) return;

    this.submitting.set(true);
    this.userService
      .changeUserStatus(id, status)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.addAlert('success', `User ${status ? 'activated' : 'deactivated'}`);
          this.refreshUsers.emit();
          this.close.emit();
        },
        error: (error) => this.alertService.addAlert('error', translateErrorMessage(error)),
        complete: () => {
          this.submitting.set(false);
        },
      });
  }
}

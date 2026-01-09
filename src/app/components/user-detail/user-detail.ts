import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alertService';
import { UserService } from '../../services/userService';
import { User } from '../../models/user';
import { take } from 'rxjs';
import { translateErrorMessage } from '../../shared/util/appUtil';
import { AuthService } from '../../services/authService';

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
  private readonly authService = inject(AuthService);

  data = input<User | undefined>();
  close = output<void>();
  refreshUsers = output<void>();

  submitting = signal<boolean>(false);
  sendingMail = signal<boolean>(false);
  mailSent = signal<boolean>(this.data()?.mailSent ?? false);

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

  image = signal<string>('');
  selectedImage: File | undefined = undefined;

  onSelectImage(event: any) {
    this.selectedImage = event.target.files[0];
  }

  constructor() {
    effect(() => {
      const user = this.data();
      if (user) {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
        });
        this.mailSent.set(!!user.mailSent);

        // Toggle read-only mode for requests
        if (user.isRequest) {
          this.form.disable({ emitEvent: false });
        } else {
          this.form.enable({ emitEvent: false });
        }

        if (user.imageUrl) this.image.set(user.imageUrl);
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

    if (this.selectedImage) {
      if (!this.selectedImage.name.endsWith('.webp')) {
        this.alertService.addAlert('error', 'Image must be a .webp');
        return;
      }

      if (this.selectedImage.size > 1572864) {
        this.alertService.addAlert('error', 'Image must be a maxiumn size of 1.5MB');
        return;
      }
    }

    this.submitting.set(true);

    const rawData = this.form.getRawValue();

    const payload = new FormData();
    payload.append('username', rawData.username);
    payload.append('email', rawData.email);
    payload.append('role', rawData.role);
    if (this.selectedImage) {
      payload.append('image', this.selectedImage);
    }

    const id = this.data()!.id;

    this.userService
      .updateUser(payload, id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.image.set(res.imageUrl);
          if (this.authService.getUserId() === id) {
            this.authService.setImageUrl(res.imageUrl);
          }

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
          this.submitting.set(false);
          this.alertService.addAlert('success', `User ${status ? 'activated' : 'deactivated'}`);
          this.refreshUsers.emit();
          this.close.emit();
        },
        error: (error) => {
          this.submitting.set(false);
          this.alertService.addErrorAlert(error);
        },
      });
  }

  onSendMail() {
    const id = this.data()?.id;
    if (!id) return;

    this.sendingMail.set(true);

    this.userService
      .sendMail(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.mailSent.set(true);
          this.refreshUsers.emit();
          this.alertService.addAlert('success', 'Mail sent successfully');
          this.sendingMail.set(false);
        },
        error: (res) => {
          this.alertService.addAlert('error', translateErrorMessage(res));
          this.sendingMail.set(true);
        },
      });
  }

  onDeleteRequest() {
    const id = this.data()?.id;
    if (!id) return;

    if (!confirm('Are you sure you want to delete this request?')) {
      return;
    }

    this.userService
      .deleteUserRequest(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.alertService.addAlert('success', 'User request deleted.');
          this.onClose();
          this.refreshUsers.emit();
        },
        error: (res) => {
          this.alertService.addErrorAlert(res);
        },
      });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  imports: [ReactiveFormsModule, TranslatePipe],
})
export class SettingsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  submitting = signal<boolean>(false);

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
      language: this.formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [this.newPasswordsMatchValidator()] }
  );

  data: User | undefined = undefined;
  get hasPendingChanges() {
    return (
      (this.form.controls.username.touched &&
        this.data?.username !== this.form.controls.username.value) ||
      (this.form.controls.email.touched && this.data?.email !== this.form.controls.email.value) ||
      (this.form.controls.password.touched && this.form.controls.password.value !== '') ||
      (this.form.controls.language.touched && this.form.controls.language.value)
    );
  }

  selectedImage: File | undefined = undefined;

  onSelectImage(event: any) {
    this.selectedImage = event.target.files[0];
  }

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (!id) {
      this.alertService.addAlert('error', this.translate.instant('settings.error-loading'));
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
            language: res.language,
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

    this.submitting.set(true);

    this.userService
      .updateUser(this.constructPayload(), this.data?.id || '')
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.authService.setImageUrl(res.imageUrl);
          if (this.data) this.data.imageUrl = res.imageUrl;
          this.alertService.addAlert('success', this.translate.instant('settings.success'));
          if (res.language) this.translate.use(res.language);
          this.submitting.set(false);
        },
        error: (err) => {
          this.alertService.addErrorAlert(err);
          this.submitting.set(false);
        },
      });
  }

  constructPayload() {
    const rawData = this.form.getRawValue();

    const data = new FormData();
    data.append('username', rawData.username);
    data.append('email', rawData.email);
    data.append('oldPassword', rawData.oldPassword);
    data.append('password', rawData.password);
    data.append('language', rawData.language);
    if (this.selectedImage) {
      data.append('image', this.selectedImage);
    }

    return data;
  }
}

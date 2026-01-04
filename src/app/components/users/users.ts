import { CommonModule, formatDate as fDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { UserService } from '../../services/userService';
import { User } from '../../models/user';
import { UserDetailComponent } from '../user-detail/user-detail';
import { AlertService } from '../../services/alertService';
import { translateErrorMessage } from '../../shared/util/appUtil';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserDetailComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);

  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  selectedUser = signal<User | undefined>(undefined);
  view = signal<'user' | 'request'>('user');

  filterForm = new FormGroup({
    onlyActive: new FormControl<boolean>(false, { nonNullable: true }),
    filterField: new FormControl<'USERNAME' | 'EMAIL'>('USERNAME', { nonNullable: true }),
    filterValue: new FormControl<string>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.filterForm.controls.onlyActive.setValue(true);
    this.loadData();
  }

  onOpenUser(user: User) {
    this.selectedUser.set(user);
  }

  onCloseUser() {
    this.selectedUser.set(undefined);
  }

  onRefreshUsers() {
    this.loadData();
  }

  onToggleActive() {
    const checked = this.filterForm.controls.onlyActive.value;
    this.filterForm.controls.onlyActive.setValue(!checked);
    this.loadData();
  }

  onSubmit() {
    this.loadData();
  }

  clearSearch() {
    this.filterForm.controls.filterValue.setValue('');
    this.loadData();
  }

  private loadData() {
    if (this.view() === 'request') {
      this.loadUserRequests();
    } else {
      this.loadUsers();
    }
  }

  private loadUsers() {
    this.loading.set(true);
    const { onlyActive, filterField, filterValue } = this.filterForm.getRawValue();
    this.userService
      .listUsers({
        onlyActive,
        filterField,
        filterValue,
      })
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          this.users.set(resp.users);
        },
        error: (res) => {
          this.alertService.addAlert('error', translateErrorMessage(res));
          this.users.set([]);
        },
        complete: () => this.loading.set(false),
      });
  }

  private loadUserRequests() {
    this.loading.set(true);
    this.userService
      .fetchRequests()
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          resp.requests.map((user) => (user.isRequest = true));
          this.users.set(resp.requests);
        },
        error: (res) => this.alertService.addAlert('error', translateErrorMessage(res)),
        complete: () => this.loading.set(false),
      });
  }

  onChangeView(view: 'user' | 'request') {
    this.view.set(view);
    this.loadData();
  }

  formatDate(value: Date | undefined) {
    if (!value) return '';
    return fDate(value, 'dd/MM/yyyy', 'en-US');
  }
}

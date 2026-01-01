import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { UserService } from '../../services/userService';
import { User } from '../../models/user';
import { UserDetailComponent } from '../user-detail/user-detail';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserDetailComponent],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  selectedUser = signal<User | undefined>(undefined);

  filterForm = new FormGroup({
    onlyActive: new FormControl<boolean>(false, { nonNullable: true }),
    filterField: new FormControl<'USERNAME' | 'EMAIL'>('USERNAME', { nonNullable: true }),
    filterValue: new FormControl<string>('', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.filterForm.controls.onlyActive.setValue(true);
    this.loadUsers();
  }

  onOpenUser(user: User) {
    this.selectedUser.set(user);
  }

  onCloseUser() {
    this.selectedUser.set(undefined);
  }

  onRefreshUsers() {
    this.loadUsers();
  }

  onToggleActive() {
    const checked = this.filterForm.controls.onlyActive.value;
    this.filterForm.controls.onlyActive.setValue(!checked);
    this.loadUsers();
  }

  onSubmit() {
    this.loadUsers();
  }

  clearSearch() {
    this.filterForm.controls.filterValue.setValue('');
    this.loadUsers();
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
        error: () => this.users.set([]),
        complete: () => this.loading.set(false),
      });
  }
}

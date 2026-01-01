import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '../../services/userService';

@Component({
  selector: 'app-activation-page',
  templateUrl: './activation-page.html',
  styleUrl: './activation-page.css',
  imports: [RouterLink],
})
export class ActivationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  loading = signal<boolean>(true);
  success = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.success.set(false);
      this.loading.set(false);
      return;
    }

    this.userService
      .activateUser(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.success.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.success.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}

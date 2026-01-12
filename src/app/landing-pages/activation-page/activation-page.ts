import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { UserService } from '../../services/userService';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activation-page',
  templateUrl: './activation-page.html',
  styleUrl: './activation-page.css',
  imports: [RouterLink, TranslatePipe],
})
export class ActivationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly translate = inject(TranslateService);

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
        next: (res) => {
          if (res.language) {
            this.translate.use(res.language);
          }
          this.success.set(true);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.success.set(false);
        },
      });
  }
}

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class Menu {
  private router = inject(Router);

  onSearchTasks(searchTerm: string) {
    console.log('[SearchTerm] ', searchTerm);

    if (searchTerm === '') {
      this.router.navigate(['tasks']);
    } else {
      this.router.navigate(['tasks'], {
        queryParams: {
          filter: 'search',
          searchTerm,
        },
      });
    }
  }
}

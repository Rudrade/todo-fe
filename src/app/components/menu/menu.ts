import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserListService } from '../../services/userListService';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  imports: [RouterLink, RouterLinkActive],
})
export class Menu {
  private router = inject(Router);
  private userListService = inject(UserListService);

  userLists = this.userListService.userLists;

  onSearchTasks(searchTerm: string, type: string) {
    console.log('[SearchTerm] ', searchTerm);

    if (searchTerm === '') {
      this.router.navigate(['tasks']);
    } else if (type === 'list') {
      this.router.navigate(['tasks'], {
        queryParams: {
          filter: 'list',
          searchTerm,
        },
      });
    } else {
      this.router.navigate(['tasks'], {
        queryParams: {
          filter: 'search',
          searchTerm,
        },
      });
    }
  }

  listColor(color: string) {
    return this.userListService.listColor(color);
  }

  onLogout() {
    sessionStorage.clear(); // TODO: Impl this correctly
  }
}

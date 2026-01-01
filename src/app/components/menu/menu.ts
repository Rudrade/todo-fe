import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserListService } from '../../services/userListService';
import { TagsService } from '../../services/tagsService';
import { TagComponent } from '../tag/tag';
import { AuthService } from '../../services/authService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  imports: [RouterLink, RouterLinkActive, TagComponent],
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly userListService = inject(UserListService);
  private readonly tagsService = inject(TagsService);
  private readonly authService = inject(AuthService);
  private routerSub?: Subscription;

  userLists = this.userListService.userLists;
  userTags = this.tagsService.userTags;
  hideSearch = false;
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminUser();
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideSearch = event.urlAfterRedirects.includes('/users');
      }
    });
    // ensure initial state
    this.hideSearch = this.router.url.includes('/users');
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

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
    } else if (type === 'tag') {
      this.router.navigate(['tasks'], {
        queryParams: {
          filter: 'tag',
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
    this.authService.logout();
  }
}

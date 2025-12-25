import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserListService } from '../../services/userService';
import { TagsService } from '../../services/tagsService';
import { TagComponent } from '../tag/tag';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'],
  imports: [RouterLink, RouterLinkActive, TagComponent],
})
export class MenuComponent {
  private router = inject(Router);
  private userListService = inject(UserListService);
  private tagsService = inject(TagsService);

  userLists = this.userListService.userLists;
  userTags = this.tagsService.userTags;

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
    sessionStorage.clear(); // TODO: Impl this correctly
  }
}

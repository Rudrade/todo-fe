import { inject, Injectable, signal } from '@angular/core';
import { Tag } from '../models/tag';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private tags = signal<Tag[]>([]);
  userTags = this.tags.asReadonly();

  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'tag';

  constructor() {
    this.fetchTags();
  }

  fetchTags() {
    this.httpClient
      .get<TagListResponse>(this.baseUrl)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.tags.set(response.tags);
        },
      });
  }
}

interface TagListResponse {
  tags: Tag[];
}

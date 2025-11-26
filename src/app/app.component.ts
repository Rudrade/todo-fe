import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from './services/authService';
import { Menu } from './components/menu/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Menu],
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.authService.getAuthToken('rui').subscribe((authToken) => {
      sessionStorage.setItem('sessionData', authToken);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

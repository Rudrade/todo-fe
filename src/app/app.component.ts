import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from './services/authService';
import { Menu } from './components/menu/menu';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Menu, RouterOutlet],
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

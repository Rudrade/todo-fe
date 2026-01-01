import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Register doesnt require token
    if (req.url.includes('/register')) return next.handle(req);

    const authToken = this.authService.getAuthToken();

    if (authToken) {
      req = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + authToken),
      });
    }

    return next.handle(req);
  }
}

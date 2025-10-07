import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = sessionStorage.getItem('sessionData');

        if (authToken) {
            req = req.clone({
                headers: req.headers.append('Authorization', 'Bearer ' + authToken)
            });
        }

        return next.handle(req);
    }

}
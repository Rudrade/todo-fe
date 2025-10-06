import { HttpClient, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.getAuthToken();

        req.headers.append('Authorization', 'Bearer '+token);

        return next.handle(req);
    }

    getAuthToken() : string {

        

        return '';
    }

}
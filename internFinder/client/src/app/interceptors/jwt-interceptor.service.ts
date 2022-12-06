import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {
  private apiServerURL = 'https://6507-2c0f-fe38-232b-656f-33e8-dd8c-418-a189.ap.ngrok.io';

  constructor(
    private tokenService: TokenService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ((request.url.startsWith(this.apiServerURL)||request.url.startsWith(this.apiServerURL)) && this.tokenService.getToken() !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenService.getToken()}`
        }
      });
    }
    return next.handle(request);
  }
}

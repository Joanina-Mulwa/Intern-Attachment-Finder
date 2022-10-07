import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {
  private apiServerURL = 'http://localhost:8080';

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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  USER_KEY = "user";
  private userProfile!: Observable<any>;
  private accountCache$?: Observable<any | null>;

  constructor(
    private http: HttpClient
  ) { }
  private apiServerURL = environment.API_ENDPOINT;


  authenticateGoogleUser(googleAuthDTO: any): Observable<any> {
    return this.http.post(this.apiServerURL + "/api/login/google", googleAuthDTO);
  }

  saveUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }



}

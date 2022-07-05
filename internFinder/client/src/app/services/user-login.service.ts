import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private apiServerURL = environment.API_ENDPOINT
  constructor(protected httpClient: HttpClient) { }
  
  loginUser(user: any):Observable<string>{
    console.log("user to be logged in is ",user);
    return this.httpClient.post<string>(this.apiServerURL + "/api/userLogin", user);
  }

  registerUser(user: any): Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/register", user);
  }

  resetPassword(user: any): Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/resetPassword", user);
  }

  findByEmail(email: any): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/findByEmail/" + email)
  }
}

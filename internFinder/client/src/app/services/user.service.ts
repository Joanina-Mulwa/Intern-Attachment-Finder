import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerURL = environment.API_ENDPOINT;
  USER_KEY = "user";
  constructor(protected httpClient: HttpClient) { }
  
  loginUser(user: any):Observable<any>{
    console.log("user to be logged in is ",user);
    return this.httpClient.post<any>(this.apiServerURL + "/api/login", user);
  }

  registerUser(user: any): Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/register", user);
  }

  resetPassword(user: any): Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/resetPassword", user);
  }

  saveUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  findByEmail(email: any): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/findByEmail/" + email)
  }

  setCategory(user: any): Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/setCategory", user)
  }

  findCategory(email: any): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/getCategory/" + email)
  }

  updateUser(user: any):Observable<any>{
    return this.httpClient.put<any>(this.apiServerURL + "/api/update", user)
  }

  // getCurrentUser():Observable<any>{
  //   return this.httpClient.get<any>(this.apiServerURL + "/api/user/profile")
  // }

  findAllUsers():Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/findAll")
  }

  searchUser(text?: string): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/user/search?text=" + text)
  }

}

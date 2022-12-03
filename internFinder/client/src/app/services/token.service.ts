import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  JWT_KEY = 'id_token';
  // tslint:disable-next-line: max-line-length


  public saveToken(email: string, token: string): void {
    //localStorage.setItem(this.JWT_KEY, token);
    // store username and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token }));
  }

  public saveUserToken(user: any): void {
    //localStorage.setItem(this.JWT_KEY, token);
    // store username and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify({ user: user }));
  }

  public clearToken(): void {
    localStorage.removeItem(this.JWT_KEY);
  }

  public getToken(): any {
    return localStorage.getItem(this.JWT_KEY) || sessionStorage.getItem(this.JWT_KEY);
  }

  public getUsername(): any {
    return localStorage.getItem('currentUser');
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostInternship } from '../entities/post-internships/post-internship-model';

@Injectable({
  providedIn: 'root'
})
export class PostInternshipService {

  private apiServerURL = environment.API_ENDPOINT
  constructor(protected httpClient: HttpClient) { }
  
  createInternship(internship: any):Observable<any>{
    return this.httpClient.post<any>(this.apiServerURL + "/api/createInternship" , internship);
  }
  updateInternship(internship: any):Observable<any>{
    return this.httpClient.put<any>(this.apiServerURL + "/api/updateInternship" , internship);
  }
  deleteInternship(id: number): Observable<any>{
    return this.httpClient.delete<any>( this.apiServerURL + "/api/deleteIntenship/" + id);
  }
  findAll(): Observable<PostInternship[]>{
    return this.httpClient.get<PostInternship[]>(this.apiServerURL+ "/api/findAllInternships");
  }

  searchInternship(text?: string): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL + "/api/internship/search?text=" + text)
  }

  findInternshipById(id: number): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL+ "/api/findInternshipById/" + id);
  }

}

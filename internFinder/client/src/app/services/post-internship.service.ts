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
  findAll(): Observable<PostInternship[]>{
    return this.httpClient.get<PostInternship[]>(this.apiServerURL+ "/api/findAllInternships");
  }

}

import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdvertDetails } from '../entities/post-internships/advert-details';
import { InternshipStatus, PostInternship } from '../entities/post-internships/post-internship-model';

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
    const req = this.httpClient.get<any>(this.apiServerURL + "/api/internship/search?text=" + text)
    console.log("Sending also", req)
    return req;
  }

  findInternshipById(id: number): Observable<any>{
    return this.httpClient.get<any>(this.apiServerURL+ "/api/findInternshipById/" + id);
  }

  upload(file: File, advertDetails: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('internshipTitle', advertDetails.internshipTitle);
    formData.append('companyName', advertDetails.companyName);
    formData.append('companyEmail',advertDetails.companyEmail);
    formData.append('domain', advertDetails.domain)
    formData.append('period', advertDetails.period);
    const req = new HttpRequest('POST', `${this.apiServerURL}/api/upload`,formData,{
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.apiServerURL}/api/files`);
  }

  // getUploadedFile(id = 1): Observable<any> {
  //   return this.httpClient.get(`${this.apiServerURL}/api/fileById/`+id);
  // }

}

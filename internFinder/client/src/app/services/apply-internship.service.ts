import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request, Response, NextFunction } from 'express';
@Injectable({
  providedIn: 'root'
})
export class ApplyInternshipService {

  constructor(
    protected httpClient: HttpClient,
  ) { }
  private API_ENDPOINT = environment.API_ENDPOINT;


  // applyInternship(application: any): Observable<any>{
  //   return this.httpClient.post<any> (this.API_ENDPOINT + "/api/applyInternship" , application)
  // }
  pasrseApplicationResume(file: File): Observable<any> {

    return this.httpClient.post<any>("https://api.superparser.com/parse", file)
  }

  // updateInternshipApplication(application: any): Observable<any>{
  //   return this.httpClient.put<any> (this.API_ENDPOINT + "/api/updateInternshipApplication", application)
  // }

  // findByAppliedBy(appliedBy: string): Observable<any>{
  //   return this.httpClient.get<any> (this.API_ENDPOINT + "/api/findByAppliedBy/" + appliedBy)
  // }

  // findApplicationById(id: number): Observable<any>{
  //   return this.httpClient.get<any>( this.API_ENDPOINT + "/api/findApplicationById/" + id)
  // }



  searchApplicant(text?: string): Observable<any> {
    return this.httpClient.get<any>(this.API_ENDPOINT + "/api/application/search?text=" + text)
  }

  createApplication(file: File, applicationDetails: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('internshipId', applicationDetails.internshipId);
    formData.append('appliedBy', applicationDetails.appliedBy);
    formData.append('appliedOn', applicationDetails.appliedOn);
    formData.append('postedBy', applicationDetails.postedBy);
    formData.append('postedByEmail', applicationDetails.postedByEmail);
    formData.append('parsedApplicationIdentifier', applicationDetails.parsedApplicationIdentifier)
    formData.append('parsedSkills', applicationDetails.parsedSkills)

    const req = new HttpRequest('POST', `${this.API_ENDPOINT}/api/createApplication`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }
  getApplications(): Observable<any> {
    return this.httpClient.get(`${this.API_ENDPOINT}/api/applications`);
  }
  getApplicationById(id: number): Observable<any> {
    return this.httpClient.get(`${this.API_ENDPOINT}/api/getApplicationById/` + id);
  }
  getApplicationsByAppliedBy(appliedBy: string): Observable<any> {
    return this.httpClient.get(`${this.API_ENDPOINT}/api/getApplicationsByAppliedBy/` + appliedBy);
  }
  getApplicationsWithPostedBy(postedBy: string): Observable<any> {
    return this.httpClient.get(`${this.API_ENDPOINT}/api/findApplicationsWith/` + postedBy);
  }
  getApplicationsByInternshipId(internshipId: number): Observable<any> {
    return this.httpClient.get<any>(this.API_ENDPOINT + "/api/getApplicationsByInternshipId/" + internshipId)
  }
  // downloadApplicationById(id: number): Observable<any> {
  //   return this.httpClient.get(`${this.apiServerURL}/api/downloadApplicationById`+id);
  // }


  updateApplication(applicationDetails: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', applicationDetails.id);
    formData.append('status', applicationDetails.status)
    const req = new HttpRequest('PUT', `${this.API_ENDPOINT}/api/updateApplication`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

}

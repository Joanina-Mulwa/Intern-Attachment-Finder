import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplyInternshipService {

  constructor(
    protected httpClient: HttpClient
  ) { } 
  private API_ENDPOINT = environment.API_ENDPOINT;

  applyInternship(application: any): Observable<any>{
    return this.httpClient.post<any> (this.API_ENDPOINT + "/api/applyInternship" , application)
  }

  findByAppliedBy(appliedBy: string): Observable<any>{
    return this.httpClient.get<any> (this.API_ENDPOINT + "/api/findByAppliedBy/" + appliedBy)
  }

  findApplicationById(id: number): Observable<any>{
    return this.httpClient.get<any>( this.API_ENDPOINT + "/api/findApplicationById/" + id)
  }

  findApplicationsByInternshipId(internshipId: number): Observable<any>{
    return this.httpClient.get<any>( this.API_ENDPOINT + "/api/findApplicationsByInternshipId/" + internshipId)
  }

  // searchApplicant(text?: string): Observable<any>{
  //   return this.httpClient.get<any>(this.API_ENDPOINT + "/api/applicant/search?text=" + text)
  // }
}

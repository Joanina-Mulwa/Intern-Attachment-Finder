import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { UserBio } from '../../users/user-bio-model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  constructor(
    protected applicationApplied: ApplyInternshipService,
    protected route: ActivatedRoute,
    protected userBio: UserService,
  ) { }
  userEmail!: string;
  applications?: ApplyInternship[];
  internshipId!: number;
  applicationForcurrentInternship?: ApplyInternship;
  userBioDetails!: UserBio;

  ngOnInit(): void {
 
    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      this.internshipId = params['id'];
      console.log("We want to view profile of applicant ", this.userEmail) 
      console.log("We want to view profile of internship of id ", this.internshipId) 
          
    });
    this.getApplication();
    this.getApplicantDetails();  
  }
  back(): void{
    window.history.back();
  }

  getApplication(): void{
    this.applicationApplied.findByAppliedBy(this.userEmail).subscribe(
      (res)=>{
        this.applications=res;
        console.log("applications", this.applications)
        this.applications?.forEach((application: any)=>{
          console.log("application here", +application.internshipId,"and current internship id is", +this.internshipId, " and the comparison is",+application.internshipId === +this.internshipId)
          if(+application.internshipId === +this.internshipId){
            this.applicationForcurrentInternship = application;
            console.log("here is the application", this.applicationForcurrentInternship)
            console.log("here is the application intro", this.applicationForcurrentInternship?.introduction)
          }
        })
        
      },
      (err)=>{
        console.log("error getting applications")
      }
    )

  }

  getApplicantDetails(): void{
    this.userBio.findByEmail(this.userEmail).subscribe(
      (res)=>{
        this.userBioDetails = res;
        console.log("Found ", this.userBioDetails)
        if (this.userBioDetails?.skills) {
          this.userBioDetails.skillsList = this.userBioDetails.skills.split(",");
        }
      },
      (err)=>{console.log("Error fetching user bio")}
    )
  }

}

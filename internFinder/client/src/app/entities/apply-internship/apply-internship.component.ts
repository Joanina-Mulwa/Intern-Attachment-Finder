import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { PostInternship } from '../post-internships/post-internship-model';
import { UserBio } from '../users/user-bio-model';
import { ApplyInternship } from './apply-internship-model';

@Component({
  selector: 'app-apply-internship',
  templateUrl: './apply-internship.component.html',
  styleUrls: ['./apply-internship.component.css']
})
export class ApplyInternshipComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected applyInternship : ApplyInternshipService,
    protected postInternshipService: PostInternshipService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) { }
  ifProfileComplete = true;
  currentEmail: any;
  profile!: UserBio;
  profileCompleteFailure = '';
  profileCompleteSuccess = false;
  showUpdateButton = false;
  resume!: File;
  
  internshipDetail?: PostInternship
  currentInternshipId!: number;
  application={
    id: undefined as any,

    internshipId: undefined as unknown  as number,

    appliedBy: '',

    appliedOn: '',

    postedBy: '',

    introduction: '',

    reason: '',

    strength: '',

    weakness: '',

    resume: '',
    


  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of intenrhsip of is  ", this.currentInternshipId)
    });
    this.checkIfProfileComplete();
     this.findPostedBy();
  }
  back(): void{
    window.history.back();
  }

  checkIfProfileComplete(): void {
    this.currentEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.currentEmail).subscribe(
      (res) => {
        console.log("current user deatils are", res);
        this.profile = res;
        console.log("check if profile can be null", res);
        if (this.profile.name === null || this.profile.institution === null || this.profile.programme === null || this.profile.course === null || this.profile.experienceLevel===null) {
          this.ifProfileComplete = false;
          this.profileCompleteFailure="Update Profile first to apply for an internship!"
          setTimeout(() => {
            this.profileCompleteFailure = '';
            this.ifProfileComplete = true;
          }, 3000);
          this.showUpdateButton=true;
        }
        else{
          this.profileCompleteSuccess=true;

        }

       
      },
      (err) => { console.log("Error fetching current user bio") }
    )

  }

  findPostedBy(): void{
  this.postInternshipService.findInternshipById(this.currentInternshipId).subscribe(
    (res)=>{
      console.log("internship details are", res)
      this.internshipDetail = res;
      console.log("Current internship was posted by this company email :", this.internshipDetail?.companyEmail);
    },
    (err)=>{
      console.log("Error fetching current internship details", err)
    }
  )
  }

  submitApplication(): void{
    this.application.internshipId=this.currentInternshipId;
    this.application!.appliedBy=this.currentEmail;
    let date = new Date().toJSON().slice(0, 10);
    this.application!.appliedOn = date;
    //this.application.postedBy=this.internshipDetail!.companyEmail;
    console.log("About to create application", this.application)
    
    this.applyInternship.applyInternship(this.application).subscribe(
      (res)=>{
        console.log("created appliccation",res)
        this.router.navigate(['/users/', this.currentEmail])
      },
      (err)=>{console.log(err)}
    )
    
  }


  

}

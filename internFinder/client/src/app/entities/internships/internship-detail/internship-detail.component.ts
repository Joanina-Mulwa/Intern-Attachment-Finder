import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { PostInternship } from '../../post-internships/post-internship-model';
import { Authority, UserBio } from '../../users/user-bio-model';

@Component({
  selector: 'app-internship-detail',
  templateUrl: './internship-detail.component.html',
  styleUrls: ['./internship-detail.component.scss']
})
export class InternshipDetailComponent implements OnInit {

  constructor(
    protected tokenService: TokenService,
    protected postInternshipService: PostInternshipService,
    protected route: ActivatedRoute,
    protected userService: UserService,
  ) { }
  category: Boolean = false;
  internshipDetail?: PostInternship;
  username!: string;
  internshipId!: number;
  loggedInUserEmail!: string;
  isPostedByMe: boolean = false;
  isEmployer: boolean = false;
  companyDetails?: UserBio;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      console.log("We want to view profile of intenrhsip of is  ", this.internshipId)
      this.checkIfPostedByMe(); 
    });
    // this.findAllinternships();
    this.getCurrentLoggedInUsername();
  }

  getCurrentLoggedInUsername(): any {
    console.log("Current logged in user token",this.tokenService.getToken());
    console.log("Current logged in username and token ",this.tokenService.getUsername());
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.loggedInUserEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.loggedInUserEmail).subscribe(
      (res)=>{
       // window.location.reload();
        console.log("User details is", res)
        if(res.authority === Authority.EMPLOYER){
          this.isEmployer=true;
        }
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )
  
 
 }



 checkIfPostedByMe(): void{

  this.postInternshipService.findInternshipById(this.internshipId).subscribe(
    (res)=>{
      console.log("internship details are", res)
      this.internshipDetail = res;
      console.log("internship details confirmation are", this.internshipDetail)   
      console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
      console.log("Current internship was posted by :", this.internshipDetail?.companyEmail);
      this.loggedInUserEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
      if(this.loggedInUserEmail === this.internshipDetail?.companyEmail){
        this.isPostedByMe=true;
      }
          this.getCompanyDetails();

    },
    (err)=>{
      console.log("Error fetching current internship details", err)
    }
  )

}

getCompanyDetails(): void{
  console.log("Company details that posted current inernship is ", this.internshipDetail?.companyEmail)
  this.userService.findByEmail(this.internshipDetail?.companyEmail).subscribe(
    (res)=>{
      console.log("Company details that posted current inernship is ", res)
      this.companyDetails = res;
      let date = new Date().toJSON().slice(0, 10);

      this.companyDetails!.createdOn = date;
      console.log("New creation dTE IS ", this.companyDetails!.createdOn)

      
      
      console.log("Company details that posted current inernship 2 is", this.companyDetails)   
    },
    (err)=>{
      console.log("Error fetching company that posted current internhsip", err)
    }
  )

 }
 
 
  //  findAllinternships():void{
  //    this.postInternshipService.findAll().subscribe(
  //      (res)=>{
  //        console.log("Found internships ", res)
         
  //    }
  //    )
  //  }

}

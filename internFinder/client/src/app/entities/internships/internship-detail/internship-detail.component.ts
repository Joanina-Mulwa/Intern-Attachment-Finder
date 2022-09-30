import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { AdvertDetails } from '../../post-internships/advert-details-model';
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
    protected applyInternship: ApplyInternshipService,
    protected router: Router,
  ) { }
  category: Boolean = false;
  //internshipDetail!: PostInternship;
  internshipDetail!: any;
  // internshipDownloadDetail?: Observable<any>;

  username!: string;
  internshipId!: number;
  loggedInUserEmail!: string;
  isPostedByMe: boolean = false;
  isEmployer: boolean = false;
  companyDetails?: UserBio;
  applications?: ApplyInternship[];
  internshipApplied = false;
  //appliedInternshipId: number = 1;
  appliedInternshipIdArray: number[] = []
  file?: File;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      console.log("We want to view profile of intenrhsip of is  ", this.internshipId)
      this.checkIfPostedByMe();
      
    });
    // this.findAllinternships();
    this.getCurrentLoggedInUsername();
    this.checkIfAppliedByMe();

  }



  back(): void {

    window.history.back();

  }

  getCurrentLoggedInUsername(): any {
    // this.internshipDownloadDetail = this.postInternshipService.downloadAdvertById(this.internshipId)
    console.log("Current logged in user token", this.tokenService.getToken());
    console.log("Current logged in username and token ", this.tokenService.getUsername());
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.loggedInUserEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.loggedInUserEmail).subscribe(
      (res) => {
        // window.location.reload();
        console.log("User details is", res)
        if (res.authority === Authority.EMPLOYER) {
          this.isEmployer = true;
        }
      },
      (err) => {
        console.log("Error fetching current user details", err)
      }
    )


  }



  checkIfPostedByMe(): void {

    this.postInternshipService.findAdvertById(this.internshipId).subscribe(
      (res) => {
        console.log("internship details are", res)
       // res.type = `data:${res.type};base64,`
        this.internshipDetail = res;
        //this.fileBlob = btoa(String.fromCharCode.apply(null, new Uint8Array(res.data)));
        // this.fileBlob=new Blob([res.data], {type: "image/png"});
        // this.fileBlob = btoa(String.fromCharCode.apply(null, new Array(res.data))); 
        this.file = new File([res.data], res.name, { type: res.type });
        console.log(new File([res.data], res.name, { type: res.type }))

        console.log("Testing ***********", this.internshipDetail)
        console.log("internship details confirmation are", this.internshipDetail)
        console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
        console.log("Current internship was posted by :", this.internshipDetail.companyEmail);
        this.loggedInUserEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
        if (this.loggedInUserEmail === this.internshipDetail.companyEmail) {
          this.isPostedByMe = true;
        }
        this.getCompanyDetails();

      },
      (err) => {
        console.log("Error fetching current internship details", err)
      }
    )

  }

  getCompanyDetails(): void {
    console.log("Company details that posted current inernship is ", this.internshipDetail.companyEmail)
    this.userService.findByEmail(this.internshipDetail.companyEmail).subscribe(
      (res) => {
        console.log("Company details that posted current inernship is ", res)
        this.companyDetails = res;
        let date = new Date().toJSON().slice(0, 10);

        this.companyDetails!.createdOn = date;
        console.log("New creation dTE IS ", this.companyDetails?.createdOn)



        console.log("Company details that posted current inernship 2 is", this.companyDetails)
      },
      (err) => {
        console.log("Error fetching company that posted current internhsip", err)
      }
    )

  }

  checkIfAppliedByMe(): void {
    this.applyInternship.findByAppliedBy(this.loggedInUserEmail).subscribe(
      (res) => {
        this.applications = res;
        console.log("I have aplied for this internships, ", this.applications)
        this.applications?.forEach((application: any) => {
          //this.appliedInternshipId = +application.internshipId
          console.log("internship id is ", +this.internshipId, "and the applied internship id is ", +application.internshipId, "and ccmparison between the two values is ", +this.internshipId === +application.internshipId)
          if (+this.internshipId === +application.internshipId) {
            this.appliedInternshipIdArray.push(+application.internshipId);
            console.log("Id of internships applied are", this.appliedInternshipIdArray)
          }

        });

        if (this.appliedInternshipIdArray.includes(+this.internshipId)) {
          this.internshipApplied = true;
        }
        else {
          this.internshipApplied = false;
        }
      },
      (err) => { console.log("error fetching internhips applied", err) }

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

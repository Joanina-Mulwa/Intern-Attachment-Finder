import { Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as mammoth from 'mammoth';
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
  styleUrls: ['./internship-detail.component.scss'],
})

export class InternshipDetailComponent implements OnInit {
  constructor(
    private sanitized: DomSanitizer,
    protected tokenService: TokenService,
    protected postInternshipService: PostInternshipService,
    protected route: ActivatedRoute,
    protected userService: UserService,
    protected applyInternship: ApplyInternshipService,
    protected router: Router,
    private sanitizer: DomSanitizer

  ) { }
  category: Boolean = false;
  //internshipDetail!: PostInternship;
  internshipDetail!: any;
  // internshipDownloadDetail?: Observable<any>;

  username!: string;
  internshipId!: number;
  loggedInUserEmail!: string;
  isPostedByMe: boolean = false;
  isEmployer: boolean = true;
  companyDetails?: UserBio;
  applications?: ApplyInternship[];
  internshipApplied = false;
  //appliedInternshipId: number = 1;
  appliedInternshipIdArray: number[] = []
  file?: File;
  fileTest?: File;
  loading = false;
  fileSource!: string;
  pdfSource!: any;
  srcPDF!: string;
  srcDOC!: any;
  safe!: SafeUrl;


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

  @ViewChild('videoPlayer') videoplayer!: ElementRef;

  toggleVideo() {
    this.videoplayer.nativeElement.play();
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
        else if (res.authority === Authority.STUDENT){
          this.isEmployer = false;
        }
      },
      (err) => {
        console.log("Error fetching current user details", err)
      }
    )


  }


  public checkIfPostedByMe(): void {
    this.loading = true;

    this.postInternshipService.findAdvertById(this.internshipId).subscribe(
      (res) => {
        console.log("internship details are", res)
        // res.type = `data:${res.type};base64,`
        this.internshipDetail = res;
        if (res.type == 'application/pdf') {
          var arrrayBuffer = base64ToArrayBuffer(res.data); //data is the base64 encoded string
          function base64ToArrayBuffer(base64: string) {
            var binaryString = window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
              var ascii = binaryString.charCodeAt(i);
              bytes[i] = ascii;
            }
            return bytes;
          }
          var blob = new Blob([arrrayBuffer], { type: "application/pdf" });
          this.srcPDF = window.URL.createObjectURL(blob);
          console.log("Testing pdf ***********", this.srcPDF)

          // window.open(this.src,'height=650,width=840');

        }

        else if (res.type == 'application/msword' || res.type.includes('application/vnd')) {


          var arrrayBuffer = base64ToArrayBuffer(res.data); //data is the base64 encoded string
          function base64ToArrayBuffer(base64: string) {
            var binaryString = window.atob(base64);
            var binaryLen = binaryString.length;
            var bytes = new Uint8Array(binaryLen);
            for (var i = 0; i < binaryLen; i++) {
              var ascii = binaryString.charCodeAt(i);
              bytes[i] = ascii;
            }
            return bytes;
          }
          var blob = new Blob([arrrayBuffer], { type: res.type });
          this.srcDOC = window.URL.createObjectURL(blob);

           console.log("Testing doc ***********", this.srcDOC)


        }





        this.loading = false;
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
    this.applyInternship.getApplicationsByAppliedBy(this.loggedInUserEmail).subscribe(
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

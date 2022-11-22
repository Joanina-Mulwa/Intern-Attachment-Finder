import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship, Status } from '../../apply-internship/apply-internship-model';
import { Authority, UserBio } from '../../users/user-bio-model';
import { Location, Mode } from './interview-model';

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
    protected router: Router,
    protected tokenService: TokenService,
    protected postInternshipService: PostInternshipService,
    protected userService: UserService,



  ) { }
  userEmail!: string;
  applications?: ApplyInternship[];
  internshipId!: number;
  applicationForcurrentInternship?: any;
  userBioDetails?: UserBio;
  srcPDF!: string;
  srcDOC!: any;
  safe!: SafeUrl;
  internshipDetails?: any;
  interviewDetails = {
    id: undefined as any,
    internshipId: undefined as unknown as number,
    mode: 'Onsite',
    link: '',
    location: '',
    address: '',
    date: '',
    time: '',
    important: '',
  }



  locations = [Location.BARINGO, Location.BOMET, Location.BUNGOMA, Location.BUSIA, Location.EMBU, Location.GARISSA, Location.HOMABAY, Location.ISIOLO, Location.KAJIADO, Location.KAKAMEGA, Location.KERICHO, Location.KIAMBU, Location.KILIFI, Location.KIRINYAGA, Location.KISII, Location.KISUMU, Location.KITUI, Location.KWALE, Location.LAIKIPIA, Location.LAMU, Location.MACHAKOS, Location.MAKUENI, Location.MANDERA, Location.MARAKWET, Location.MARSABIT, Location.MERU, Location.MIGORI, Location.MOMBASA, Location.MURANGA, Location.NAIROBICITY, Location.NAKURU, Location.NANDI, Location.NAROK, Location.NYAMIRA, Location.NYANDARUA, Location.NYERI, Location.SAMBURU, Location.SIAYA, Location.TAITATAVETA, Location.TANARIVER, Location.THARAKANITHI, Location.TRANSNZOIA, Location.TURKANA, Location.UASINGISHU, Location.VIHIGA, Location.WAJIR, Location.WESTPOKOT];

  modes = [Mode.ONSITE, Mode.REMOTE]




  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      this.internshipId = params['id'];
      console.log("We want to view profile of applicant ", this.userEmail)
      console.log("We want to view profile of internship of id ", this.internshipId)

    });
    this.getApplications();
    this.getApplicantDetails();
    this.getInternshipDetails();
  }
  back(): void {
    window.history.back();
  }

  getInternshipDetails(): void {
    this.postInternshipService.findAdvertById(this.internshipId).subscribe(
      (res) => {
        this.internshipDetails = res;
        console.log("Found this internship details", this.internshipDetails);


      },
      (err) => {
        console.log("Failed to fetch internsip details");

      }
    )


  }


  getApplications(): void {
    this.applicationApplied.getApplicationsByAppliedBy(this.userEmail).subscribe(
      (res) => {
        this.applications = res;
        console.log("applications", this.applications)
        this.applications?.forEach((application: any) => {
          console.log("application here", +application.internshipId, "and current internship id is", +this.internshipId, " and the comparison is", +application.internshipId === +this.internshipId)
          if (+application.internshipId === +this.internshipId) {
            this.applicationForcurrentInternship = application;
            console.log("here is the application", this.applicationForcurrentInternship)
            if (this.applicationForcurrentInternship.type == 'application/pdf') {
              var arrrayBuffer = base64ToArrayBuffer(this.applicationForcurrentInternship.data); //data is the base64 encoded string
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

            else if (this.applicationForcurrentInternship.type == 'application/msword' || this.applicationForcurrentInternship.type.includes('application/vnd')) {


              var arrrayBuffer = base64ToArrayBuffer(this.applicationForcurrentInternship.data); //data is the base64 encoded string
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
              var blob = new Blob([arrrayBuffer], { type: this.applicationForcurrentInternship.type });
              this.srcDOC = window.URL.createObjectURL(blob);

              console.log("Testing doc ***********", this.srcDOC)


            }


          }
        })

      },
      (err) => {
        console.log("error getting applications")
      }
    )

  }

  getApplicantDetails(): void {
    this.userBio.findByEmail(this.userEmail).subscribe(
      (res) => {
        this.userBioDetails = res;
        console.log("Found the applicant ", this.userBioDetails)
        if (this.userBioDetails?.skills) {
          this.userBioDetails.skillsList = this.userBioDetails.skills.split(",");
        }
      },
      (err) => { console.log("Error fetching user bio") }
    )
  }

  updateInternshipApplication(status: any): void {
    this.applicationForcurrentInternship!.status = status as Status;
    console.log("About to application", this.applicationForcurrentInternship)

    setTimeout(() => {
      window.history.back();
      this.router.navigate(['/applicants', this.internshipId])
    }, 500)
    setTimeout(() => {
      this.router.navigate(['/applicants', this.internshipId])
      window.location.reload();


    }, 1500)
    this.applicationApplied.updateApplication(this.applicationForcurrentInternship).subscribe(
      (res)=>{
        console.log("Updated internship to", res)
        // this.router.navigate(['/applicants', this.internshipId])

        //window.Location.reload();
    },
      (err)=>{console.log("Error updating", err)}
    )

  }

}

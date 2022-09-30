import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { AdvertDetails } from '../../post-internships/advert-details-model';
import { InternshipStatus, PostInternship } from '../../post-internships/post-internship-model';
import { UserBio } from '../../users/user-bio-model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected postInternshipService: PostInternshipService,
    protected tokenService: TokenService,
    protected applyInternship: ApplyInternshipService,
  ) {
  }
  category: Boolean = false;
  
  username!: string;
  loading = false;
  searchText: string = '';
  userEmail!: string;
  
  appliedInternshipIdArray: any[] = []
  isApplied: boolean = false;
  userBioDetail?: UserBio;
  // internshipsPostedByMe: PostInternship[] = [];
  // activeInternshipsPostedByMe: PostInternship[] = [];
  // closedInternshipsPostedByMe: PostInternship[] = [];
  // internships: PostInternship[]=[];
  // allPostedInternships: PostInternship[]=[];
  // allInternships!:PostInternship[];
 // applications!: ApplyInternship[];
  
  internshipsPostedByMe: AdvertDetails[] = [];
  activeInternshipsPostedByMe: AdvertDetails[] = [];
  closedInternshipsPostedByMe: AdvertDetails[] = [];
  internships: AdvertDetails[]=[];
  allPostedInternships: AdvertDetails[]=[];
  allInternships!:AdvertDetails[];
  applications!: ApplyInternship[];

  deleteId: any;
  deleteTitle: any;
  //today = new Date().toJSON().slice(0, 10)
  //date?: string
  fileInfos?: Observable<any>;



  ngOnInit(): void {
    //this.findAllinternships();
    this.findAllAdverts();
    this.getCurrentLoggedInUsername();
    this.getBioDetails();
    //this.getPostedInternshipByMe();
    //this.getUsername2();
    this.getAdvertsPotedByMe();
    this.fileInfos = this.postInternshipService.getFiles();


  }
  getAdvertsPotedByMe():void{
    this.loading = true;
    this.postInternshipService.getFiles().subscribe(
      (res) => {
        this.allPostedInternships = res;
        console.log("all internhsip posted are", this.allPostedInternships)

        this.allPostedInternships.forEach((internship: any) => {
          if (internship.companyEmail === this.userEmail) {
            this.internshipsPostedByMe.push(internship);
            console.log("internhsip details i have posted are are", this.internshipsPostedByMe)

          }

          this.loading = false;

        })
        console.log("Length of internships posted by me", this.internshipsPostedByMe.length)
        if (this.internshipsPostedByMe.length === 0) {
          console.log("You have not posted any internhsip")

        }
        else {
          this.internshipsPostedByMe.forEach((internshipPostedByMe: any) => {
            if (internshipPostedByMe.internshipStatus === InternshipStatus.ACTIVE) {
              this.activeInternshipsPostedByMe.push(internshipPostedByMe)
              console.log("Active internships posted by me are", this.activeInternshipsPostedByMe)
            }
            else if (internshipPostedByMe.internshipStatus === InternshipStatus.CLOSED) {
              this.closedInternshipsPostedByMe.push(internshipPostedByMe)
              console.log("Closed internships posted by me are", this.closedInternshipsPostedByMe)

            }
            else { console.log("No status found") }

          })
        }

      },
      (err) => { console.log("error fetching all internhips", err) }
    )
    
  }
  findAllAdverts(): void {
    this.loading = true;
    this.postInternshipService.getFiles().subscribe(
      (res) => {
        this.loading = true;
        this.loading = false;
        console.log("Found all internships ", res)
        this.allInternships=res;
        console.log("Found all internships testing ", this.allInternships)


        this.allInternships.forEach((internship)=>{
          if(internship.internshipStatus === InternshipStatus.ACTIVE){
            this.internships.push(internship)
          }
        })
        let date = new Date().toJSON().slice(0, 10);
        console.log("Found active internships ", this.internships)
        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date && internship.internshipStatus === InternshipStatus.ACTIVE) {
            internship.internshipStatus = InternshipStatus.CLOSED;
            this.postInternshipService.updateInternship(internship).subscribe(
              (res) => {
                console.log(" updated internship to ,", res)
              },
              (err) => {
                console.log("error updating internship", err)
              }
            )
          }
          this.applyInternship.findByAppliedBy(this.userEmail).subscribe(
            (res) => {
              this.applications = res;
              this.applications.forEach((application: any) => {
                if (application.internshipId === internship.id) {
                  this.appliedInternshipIdArray.push(internship.id)
                  console.log("length is", this.appliedInternshipIdArray.length)
                }
              })
            },
            (err) => { console.log(err) }
          )
        });
      }
    )
  }

  // getCategory(): void {
  //   this.userLoginService.findCategory(this.userLogins.email).subscribe(
  //     (res) => {
  //       console.log(res)
  //       if (res == null) {
  //         this.router.navigate(['/internships'])
  //       }
  //       else {
  //         this.router.navigate(['/users'])
  //       }
  //     }
  //   )
  // }



  getCurrentLoggedInUsername(): any {


    console.log("Current logged in user token", this.tokenService.getToken());
    console.log("Current logged in username and token ", this.tokenService.getUsername());
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail = JSON.parse(localStorage.getItem('currentUser')!).email


  }

  getBioDetails(): void{
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
        this.userBioDetail=res;
        console.log("Found user details", this.userBioDetail)
      },
      (err)=> {
        console.log(err)}
    )
  }

  getPostedInternshipByMe(): void {
    this.loading = true;
    this.postInternshipService.findAll().subscribe(
      (res) => {
        this.allPostedInternships = res;
        console.log("all internhsip posted are", this.allPostedInternships)

        this.allPostedInternships.forEach((internship: any) => {
          if (internship.companyEmail === this.userEmail) {
            this.internshipsPostedByMe.push(internship);
            console.log("internhsip details i have posted are are", this.internshipsPostedByMe)

          }

          this.loading = false;

        })
        console.log("Length of internships posted by me", this.internshipsPostedByMe.length)
        if (this.internshipsPostedByMe.length === 0) {
          console.log("You have not posted any internhsip")

        }
        else {
          this.internshipsPostedByMe.forEach((internshipPostedByMe: any) => {
            if (internshipPostedByMe.internshipStatus === InternshipStatus.ACTIVE) {
              this.activeInternshipsPostedByMe.push(internshipPostedByMe)
              console.log("Active internships posted by me are", this.activeInternshipsPostedByMe)
            }
            else if (internshipPostedByMe.internshipStatus === InternshipStatus.CLOSED) {
              this.closedInternshipsPostedByMe.push(internshipPostedByMe)
              console.log("Closed internships posted by me are", this.closedInternshipsPostedByMe)

            }
            else { console.log("No status found") }

          })
        }

      },
      (err) => { console.log("error fetching all internhips", err) }
    )

  }
  softDelete(title: any, id: any): void {
    this.deleteId = id;
    this.deleteTitle = title;
  }

  deleteInternship(id: any): void {
    console.log("Deleting internship of id", id);
    this.postInternshipService.deleteInternship(id).subscribe(
      (res) => {
        console.log("Deleted internship")
        window.location.reload();
      },
      (err) => { console.log("Error deleting internship") }
    )

  }


  findAllinternships(): void {
    this.loading = true;
    this.postInternshipService.findAll().subscribe(
      (res) => {
        this.loading = true;
        this.loading = false;
        console.log("Found all internships ", res)
        this.allInternships=res;

        this.allInternships.forEach((internship)=>{
          if(internship.internshipStatus === InternshipStatus.ACTIVE){
            this.internships.push(internship)
          }
        })
        let date = new Date().toJSON().slice(0, 10);
        console.log("Found active internships ", this.internships)
        this.internships.forEach((internship: any) => {
          internship.skillsList = internship.skills.split(",");
          if (internship.reportingDate === date && internship.internshipStatus === InternshipStatus.ACTIVE) {
            internship.internshipStatus = InternshipStatus.CLOSED;
            this.postInternshipService.updateInternship(internship).subscribe(
              (res) => {
                console.log(" updated internship to ,", res)
              },
              (err) => {
                console.log("error updating internship", err)
              }
            )
          }
          this.applyInternship.findByAppliedBy(this.userEmail).subscribe(
            (res) => {
              this.applications = res;
              this.applications.forEach((application: any) => {
                if (application.internshipId === internship.id) {
                  this.appliedInternshipIdArray.push(internship.id)
                  console.log("length is", this.appliedInternshipIdArray.length)
                }
              })
            },
            (err) => { console.log(err) }
          )
        });
      }
    )
  }
  searchInternship(): void {
    this.loading = true;
    this.postInternshipService.searchInternship(this.searchText).subscribe(
      result => {
        this.loading = false;
        this.internships = result;
        let date = new Date().toJSON().slice(0, 10);
        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date) {
            internship.skillsList = internship.skills.split(",");
            internship.internshipStatus = InternshipStatus.CLOSED;
          }
        });
        console.log("Search produces internships:", this.internships)
      },
      error => {
        console.error('error getting searched internship', error);
      }
    )
  }
}

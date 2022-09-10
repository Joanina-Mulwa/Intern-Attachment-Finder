import { Component, OnInit } from '@angular/core';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { InternshipStatus, PostInternship } from '../../post-internships/post-internship-model';

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
  internships: PostInternship[]=[];
  allInternships!:PostInternship[];
  username!: string;
  loading = false;
  searchText: string = '';
  userEmail!: string;
  applications!: ApplyInternship[];
  appliedInternshipIdArray: any[] = []
  isApplied: boolean = false;
  //today = new Date().toJSON().slice(0, 10)
  //date?: string


  ngOnInit(): void {
    this.findAllinternships();
    this.getCurrentLoggedInUsername();
    //this.getUsername2();
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
        //this.internships = res;

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
          //check internships i have applied for
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

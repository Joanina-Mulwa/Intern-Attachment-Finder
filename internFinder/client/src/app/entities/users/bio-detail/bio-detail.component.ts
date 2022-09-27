import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship, Status } from '../../apply-internship/apply-internship-model';
import { InternshipStatus, PostInternship } from '../../post-internships/post-internship-model';
import { Authority, UserBio, UserStatus } from '../user-bio-model';

@Component({
  selector: 'app-bio-detail',
  templateUrl: './bio-detail.component.html',
  styleUrls: ['./bio-detail.component.scss']
})
export class BioDetailComponent implements OnInit {



  constructor(
    protected userService: UserService,
    protected route: ActivatedRoute,
    protected applyInternship: ApplyInternshipService,
    protected postInternshipService: PostInternshipService,
    protected router: Router,
  ) { }

  userBioDetail?: UserBio;
  loggedInUserEmail!: string;
  userEmail!: string;
  username!: string;
  isMe: boolean = false;
  applications!: ApplyInternship[];
  allInternshipDetails!: PostInternship[];
  approvedInternshipsDetails?: PostInternship[] = [];
  rejectedInternshipsDetails?: PostInternship[] = [];
  pendingInternshipsDetails?: PostInternship[] = [];
  internshipDetails: PostInternship[] = [];
  loading = false
  internships!: PostInternship[];
  companyInternships!: PostInternship[];
  internshipsPostedByMe: PostInternship[] = [];
  activeInternshipsPostedByMe: PostInternship[] = [];
  closedInternshipsPostedByMe: PostInternship[] = [];
  deleteId: any;
  deleteTitle: any;
  showNavbar: boolean = true;
  specificInternshipId!: any;
  specificApplicationId!: any;
  currentRouteUrl!: string;
  sortedInternshipDetails?: PostInternship[] = [];





  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      console.log("We want to view profile of ", this.userEmail)

      this.checkIfMe();
      this.getAppliedInternshipByMe();

    });
  }





  lastCompanyName = '';
  displayCompanyName(item: any): boolean {
    if (item.companyName !== this.lastCompanyName) {
      this.lastCompanyName = item.companyName;
      return true;
    } else {
      return false;
    }
  }

  trackCompanyName(index: number, item: any): string {
    return item.internshipTitle + item.companyName;
  }


  checkIfMe(): void {
    this.loading = true;
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.loggedInUserEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    if (this.loggedInUserEmail === this.userEmail) {
      this.isMe = true;
    }
    this.loading = true;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res) => {
        this.loading = true;
        this.loading = false;

        console.log("User details is", res)
        this.userBioDetail = res;
        let date = new Date().toJSON().slice(0, 10);
        this.userBioDetail!.createdOn = date;
        console.log("New creation dTE IS ", this.userBioDetail!.createdOn)
        if (this.userBioDetail?.skills) {
          this.userBioDetail.skillsList = this.userBioDetail.skills.split(",");
        }
        console.log("User this.userBioDetai is", this.userBioDetail)

        if (this.userBioDetail?.authority === Authority.STUDENT) {
          this.getAppliedInternshipByMe();
        }
        else if (this.userBioDetail?.authority === Authority.EMPLOYER) {
          this.getPostedInternshipByMe();


        }
        else {
          console.log("Error fetching current user authority")
        }


      },
      (err) => {
        console.log("Error fetching current user details", err)
      }
    )

  }

  getAppliedInternshipByMe(): void {
    this.loading = true;
    this.applyInternship.findByAppliedBy(this.loggedInUserEmail).subscribe(
      (res) => {
        this.applications = res;
        console.log("I have aplied for this internships, ", this.applications)
        if (this.applications.length === 0) {
          this.loading = false;
        }
        this.applications.forEach((application: any) => {
          
          console.log("internships aplied by, ", application.appliedBy)
          this.postInternshipService.findAll().subscribe(
            (res) => {
              this.allInternshipDetails = res;
              this.allInternshipDetails.forEach((allInternshipDetail: any) => {
                console.log("check applied internhsip id", application.internshipId, " against internships", allInternshipDetail.id, "and match value is ", application.internshipId === allInternshipDetail.id)
                if (application.internshipId === allInternshipDetail.id) {
                  this.internshipDetails?.push(allInternshipDetail)
                  console.log("internhsip details are", this.internshipDetails)
                  console.log("specific internhsip details are", application.id)
                  // this.sortedInternshipDetails = this.internshipDetails?.sort((a?: PostInternship, b?: PostInternship) => a?.createdBy > b?.companyName ? 1 : -1);
                  if (application.status === Status.APPROVED) {
                    this.approvedInternshipsDetails?.push(allInternshipDetail)
                  }
                  else if (application.status === Status.REJECTED) {
                    this.rejectedInternshipsDetails?.push(allInternshipDetail);
                  }
                  else {
                    this.pendingInternshipsDetails?.push(allInternshipDetail);
                    console.log("pending internhsip details are", this.pendingInternshipsDetails)

                  }



                }
                this.loading = false;
              })
            },
            (err) => {
              console.log("Error fetching current internship details", err)
            }
          )
        });
      },
      (err) => { console.log("error fetching internhips applied", err) }

    )

  }
  getPostedInternshipByMe(): void {
    this.loading = true;
    this.postInternshipService.findAll().subscribe(
      (res) => {
        this.internships = res;
        console.log("all internhsip posted are", this.internships)

        this.internships.forEach((internship: any) => {
          if (internship.companyEmail === this.userEmail) {
            this.internshipsPostedByMe.push(internship);
            console.log("internhsip details i have posted are are", this.internshipDetails)

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

  back(): void {
    window.history.back();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRouteUrl = event.url;
        console.log("here Current route is", this.currentRouteUrl)
        if (this.currentRouteUrl != "/") {
          this.showNavbar = true;
        }
        else {
          this.showNavbar = false;
          window.location.reload();
        }
      }
    });
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

  softDeleteAccount(): void {
    console.log("About to delete account of email", this.userEmail);

  }

  deleteAccount(): void {
    console.log("Deleting account of email", this.userEmail);
    this.userService.deleteUserAndActions(this.userEmail).subscribe(
      (res) => {
        console.log("Deleted accoutnt")
        this.router.navigate(['']);
        this.showNavbar = false;
        window.location.reload();
      },
      (err) => { console.log("Error deleting account") }
    )


  }
  softDeactivateAccount(): void {
    console.log("About to deactivate account of email", this.userEmail);

  }
  deactivateAccount(): void {
    console.log("About current accoutn account of email", this.userBioDetail);
    this.userBioDetail!.userStatus = UserStatus.PASSIVE;
    console.log("About to deactivate account of email", this.userBioDetail);
    this.userService.updateUser(this.userBioDetail).subscribe(
      (res) => {
        console.log("Activated", res)

        this.showNavbar = false;
        setTimeout(function () {
          window.location.reload();
        }, 500);
        this.router.navigate(['']);
      },
      (err) => {
        console.log("Deactivation failure")
      }
    )

  }








}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship, Status } from '../../apply-internship/apply-internship-model';
import { MinimumQualification, PostInternship } from '../../post-internships/post-internship-model';
import { Programme, UserBio } from '../../users/user-bio-model';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss']
})
export class ApplicantsComponent implements OnInit {

  constructor(
    protected appliedInternship: ApplyInternshipService,
    protected route: ActivatedRoute,
    protected userService: UserService,
    protected postInternship: PostInternshipService
  ) { }

  currentInternshipId!: number;
  currentInternshipApplications?: ApplyInternship[];
  applicantsEmailsOfCurrentInternship: any[] = [];
  applicantsDetails: UserBio[] = [];
  shortlistedApplicantsDetails: UserBio[] = [];
  approvedApplicantsDetails: UserBio[] = [];
  rejectedApplicantsDetails: UserBio[] = [];
  pendingApplicantsDetails: UserBio[] = [];
  searchApplicantsDetails!: UserBio[];
  loading: boolean = false;
  searchText: string = '';
  approvedApplicationForcurrentInternship?: ApplyInternship[] = [];
  rejectedApplicationForcurrentInternship?: ApplyInternship[] = [];
  pendingApplicationForcurrentInternship?: ApplyInternship[] = [];
  internshipDetails?: any;
  allApplications?: ApplyInternship[];
  internship!: PostInternship;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of internship ", this.currentInternshipId)

    });
    this.getApplicationsByInternshipId()
    this.getCurrentInternshipDetails();
    this.getShortlistedApplications();
  }

  getCurrentInternshipDetails(): void {
    this.postInternship.findAdvertById(this.currentInternshipId).subscribe(
      (res) => {
        this.internshipDetails = res;
        console.log("This interenship was posted by", this.internshipDetails)
      },
      (err) => { console.log("error fetching internship details") }

    )
  }
  getShortlistedApplications(): void {
    this.loading = true;
    this.appliedInternship.getApplicationsByInternshipId(this.currentInternshipId).subscribe(
      (res) => {
        this.allApplications = res;
        console.log("Here are all the applications", this.allApplications);

        this.postInternship.findAdvertById(this.currentInternshipId).subscribe(
          (res) => {
            this.internship = res;
            console.log("Here is the internship posted", this.internship);

          },
          (err) => { console.log("Internship not found") }
        )

        this.allApplications?.forEach((application: any) => {
          //get applicants detaisl
          this.userService.findByEmail(application.appliedBy).subscribe(
            (res) => {
              
              console.log("Found this :", res)
              //begin shortlisting
              if (res.programme === this.internship?.minimumQualification) {
                // if(this.internship?.experienceLevel === application.experienceLevel.value){
                this.shortlistedApplicantsDetails = application;
                // } 
              }

            },
            (err) => { console.log("Error", err) }
          )


        })


      },
      (err) => { console.log("Applications not found") }
    )
  }

  getApplicationsByInternshipId(): void {
    this.loading = true;
    this.appliedInternship.getApplicationsByInternshipId(this.currentInternshipId).subscribe(
      (res) => {
        this.loading = false;
        console.log("found the following applications", res)
        this.currentInternshipApplications = res;
        //get emails of applicants
        this.currentInternshipApplications?.forEach((currentInternshipApplication) => {
          this.applicantsEmailsOfCurrentInternship.push(currentInternshipApplication.appliedBy)
          if (currentInternshipApplication.status === Status.APPROVED) {
            this.approvedApplicationForcurrentInternship?.push(currentInternshipApplication)
          }
          else if (currentInternshipApplication.status === Status.REJECTED) {
            this.rejectedApplicationForcurrentInternship?.push(currentInternshipApplication);
          }
          else {
            this.pendingApplicationForcurrentInternship?.push(currentInternshipApplication);

          }

        })
        console.log("found the following applicants emails", this.applicantsEmailsOfCurrentInternship)
        //get details of applicants
        this.applicantsEmailsOfCurrentInternship.forEach((applicantEmailOfCurrentInternship) => {
          this.userService.findByEmail(applicantEmailOfCurrentInternship).subscribe(
            (res) => {
              this.applicantsDetails.push(res)
              this.applicantsDetails.forEach((applicantDetails: any) => {
                if (applicantDetails.skills) {
                  applicantDetails.skillsList = applicantDetails.skills.split(",");

                }

              })

              console.log("Applicants details are", this.applicantsDetails)

            },
            (err) => { console.log("Error fetching applicants details") }
          )

        })
        // console.log("Approved application details are, ", this.approvedApplicationForcurrentInternship)
        // console.log("Rejected application details are, ", this.rejectedApplicationForcurrentInternship)
        // console.log("Pending application details are, ", this.pendingApplicationForcurrentInternship)


        this.approvedApplicationForcurrentInternship?.forEach((approvedApplication) => {
          this.userService.findByEmail(approvedApplication.appliedBy).subscribe(
            (res) => {
              this.approvedApplicantsDetails.push(res)
              this.approvedApplicantsDetails.forEach((approvedApplicantDetails: any) => {
                if (approvedApplicantDetails.skills) {
                  approvedApplicantDetails.skillsList = approvedApplicantDetails.skills.split(",");
                }
              })
              console.log("Approved Applicants details are, ", this.approvedApplicantsDetails)
            },
            (err) => { console.log("Error fetching approved applicants details") }
          )
        })
        this.rejectedApplicationForcurrentInternship?.forEach((rejectedApplication) => {
          this.userService.findByEmail(rejectedApplication.appliedBy).subscribe(
            (res) => {
              this.rejectedApplicantsDetails.push(res)
              this.rejectedApplicantsDetails.forEach((rejectedApplicantDetails: any) => {
                if (rejectedApplicantDetails.skills) {
                  rejectedApplicantDetails.skillsList = rejectedApplicantDetails.skills.split(",");
                }
              })
              console.log("Rejected Applicants details are, ", this.rejectedApplicantsDetails)
            },
            (err) => { console.log("Error fetching rejected applicants details") }
          )
        })
        this.pendingApplicationForcurrentInternship?.forEach((pendingApplication) => {
          this.userService.findByEmail(pendingApplication.appliedBy).subscribe(
            (res) => {
              this.pendingApplicantsDetails.push(res)
              this.pendingApplicantsDetails.forEach((pendingApplicantDetails: any) => {
                if (pendingApplicantDetails.skills) {
                  pendingApplicantDetails.skillsList = pendingApplicantDetails.skills.split(",");
                }
})
              console.log("pending Applicants details are, ", this.pendingApplicantsDetails)
            },(err) => { console.log("Error fetching pending applicants details") }
          )
        })
      },
      (err) => { console.log("Could not find any applications") }
    )
  }





  searchApplicant(): void {
    let searchText = this.searchText?.trim().toLowerCase();

    this.loading = true;

    this.searchApplicantsDetails = this.applicantsDetails.filter(applicantDetails => {
      if (applicantDetails.skills) {
        applicantDetails.skillsList = applicantDetails.skills.split(",");
      }
      this.loading = false;

      return (
        applicantDetails.name?.toLowerCase().includes(searchText)
        || applicantDetails.email?.toLowerCase().includes(searchText)
        || applicantDetails.username?.toLowerCase().includes(searchText)
        || applicantDetails.institution?.toLowerCase().includes(searchText)
        || applicantDetails.course?.toLowerCase().includes(searchText)
        || applicantDetails.skills?.toLowerCase().includes(searchText)
        || applicantDetails.programme?.toLowerCase().includes(searchText)
        || applicantDetails.experienceLevel?.toLowerCase().includes(searchText)
      );
    });
  }


  // searchApplicanta(): void {
  //   this.loading = true;





  //   this.appliedInternship.searchApplicant(this.searchText).subscribe(
  //     result => {
  //       this.loading = false;

  //       this.applicantsDetails = result;
  //       this.applicantsDetails.forEach((applicantDetails: any) => {
  //         if(applicantDetails.internshipId === this.currentInternshipId){
  //           if (applicantDetails.skills) {
  //             applicantDetails.skillsList = applicantDetails.skills.split(",");

  //           }
  //           this.searchApplicantsDetails.push(applicantDetails)
  //         }

  //       });

  //       console.log("Search produces users:", this.applicantsDetails)
  //     },
  //     error => {
  //       console.error('error getting searched user', error);
  //     }
  //   )
  // }



}

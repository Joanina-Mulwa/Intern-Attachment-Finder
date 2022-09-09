import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { UserBio } from '../../users/user-bio-model';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit {

  constructor(
    protected appliedInternship: ApplyInternshipService,
    protected route: ActivatedRoute,
    protected userService: UserService
  ) { }

  currentInternshipId!: number;
  currentInternshipApplications?: ApplyInternship[];
  applicantsEmailsOfCurrentInternship: any[] = [];
  applicantsDetails: UserBio[] = [];
  searchApplicantsDetails!: UserBio[];
  loading: boolean = false;
  searchText: string = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of internship ", this.currentInternshipId)

    });
    this.getApplicationsByInternshipId()
  }

  getApplicationsByInternshipId(): void {
    this.loading=true;
    this.appliedInternship.findApplicationsByInternshipId(this.currentInternshipId).subscribe(
      (res) => {
        this.loading=false;
        console.log("found the following applications", res)
        this.currentInternshipApplications = res;
        //get emails of applicants
        this.currentInternshipApplications?.forEach((currentInternshipApplication) => {
          this.applicantsEmailsOfCurrentInternship.push(currentInternshipApplication.appliedBy)

        })
        console.log("found the following applicants emails", this.applicantsEmailsOfCurrentInternship)
        //get details of applicants
        this.applicantsEmailsOfCurrentInternship.forEach((applicantEmailOfCurrentInternship) => {
          this.userService.findByEmail(applicantEmailOfCurrentInternship).subscribe(
            (res) => { 
              this.applicantsDetails.push(res)
              this.applicantsDetails.forEach((applicantDetails: any)=>{
                if (applicantDetails.skills) {
                  applicantDetails.skillsList = applicantDetails.skills.split(",");
                  
                      }

              })
            
              console.log("Applicants details are", this.applicantsDetails)

             },
            (err) => { console.log("Error fetching applicants details")}
          )

        })

      },
      (err) => { console.log("Could not find any applications") }

    )
  }



  searchApplicant(): void {
    let searchText = this.searchText ?.trim().toLowerCase();
    
    this.loading = true;
   
    this.searchApplicantsDetails = this.applicantsDetails.filter(applicantDetails => {
      if (applicantDetails.skills) {
        applicantDetails.skillsList = applicantDetails.skills.split(",");
      }
      this.loading=false;

      return (
        applicantDetails.name ?.toLowerCase().includes(searchText)
          || applicantDetails.email ?.toLowerCase().includes(searchText)
            || applicantDetails.username ?.toLowerCase().includes(searchText)
              || applicantDetails.institution ?.toLowerCase().includes(searchText)
                || applicantDetails.course ?.toLowerCase().includes(searchText)
                  || applicantDetails.skills ?.toLowerCase().includes(searchText)
                    || applicantDetails.programme ?.toLowerCase().includes(searchText)
                        || applicantDetails.experienceLevel ?.toLowerCase().includes(searchText)
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { request } from 'http';
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
  currentInternshipApplications?: any[];
  applicantsEmailsOfCurrentInternship: any[] = [];
  applicantsDetails: UserBio[] = [];
  shortlistedApplicantsDetails: UserBio[] = [];
  approvedApplicantsDetails: UserBio[] = [];
  rejectedApplicantsDetails: UserBio[] = [];
  pendingApplicantsDetails: UserBio[] = [];
  searchApplicantsDetails!: any[];
  loading: boolean = false;
  searchText: string = '';
  approvedApplicationForcurrentInternship?: ApplyInternship[] = [];
  rejectedApplicationForcurrentInternship?: ApplyInternship[] = [];
  pendingApplicationForcurrentInternship?: ApplyInternship[] = [];
  internshipDetails?: any;
  allApplications?: ApplyInternship[];
  internship!: PostInternship;
  extractedAdvertText: any;
  extractedResume:any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of internship ", this.currentInternshipId)

    });
    this.getApplicationsByInternshipId()
    this.getCurrentInternshipDetails();
    setTimeout(() => {
      this.getJobListingText();
      this.getShortlistedApplications();
    }, 1000);
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
  getJobListingText() {
    console.log("=========================");
    console.log("+++++", this.internshipDetails.url);


    this.gettext(this.internshipDetails.url).then( (text: string) => {
      this.extractedAdvertText = text;
      console.log('Advert text ' + this.extractedAdvertText);
    },
      function (reason: string) {
        console.error(reason);
      }
    );
  }
  gettext(pdfUrl: string) {
    //@ts-ignore
    var pdf = window.pdfjsLib.getDocument(pdfUrl);
    return pdf.promise.then(function (pdf: any) { // get all pages text
      var maxPages = pdf.numPages;
      var countPromises = []; // collecting all page promises
      for (var j = 1; j <= maxPages; j++) {
        var page = pdf.getPage(j);

        var txt = "";
        countPromises.push(page.then(function (page: any) { // add page promise
          var textContent = page.getTextContent();
          return textContent.then(function (text: any) { // return content promise
            return text.items.map(function (s: any) { return s.str; }).join(''); // value page text 
          });
        }));
      }
      // Wait for all pages and join text
      return Promise.all(countPromises).then(function (texts) {
        return texts.join('');
      });
    });
  }
  getShortlistedApplications(): void {
    // Get a list of applicants
    console.log("_+_+_+", this.currentInternshipApplications);

    // For each applicant extract their skills (api call to superparser)

    this.currentInternshipApplications?.forEach(async (applicationResume) => {

      var arrrayBuffer = base64ToArrayBuffer(applicationResume.data); //data is the base64 encoded string
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
      var pdf = new File([arrrayBuffer], applicationResume.name, { type: applicationResume.type });
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        const fd = new FormData()
        fd.append('file', pdf)
      
        // send `POST` request
        fetch('https://api.superparser.com/parse', {
          method: 'POST',
          headers: {
            'Authorization': 'M5yJvp0Ow8ai9cMhmWiFt8x46wqpaguU6qw7Igj1',
            'x-api-key': 'M5yJvp0Ow8ai9cMhmWiFt8x46wqpaguU6qw7Igj1',
          },
          body: fd,
        })
          .then(res => res.json())
          .then((json) => {
            this.extractedResume = json;
            console.log("here",this.extractedResume)
          })
          .catch(err => console.error(err))
      // compare the extracted skills with the advert text
      

    })

    //  this.currentInternshipApplications?.map((application: any)=>{
    //   const resumeURL = application.url
    //  })
    // return



    // this.loading = true;
    // this.appliedInternship.getApplicationsByInternshipId(this.currentInternshipId).subscribe(
    //   (res) => {
    //     this.allApplications = res;
    //     console.log("Here are all the applications", this.allApplications);

    //     this.postInternship.findAdvertById(this.currentInternshipId).subscribe(
    //       (res) => {
    //         this.internship = res;
    //         console.log("Here is the internship posted", this.internship);

    //       },
    //       (err) => { console.log("Internship not found") }
    //     )

    //     this.allApplications?.forEach((application: any) => {
    //       //get applicants detaisl
    //       this.userService.findByEmail(application.appliedBy).subscribe(
    //         (res) => {

    //           console.log("Found this :", res)
    //           //begin shortlisting
    //           if (res.programme === this.internship?.minimumQualification) {
    //             // if(this.internship?.experienceLevel === application.experienceLevel.value){
    //             this.shortlistedApplicantsDetails = application;
    //             // } 
    //           }

    //         },
    //         (err) => { console.log("Error", err) }
    //       )


    //     })


    //   },
    //   (err) => { console.log("Applications not found") }
    // )
  }

  getApplicationsByInternshipId(): void {
    this.loading = true;
    this.appliedInternship.getApplicationsByInternshipId(this.currentInternshipId).subscribe(
      (res) => {
        this.loading = false;
        console.log("found the following applications", res)
        this.currentInternshipApplications = res;
        //this.getShortlistedApplications();
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
            }, (err) => { console.log("Error fetching pending applicants details") }
          )
        })
      },
      (err) => { console.log("Could not find any applications") }
    )
  }



  searchApplicant(): void {
    this.loading = true;
    this.appliedInternship.searchApplicant(this.searchText).subscribe(
      result => {
        this.loading = false;
        this.searchApplicantsDetails = result;
        console.log("lets see:", this.searchApplicantsDetails)

        this.searchApplicantsDetails.forEach((searchApplicantsDetail: any) => {
          if (searchApplicantsDetail.internshipId === this.currentInternshipId) {
            if (searchApplicantsDetail.skills) {
              searchApplicantsDetail.skillsList = searchApplicantsDetail.skills.split(",");

            }
            this.applicantsDetails = [];
            this.applicantsDetails.push(searchApplicantsDetail)
            console.log("Search produces users:", this.applicantsDetails)

          }


        });

      },
      error => {
        console.error('error getting searched user', error);
      }
    )
  }



}

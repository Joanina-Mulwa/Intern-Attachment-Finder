import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { createReadStream, writeFile } from 'fs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship, Status } from '../../apply-internship/apply-internship-model';
import { MinimumQualification, PostInternship } from '../../post-internships/post-internship-model';
import { Programme, UserBio } from '../../users/user-bio-model';
import { MatchComparisonModel } from './matchComparisonModel';
import { ResumeSearchParameters } from '@affinda/affinda';

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
  // shortlistedApplicantsDetails: UserBio[] = [];
  approvedApplicantsDetails: UserBio[] = [];
  rejectedApplicantsDetails: UserBio[] = [];
  pendingApplicantsDetails: UserBio[] = [];
  shortlistedApplicantsDetails: UserBio[] = [];
  searchApplicantsDetails!: any[];
  loading: boolean = false;
  loadingShortlisted: boolean = true;

  searchText: string = '';
  approvedApplicationForcurrentInternship?: ApplyInternship[] = [];
  rejectedApplicationForcurrentInternship?: ApplyInternship[] = [];
  pendingApplicationForcurrentInternship?: ApplyInternship[] = [];
  shortlistedApplicationForcurrentInternship?: ApplyInternship[] = [];
  internshipDetails?: any;
  allApplications?: ApplyInternship[];
  internship!: PostInternship;
  extractedAdvertText: any;
  extractedResume: any;
  extractedResumeSkills?: any[];
  extractedJobDescriptionSkills?: any[];
  extractedResumeDescriptionSkills?: any;
  extractedJobIdentifier?: any;
  extractedResumeIdentifier?: any;
  shortlistedApplicantsArray?: any[] = [];
  shortlistedApplicantsDetailsArray?: any[] = []

  requirementCountMatch: number = 0;
  requirementMatchComparison: MatchComparisonModel[] = [];
  sortedArray: MatchComparisonModel[] = [];
  recommendedArray: MatchComparisonModel[] = [];





  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of internship ", this.currentInternshipId)

    });
    this.getCurrentInternshipDetails();
    this.getApplicationsByInternshipId()
    setTimeout(() => {
      //this.getJobListingText();
    }, 1000);
  }

  getCurrentInternshipDetails(): void {
    this.postInternship.findAdvertById(this.currentInternshipId).subscribe(
      (res) => {
        this.internshipDetails = res;
        console.log("This interenship was posted by", this.internshipDetails)
        this.getJobDescription();

      },
      (err) => { console.log("error fetching internship details") }

    )
  }
  getJobDescription(): void {
    console.log("***^^^^^^^^^^%%%%%%%%%%url to our file", this.internshipDetails.url);


    const { AffindaCredential, AffindaAPI } = require("@affinda/affinda");

    const credential = new AffindaCredential("02bfae960b3de66b98010fb3e18fc34ab0996c89")
    const client = new AffindaAPI(credential)

    var arrrayBuffer = base64ToArrayBuffer(this.internshipDetails.data); //data is the base64 encoded string
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

    console.log("$$$$$$$$$$$$$$$", blob);

    console.time("User Login")
    client.createJobDescription({ file: blob }).then((result: any) => {
      console.log("Returned job data:");
      console.dir(result)
      console.log("Returned job data skills only:");
      console.timeEnd("User Login")
      this.extractedJobDescriptionSkills = result.data.skills;
      this.extractedJobIdentifier = result.meta.identifier;

      console.log("Returned job identifier:", this.extractedJobIdentifier);

      console.dir(this.extractedJobDescriptionSkills)
      this.getResumeDescription();
    }).catch((err: any) => {
      console.log("An error occurred:");
      console.error(err);
    });

    // Can also use a URL:

    //  client.createJobDescription({url: "https://api.affinda.com/static/sample_job_descriptions/example.pdf"}).then((result) => {
    //      console.log("Returned data:");
    //      console.dir(result)
    //  }).catch((err) => {
    //      console.log("An error occurred:");
    //      console.error(err);
    //  });



  }
  getResumeDescription(): void {
    this.loadingShortlisted = true;
    console.time("End of parser")
    // Get a list of applicants
    console.log("_+_+_+", this.currentInternshipApplications);

    const { AffindaCredential, TokenCredential, AffindaAPI } = require("@affinda/affinda/");

    const credential = new AffindaCredential("02bfae960b3de66b98010fb3e18fc34ab0996c89")
    const client = new AffindaAPI(credential)

    // For each applicant extract their resume (api call to superparser)
    var itemsProcessed = 0;
    var totalItemsToBeProcessed = this.currentInternshipApplications?.length;
    console.log("The total number of applications is :", totalItemsToBeProcessed);

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
      var blob = new Blob([arrrayBuffer], { type: "application/pdf" });
      console.log("$$$$$$$$$$$$$$$2222222222", blob);

      client.createResume({ file: blob }).then((result: any) => {
        console.log("Returned resume data:");
        this.extractedResumeIdentifier = result.meta.identifier;
        console.dir(result);
        //Matchiing

        const resumeIdentifier = this.extractedResumeIdentifier;
        const jobDescriptionIdentifier = this.extractedJobIdentifier;
        //const indexName = "REPLACE_INDEX_NAME" // Optional

        client.getResumeSearchMatch(resumeIdentifier, jobDescriptionIdentifier).then((result: any) => {
          console.log("Returned match data:");
          console.dir(result);
          itemsProcessed++;
          console.log("The processed number of applications is :", itemsProcessed);

          if (result.score >= 0.5) {
            this.shortlistedApplicantsArray?.push(applicationResume);
          }
          if (itemsProcessed === totalItemsToBeProcessed) {
            //compare and get the top three candidates
            console.log("These are the final students recommended", this.shortlistedApplicantsArray);
            //get the recommended student details
            console.timeEnd("End of parser")

            this.shortlistedApplicantsArray?.forEach((recommendedStudent) => {

              this.userService.findByEmail(recommendedStudent.appliedBy).subscribe(
                (res) => {
                  this.loadingShortlisted = false;

                  this.shortlistedApplicantsDetails.push(res)
                
                  console.log("Final recommended student applications, ", this.shortlistedApplicantsDetails)
                },
                (err) => { console.log("Error fetching recommednded applicants details") }
              )

            })

          }
        }).catch((err: any) => {
          console.log("An error occurred while matching:")
          console.error(err)
        });

      }).catch((err: any) => {
        console.log("An error occurred while creating parse:");
        console.error(err);
      });
    });
    console.log("The final final processed number of applications is :", itemsProcessed);



  }
  getJobListingText() {
    this.loadingShortlisted = true;
    console.log("=========================");
    console.log("+++++", this.internshipDetails.url);


    this.gettext(this.internshipDetails.url).then((text: string) => {
      this.extractedAdvertText = text;
      console.log("Extracted Resume", this.extractedResume)

      this.extractResume();

    },
      function (reason: string) {
        console.error(reason);
      }
    );
  }
  gettext(pdfUrl: string) {
    this.loadingShortlisted = true;
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

  extractResume(): void {
    this.loadingShortlisted = true;

    // Get a list of applicants
    console.log("_+_+_+", this.currentInternshipApplications);

    // For each applicant extract their resume (api call to superparser)
    var itemsProcessed = 0;
    var totalItemsToBeProcessed = this.currentInternshipApplications?.length;

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
          'Authorization': 'wdZOdkP5qjKwqmONU0hV6po4nRpnAZm7z2B5WfVf',
          'x-api-key': 'wdZOdkP5qjKwqmONU0hV6po4nRpnAZm7z2B5WfVf',
        },
        body: fd,
      })
        .then(res => res.json())
        .then((json) => {
          this.extractedResume = json;
          //console.log("Extracted Resume", this.extractedResume)
          // Extract resume skills
          this.extractedResumeSkills = this.extractedResume.data.skills.overall_skills;
          console.log("Skills", this.extractedResumeSkills);
          console.log("Advert text", this.extractedAdvertText)

          // compare the extracted skills with the advert text

          this.extractedResumeSkills?.forEach((resumeSkill) => {
            if (this.extractedAdvertText.includes(resumeSkill)) {
              this.requirementCountMatch += 1;
            }
          })
          console.log("ijsdj9399999999999999999---------------")
          console.table({ name: applicationResume.name, matched: this.requirementCountMatch });


          const email = applicationResume?.appliedBy;
          const matchCount = this.requirementCountMatch;

          //push match points to array

          this.requirementMatchComparison.push({ email, matchCount })
          itemsProcessed++;
          console.log("processed", itemsProcessed);
          console.log("total", totalItemsToBeProcessed);


          if (itemsProcessed === totalItemsToBeProcessed) {
            //compare and get the top three candidates
            this.getShortlistedApplications();
          }

        })
        .catch(err => console.error(err))

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

  getShortlistedApplications(): void {
    this.loadingShortlisted = true;

    console.log("Comparing", this.requirementMatchComparison);

    const students = this.requirementMatchComparison;
    this.sortedArray = students.sort(compareMatchCount);
    console.log("Found length", this.sortedArray.length);

    console.log("Sorted", this.sortedArray);
    console.log("students applied");

    this.sortedArray?.forEach((studentCount: any) => {
      console.log("^^^^^^^^^^^^^^^^^^checking^^^^^6", studentCount);

      if (studentCount.matchCount === 0 || studentCount.matchCount === 1) {
        console.log("students applied have a low count", studentCount);

      }
      else {
        this.recommendedArray.push(studentCount);

      }
    })



    console.log("Recommended array to find details are", this.recommendedArray);

    //get the recommended student details
    this.recommendedArray.forEach((recommendedStudent) => {

      this.userService.findByEmail(recommendedStudent.email).subscribe(
        (res) => {
          this.loadingShortlisted = false;

          this.shortlistedApplicantsDetails.push(res)
          this.shortlistedApplicantsDetails.forEach((recommendedApplicantDetails: any) => {
            if (recommendedApplicantDetails.skills) {
              recommendedApplicantDetails.skillsList = recommendedApplicantDetails.skills.split(",");
            }
          })
          console.log("Final recommended student applications, ", this.shortlistedApplicantsDetails)
        },
        (err) => { console.log("Error fetching recommednded applicants details") }
      )

    })

    function compareMatchCount(a: any, b: any) {

      return b.matchCount - a.matchCount;
    }

  }


  getApplicationsByInternshipId(): void {
    this.loading = true;
    this.appliedInternship.getApplicationsByInternshipId(this.currentInternshipId).subscribe(
      (res) => {
        this.loading = false;
        console.log("found the following applications", res)
        this.currentInternshipApplications = res;
        //this.getResumeDescription();
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

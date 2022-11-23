import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createReadStream, writeFile } from 'fs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import {
  ApplyInternship,
  Status,
} from '../../apply-internship/apply-internship-model';
import {
  MinimumQualification,
  PostInternship,
} from '../../post-internships/post-internship-model';
import { Programme, UserBio } from '../../users/user-bio-model';
import { MatchComparisonModel } from './matchComparisonModel';
import { ResumeSearchParameters } from '@affinda/affinda';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.scss'],
})
export class ApplicantsComponent implements OnInit {
  constructor(
    protected appliedInternship: ApplyInternshipService,
    protected route: ActivatedRoute,
    protected userService: UserService,
    protected postInternship: PostInternshipService,
    protected router: Router
  ) {
    Chart.register(...registerables);
  }

  currentInternshipId!: number;
  currentInternshipApplications?: any[];
  applicantsEmailsOfCurrentInternship: any[] = [];
  applicantsDetails: any[] = [];
  // shortlistedApplicantsDetails: UserBio[] = [];
  approvedApplicantsDetails: UserBio[] = [];
  rejectedApplicantsDetails: UserBio[] = [];
  awaitingInterviewApplicantsDetails: UserBio[] = [];
  pendingApplicantsDetails: UserBio[] = [];
  shortlistedApplicantsDetails: any[] = [];
  searchApplicantsDetails!: any[];
  loading: boolean = true;
  loadingShortlisted: boolean = true;

  searchText: string = '';
  approvedApplicationForcurrentInternship?: ApplyInternship[] = [];
  rejectedApplicationForcurrentInternship?: ApplyInternship[] = [];
  awaitingInterviewApplicationForcurrentInternship?: ApplyInternship[] = [];
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
  shortlistedApplicantsArray: any[] = [];
  shortlistedApplicantsDetailsArray?: any[] = [];

  requirementCountMatch: number = 0;
  requirementMatchComparison: MatchComparisonModel[] = [];
  sortedArray: MatchComparisonModel[] = [];
  recommendedArray: MatchComparisonModel[] = [];
  showReport: boolean = false;
  //public chart: any;
  public chart?: any ;
  public skillsChart?: any ;
  public matchChart?: any ;
  public totalChart?: any;

  resultMatch: any;
  chartData: any[] = [];
  totalChartData: any[] = [];
  totalApplicationMatches: any[] = [];
  userEmail: any;
  userProfile?: any;
  srcPDF!: string;
  dateToday?: any;
  

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.currentInternshipId = params['id'];
      console.log(
        'We want to view profile of internship ',
        this.currentInternshipId
      );
    });
    this.getCurrentInternshipDetails();
    this.getCurrentUser();
    setTimeout(() => {
      //this.getJobListingText();
    }, 1000);
    this.dateToday = new Date()
  }
  ngOnDestroy(): void {
    console.log(this.chart);
    if(this.chart != undefined){
//@ts-ignore
this.chart.destroy();
    }
    if(this.totalChart != undefined){
      //@ts-ignore
      this.totalChart.destroy();
          }


    
   }
  // goToApplication(navigaationArray: any[]) {
  //   //@ts-ignore
  //   this.chart.destroy();
  //   // //@ts-ignore
  //   // window.chart2.destroy();
  //   setTimeout(() => {
  //     this.router.navigate(navigaationArray);
  //   }, 10);
  // }
  getCurrentUser(): void {
    console.log(
      'Current logged in username',
      JSON.parse(localStorage.getItem('currentUser')!).email
    );
    this.userEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res) => {
        // window.location.reload();
        console.log('User details is', res);
        this.userProfile = res;
      },
      (err) => {
        console.log('Error fetching current user details', err);
      }
    );
  }

  createReport(): void {
    this.createChart();
    // this.createSkillsChart();
    // this.createMatchChart();
     this.createTotalChart();
  }

  createChart(): void {
    var studentLabel = this.shortlistedApplicantsArray?.map(
      (studentLabel) => studentLabel.appliedBy
    );
    var skillMatch = this.chartData.map(
      (skillMatch) => skillMatch.details.skills.score
    );
    var totalMatch = this.chartData.map((totalMatch) => totalMatch.score);

    console.log('Here are the totalMatch to be created', totalMatch);

    //@ts-ignore
   this.chart= window.chart1 = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: studentLabel,
        datasets: [
          {
            label: 'Skill Match',
            data: skillMatch,
            backgroundColor: 'blue',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
    }
  createSkillsChart(): void {
    var studentLabel = this.shortlistedApplicantsArray?.map(
      (studentLabel) => studentLabel.appliedBy
    );
    var skillMatch = this.chartData.map(
      (skillMatch) => skillMatch.details.skills.score
    );
    console.log('Here are the skillMatch to be created', skillMatch);

    if (this.shortlistedApplicantsArray.length != 0) {
      //@ts-ignore
      window.chart2 = new Chart('skillsChart', {
        type: 'pie', //this denotes tha type of chart

        data: {
          // values on X-Axis

          labels: studentLabel,
          datasets: [
            {
              label: 'Skill Match',
              data: skillMatch,
              backgroundColor: 'blue',
            },
          ],
        },

        options: {
          aspectRatio: 2.5,
        },
      });
    }
  }
  createMatchChart(): void {
    var studentLabel = this.shortlistedApplicantsArray?.map(
      (studentLabel) => studentLabel.appliedBy
    );
    var totalContentMatch = this.chartData.map(
      (totalContentMatch) => totalContentMatch.score
    );
    console.log(
      'Here are the totalContentMatch to be created',
      totalContentMatch
    );

    if (this.shortlistedApplicantsArray.length != 0) {
      this.matchChart = new Chart('matchChart', {
        type: 'pie', //this denotes tha type of chart

        data: {
          // values on X-Axis

          labels: studentLabel,
          datasets: [
            {
              label: 'Total Match',
              data: totalContentMatch,
              backgroundColor: 'limegreen',
            },
          ],
        },

        options: {
          aspectRatio: 2.5,
        },
      });
    }
  }
  createTotalChart(): void {
    var studentLabel = this.totalApplicationMatches?.map(
      (studentLabel) => studentLabel.appliedBy
    );
    var skillMatch = this.totalChartData.map(
      (skillMatch) => skillMatch.details.skills.score
    );
    var totalApplicantsMatch = this.totalChartData.map(
      (totalApplicantsMatch) => totalApplicantsMatch.score
    );
//@ts-ignore
   this.totalChart=window.chart2 = new Chart('totalChart', {
      type: 'bar', //this denotes tha type of chart

      data: {
        // values on X-Axis

        labels: studentLabel,
        datasets: [
          {
            label: 'Skill Match',
            data: skillMatch,
            backgroundColor: 'blue',
          },
          {
            label: 'Total Match',
            data: totalApplicantsMatch,
            backgroundColor: 'limegreen',
          },
        ],
      },

      options: {
        aspectRatio: 2.5,
      },
    });
  }

  getCurrentInternshipDetails(): void {
    this.postInternship.findAdvertById(this.currentInternshipId).subscribe(
      (res) => {
        this.internshipDetails = res;
        this.getApplicationsByInternshipId();

        console.log('This interenship was posted by', this.internshipDetails);
        //this.getJobDescription();
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
          var blob = new Blob([arrrayBuffer], { type: 'application/pdf' });
          this.srcPDF = window.URL.createObjectURL(blob);
          console.log('Testing pdf ***********', this.srcPDF);

          // window.open(this.src,'height=650,width=840');
        }
      },
      (err) => {
        console.log('error fetching internship details');
      }
    );
  }
  getMatchingApplications(): void {
    this.loadingShortlisted = true;
    console.log('_+_+_+', this.currentInternshipApplications);
    if (this.currentInternshipApplications?.length === 0) {
      this.loadingShortlisted = false;
      this.showReport = true;
    } else {
      const {
        AffindaCredential,
        TokenCredential,
        AffindaAPI,
      } = require('@affinda/affinda/');

      const credential = new AffindaCredential(
        '02bfae960b3de66b98010fb3e18fc34ab0996c89'
      );
      const client = new AffindaAPI(credential);
      var itemsProcessed = 0;
      var totalItemsToBeProcessed = this.currentInternshipApplications?.length;

      this.currentInternshipApplications?.forEach(async (applicationResume) => {
        const resumeIdentifier = applicationResume.parsedApplicationIdentifier;
        const jobDescriptionIdentifier =
          this.internshipDetails.parsedJobIdentifier;
        console.log(
          'These are the job identifiers found :',
          resumeIdentifier,
          'and job identifier',
          jobDescriptionIdentifier
        );

        //const indexName = "REPLACE_INDEX_NAME" // Optional

        client
          .getResumeSearchMatch(resumeIdentifier, jobDescriptionIdentifier)
          .then((result: any) => {
            console.log('Returned match data:');
            console.dir(result);
            this.totalChartData.push(result);
            this.totalApplicationMatches.push(applicationResume);
            this.resultMatch = result;
            itemsProcessed++;
            console.log(
              'The processed number of applications is :',
              itemsProcessed
            );

            if (result.score >= 0.1) {
              this.shortlistedApplicantsArray?.push(applicationResume);
              console.log(
                ' final  skiill score student applications match testing, ',
                result.details.skills.score
              );
              console.log(
                ' final  total score student applications match testing, ',
                result.score
              );
              this.chartData.push(result);
            }
            if (this.shortlistedApplicantsArray.length === 0) {
              this.loadingShortlisted = false;
            }

            if (itemsProcessed === totalItemsToBeProcessed) {
              //compare and get the top three candidates
              console.log(
                'These are the final students recommended',
                this.shortlistedApplicantsArray
              );
              //get the recommended student details

              this.shortlistedApplicantsArray?.forEach((recommendedStudent) => {
                this.userService
                  .findByEmail(recommendedStudent.appliedBy)
                  .subscribe(
                    (res) => {
                      this.loadingShortlisted = false;

                      res.resumeFeedback = recommendedStudent.status;

                      this.shortlistedApplicantsDetails.push(res);
                    },
                    (err) => {
                      console.log(
                        'Error fetching recommednded applicants details'
                      );
                    }
                  );
              });

              this.showReport = true;

              console.log('Now showing report after all charts');
            }
          })
          .catch((err: any) => {
            console.log('An error occurred while matching:');
            console.error(err);
          });
      });

      console.log(
        'The final final processed number of applications is :',
        itemsProcessed
      );
    }
  }

  getJobDescription(): void {
    console.log(
      '***^^^^^^^^^^%%%%%%%%%%url to our file',
      this.internshipDetails.url
    );

    const { AffindaCredential, AffindaAPI } = require('@affinda/affinda');

    const credential = new AffindaCredential(
      '02bfae960b3de66b98010fb3e18fc34ab0996c89'
    );
    const client = new AffindaAPI(credential);

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
    var blob = new Blob([arrrayBuffer], { type: 'application/pdf' });

    console.log('$$$$$$$$$$$$$$$', blob);

    console.time('User Login');
    client
      .createJobDescription({ file: blob })
      .then((result: any) => {
        console.log('Returned job data:');
        console.dir(result);
        console.log('Returned job data skills only:');
        console.timeEnd('User Login');
        this.extractedJobDescriptionSkills = result.data.skills;
        this.extractedJobIdentifier = result.meta.identifier;

        console.log('Returned job identifier:', this.extractedJobIdentifier);

        console.dir(this.extractedJobDescriptionSkills);
        this.getResumeDescription();
      })
      .catch((err: any) => {
        console.log('An error occurred:');
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
    console.time('End of parser');
    // Get a list of applicants
    console.log('_+_+_+', this.currentInternshipApplications);

    const {
      AffindaCredential,
      TokenCredential,
      AffindaAPI,
    } = require('@affinda/affinda/');

    const credential = new AffindaCredential(
      '02bfae960b3de66b98010fb3e18fc34ab0996c89'
    );
    const client = new AffindaAPI(credential);

    // For each applicant extract their resume (api call to superparser)
    var itemsProcessed = 0;
    var totalItemsToBeProcessed = this.currentInternshipApplications?.length;
    console.log(
      'The total number of applications is :',
      totalItemsToBeProcessed
    );

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
      var blob = new Blob([arrrayBuffer], { type: 'application/pdf' });
      console.log('$$$$$$$$$$$$$$$2222222222', blob);

      client
        .createResume({ file: blob })
        .then((result: any) => {
          console.log('Returned resume data:');
          this.extractedResumeIdentifier = result.meta.identifier;
          console.dir(result);
          //Matchiing

          const resumeIdentifier = this.extractedResumeIdentifier;
          const jobDescriptionIdentifier = this.extractedJobIdentifier;
          //const indexName = "REPLACE_INDEX_NAME" // Optional

          client
            .getResumeSearchMatch(resumeIdentifier, jobDescriptionIdentifier)
            .then((result: any) => {
              console.log('Returned match data:');
              console.dir(result);
              itemsProcessed++;
              console.log(
                'The processed number of applications is :',
                itemsProcessed
              );

              if (result.score >= 0.5) {
                this.shortlistedApplicantsArray?.push(applicationResume);
              }
              if (itemsProcessed === totalItemsToBeProcessed) {
                //compare and get the top three candidates
                console.log(
                  'These are the final students recommended',
                  this.shortlistedApplicantsArray
                );
                //get the recommended student details
                console.timeEnd('End of parser');

                this.shortlistedApplicantsArray?.forEach(
                  (recommendedStudent) => {
                    this.userService
                      .findByEmail(recommendedStudent.appliedBy)
                      .subscribe(
                        (res) => {
                          this.loadingShortlisted = false;

                          res.resumeFeedback = recommendedStudent.status;

                          this.shortlistedApplicantsDetails.push(res);

                          console.log(
                            'Final recommended student applications, ',
                            this.shortlistedApplicantsDetails
                          );
                        },
                        (err) => {
                          console.log(
                            'Error fetching recommednded applicants details'
                          );
                        }
                      );
                  }
                );
              }
            })
            .catch((err: any) => {
              console.log('An error occurred while matching:');
              console.error(err);
            });
        })
        .catch((err: any) => {
          console.log('An error occurred while creating parse:');
          console.error(err);
        });
    });
    console.log(
      'The final final processed number of applications is :',
      itemsProcessed
    );
  }
  getJobListingText() {
    this.loadingShortlisted = true;
    console.log('=========================');
    console.log('+++++', this.internshipDetails.url);

    this.gettext(this.internshipDetails.url).then(
      (text: string) => {
        this.extractedAdvertText = text;
        console.log('Extracted Resume', this.extractedResume);

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
    return pdf.promise.then(function (pdf: any) {
      // get all pages text
      var maxPages = pdf.numPages;
      var countPromises = []; // collecting all page promises
      for (var j = 1; j <= maxPages; j++) {
        var page = pdf.getPage(j);

        var txt = '';
        countPromises.push(
          page.then(function (page: any) {
            // add page promise
            var textContent = page.getTextContent();
            return textContent.then(function (text: any) {
              // return content promise
              return text.items
                .map(function (s: any) {
                  return s.str;
                })
                .join(''); // value page text
            });
          })
        );
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
    console.log('_+_+_+', this.currentInternshipApplications);

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
      var pdf = new File([arrrayBuffer], applicationResume.name, {
        type: applicationResume.type,
      });
      console.log(
        '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
      );
      const fd = new FormData();
      fd.append('file', pdf);

      // send `POST` request
      fetch('https://api.superparser.com/parse', {
        method: 'POST',
        headers: {
          Authorization: 'wdZOdkP5qjKwqmONU0hV6po4nRpnAZm7z2B5WfVf',
          'x-api-key': 'wdZOdkP5qjKwqmONU0hV6po4nRpnAZm7z2B5WfVf',
        },
        body: fd,
      })
        .then((res) => res.json())
        .then((json) => {
          this.extractedResume = json;
          //console.log("Extracted Resume", this.extractedResume)
          // Extract resume skills
          this.extractedResumeSkills =
            this.extractedResume.data.skills.overall_skills;
          console.log('Skills', this.extractedResumeSkills);
          console.log('Advert text', this.extractedAdvertText);

          // compare the extracted skills with the advert text

          this.extractedResumeSkills?.forEach((resumeSkill) => {
            if (this.extractedAdvertText.includes(resumeSkill)) {
              this.requirementCountMatch += 1;
            }
          });
          console.log('ijsdj9399999999999999999---------------');
          console.table({
            name: applicationResume.name,
            matched: this.requirementCountMatch,
          });

          const email = applicationResume?.appliedBy;
          const matchCount = this.requirementCountMatch;

          //push match points to array

          this.requirementMatchComparison.push({ email, matchCount });
          itemsProcessed++;
          console.log('processed', itemsProcessed);
          console.log('total', totalItemsToBeProcessed);

          if (itemsProcessed === totalItemsToBeProcessed) {
            //compare and get the top three candidates
            this.getShortlistedApplications();
          }
        })
        .catch((err) => console.error(err));
    });
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

    console.log('Comparing', this.requirementMatchComparison);

    const students = this.requirementMatchComparison;
    this.sortedArray = students.sort(compareMatchCount);
    console.log('Found length', this.sortedArray.length);

    console.log('Sorted', this.sortedArray);
    console.log('students applied');

    this.sortedArray?.forEach((studentCount: any) => {
      console.log('^^^^^^^^^^^^^^^^^^checking^^^^^6', studentCount);

      if (studentCount.matchCount === 0 || studentCount.matchCount === 1) {
        console.log('students applied have a low count', studentCount);
      } else {
        this.recommendedArray.push(studentCount);
      }
    });

    console.log('Recommended array to find details are', this.recommendedArray);

    //get the recommended student details
    this.recommendedArray.forEach((recommendedStudent) => {
      this.userService.findByEmail(recommendedStudent.email).subscribe(
        (res) => {
          this.loadingShortlisted = false;

          this.shortlistedApplicantsDetails.push(res);
          this.shortlistedApplicantsDetails.forEach(
            (recommendedApplicantDetails: any) => {
              if (recommendedApplicantDetails.skills) {
                recommendedApplicantDetails.skillsList =
                  recommendedApplicantDetails.skills.split(',');
              }
            }
          );
          console.log(
            'Final recommended student applications, ',
            this.shortlistedApplicantsDetails
          );
        },
        (err) => {
          console.log('Error fetching recommednded applicants details');
        }
      );
    });

    function compareMatchCount(a: any, b: any) {
      return b.matchCount - a.matchCount;
    }
  }

  getApplicationsByInternshipId(): void {
    this.appliedInternship
      .getApplicationsByInternshipId(this.currentInternshipId)
      .subscribe(
        (res) => {
          console.log('found the following applications', res);
          this.currentInternshipApplications = res;
          this.getMatchingApplications();
          //get emails of applicants
          this.currentInternshipApplications?.forEach(
            (currentInternshipApplication) => {
              //get details of applicants
              this.userService
                .findByEmail(currentInternshipApplication.appliedBy)
                .subscribe(
                  (res) => {
                    res.resumeFeedback = currentInternshipApplication.status;

                    this.applicantsDetails.push(res);
                    this.applicantsDetails.forEach((applicantDetails: any) => {
                      if (applicantDetails.skills) {
                        applicantDetails.skillsList =
                          applicantDetails.skills.split(',');
                      }
                    });

                    console.log(
                      'All Applicants details are',
                      this.applicantsDetails
                    );
                  },
                  (err) => {
                    console.log('Error fetching applicants details');
                  }
                );

              if (currentInternshipApplication.status === Status.APPROVED) {
                this.approvedApplicationForcurrentInternship?.push(
                  currentInternshipApplication
                );
              } else if (
                currentInternshipApplication.status === Status.REJECTED
              ) {
                this.rejectedApplicationForcurrentInternship?.push(
                  currentInternshipApplication
                );
              } else if (
                currentInternshipApplication.status === Status.PENDINGINTERVIEW
              ) {
                this.awaitingInterviewApplicationForcurrentInternship?.push(
                  currentInternshipApplication
                );
              } else {
                this.pendingApplicationForcurrentInternship?.push(
                  currentInternshipApplication
                );
              }
            }
          );

          // console.log("Approved application details are, ", this.approvedApplicationForcurrentInternship)
          // console.log("Rejected application details are, ", this.rejectedApplicationForcurrentInternship)
          // console.log("Pending application details are, ", this.pendingApplicationForcurrentInternship)

          this.approvedApplicationForcurrentInternship?.forEach(
            (approvedApplication) => {
              this.userService
                .findByEmail(approvedApplication.appliedBy)
                .subscribe(
                  (res) => {
                    this.approvedApplicantsDetails.push(res);
                    this.approvedApplicantsDetails.forEach(
                      (approvedApplicantDetails: any) => {
                        if (approvedApplicantDetails.skills) {
                          approvedApplicantDetails.skillsList =
                            approvedApplicantDetails.skills.split(',');
                        }
                      }
                    );
                    console.log(
                      'Approved Applicants details are, ',
                      this.approvedApplicantsDetails
                    );
                  },
                  (err) => {
                    console.log('Error fetching approved applicants details');
                  }
                );
            }
          );
          this.awaitingInterviewApplicationForcurrentInternship?.forEach(
            (awaitingInterviewApplication) => {
              this.userService
                .findByEmail(awaitingInterviewApplication.appliedBy)
                .subscribe(
                  (res) => {
                    this.awaitingInterviewApplicantsDetails.push(res);
                    this.awaitingInterviewApplicantsDetails.forEach(
                      (awaitingInterviewApplicantDetails: any) => {
                        if (awaitingInterviewApplicantDetails.skills) {
                          awaitingInterviewApplicantDetails.skillsList =
                            awaitingInterviewApplicantDetails.skills.split(',');
                        }
                      }
                    );
                    console.log(
                      'Pending interview Applicants details are, ',
                      this.awaitingInterviewApplicantsDetails
                    );
                  },
                  (err) => {
                    console.log(
                      'Error fetching pending interview applicants details'
                    );
                  }
                );
            }
          );
          this.rejectedApplicationForcurrentInternship?.forEach(
            (rejectedApplication) => {
              this.userService
                .findByEmail(rejectedApplication.appliedBy)
                .subscribe(
                  (res) => {
                    this.rejectedApplicantsDetails.push(res);
                    this.rejectedApplicantsDetails.forEach(
                      (rejectedApplicantDetails: any) => {
                        if (rejectedApplicantDetails.skills) {
                          rejectedApplicantDetails.skillsList =
                            rejectedApplicantDetails.skills.split(',');
                        }
                      }
                    );
                    console.log(
                      'Rejected Applicants details are, ',
                      this.rejectedApplicantsDetails
                    );
                  },
                  (err) => {
                    console.log('Error fetching rejected applicants details');
                  }
                );
            }
          );
          this.pendingApplicationForcurrentInternship?.forEach(
            (pendingApplication) => {
              this.userService
                .findByEmail(pendingApplication.appliedBy)
                .subscribe(
                  (res) => {
                    this.pendingApplicantsDetails.push(res);
                    this.pendingApplicantsDetails.forEach(
                      (pendingApplicantDetails: any) => {
                        if (pendingApplicantDetails.skills) {
                          pendingApplicantDetails.skillsList =
                            pendingApplicantDetails.skills.split(',');
                        }
                      }
                    );
                    console.log(
                      'pending Applicants details are, ',
                      this.pendingApplicantsDetails
                    );
                  },
                  (err) => {
                    console.log('Error fetching pending applicants details');
                  }
                );
            }
          );
          console.log('All provesses finished');

          this.loading = false;
        },
        (err) => {
          console.log('Could not find any applications');
        }
      );
  }

  searchApplicant(): void {
    this.loading = true;
    this.appliedInternship.searchApplicant(this.searchText).subscribe(
      (result) => {
        this.loading = false;
        this.searchApplicantsDetails = result;
        console.log('lets see:', this.searchApplicantsDetails);

        this.searchApplicantsDetails.forEach((searchApplicantsDetail: any) => {
          if (
            searchApplicantsDetail.internshipId === this.currentInternshipId
          ) {
            if (searchApplicantsDetail.skills) {
              searchApplicantsDetail.skillsList =
                searchApplicantsDetail.skills.split(',');
            }
            this.applicantsDetails = [];
            this.applicantsDetails.push(searchApplicantsDetail);
            console.log('Search produces users:', this.applicantsDetails);
          }
        });
      },
      (error) => {
        console.error('error getting searched user', error);
      }
    );
  }
}

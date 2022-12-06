import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship, Status } from '../../apply-internship/apply-internship-model';
import { AdvertDetails, Domain, Period } from '../../post-internships/advert-details-model';
import { InternshipStatus, PostInternship } from '../../post-internships/post-internship-model';
import { Course, UserBio } from '../../users/user-bio-model';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

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
  loading = true;
  studentLoading = true;
  filterLoading = false;


  searchText: string = '';
  filterText: string = '';

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

  internshipsPostedByMe: any[] = [];
  activeInternshipsPostedByMe: AdvertDetails[] = [];
  closedInternshipsPostedByMe: AdvertDetails[] = [];
  internships: AdvertDetails[] = [];
  allPostedInternships: AdvertDetails[] = [];
  allInternships!: any[];
  applications!: ApplyInternship[];
  differenceInDays: any;
  differenceInCreationDays: any;
  differenceSearchInCreationDays: any;
  differenceFilterInCreationDays: any;

  datePostedOn: any;

  dateToday?: any;
  applicationsAppliedToMe: ApplyInternship[] = [];
  totalApplicationsAppliedToMe: ApplyInternship[] = [];
  approvedApplicationsAppliedToMe: ApplyInternship[] = [];
  showReport: boolean = false;
  numberOfSpecificApplications?: number;
  specificApplicationsAppliedToMeArray: any[] = [];
  specificApprovalsAppliedToMeArray: any[] = [];


  reportFilterDateRange = {
    startDate: '',
    endDate: ''
  }
  reloadedInternships: any[] = [];


  today?: any;




  deleteId: any;
  deleteTitle: any;
  //today = new Date().toJSON().slice(0, 10)
  //date?: string
  fileInfos?: Observable<any>;

  domains = [Domain.BUSINESS, Domain.ENGINEERING, Domain.TECH, Domain.BUILDING, Domain.HOSPITALITY, Domain.TELECOMS, Domain.TEACHING];
  periods = [Period.JAN, Period.MAY, Period.JULY]


  async ngOnInit(): Promise<void> {
    //this.findAllinternships();
    await this.getCurrentLoggedInUsername();
    this.findAllAdverts();
    this.getBioDetails();
    //this.getPostedInternshipByMe();
    //this.getUsername2();
    this.getAdvertsPotedByMe();
    this.fileInfos = this.postInternshipService.getFiles();
    this.dateToday = new Date()
    this.today = new Date().toISOString().split('T')[0];


  }

  getAdvertsPotedByMe() {
    this.postInternshipService.getFiles().subscribe(
      (res) => {
        this.allPostedInternships = res;

        console.log("all internhsip posted are", this.allPostedInternships)

        this.allPostedInternships.forEach((internship: any) => {
          //Teporary hold for created on date:
          internship['createdOnDate'] = internship.createdOn;
          // internship.size = internship.createdOn;
          let currentDate = new Date(new Date().toJSON().slice(0, 10))
          var createdOn = new Date(internship.createdOn);
          // To calculate the time difference of two dates
          var differenceInTime = currentDate.getTime() - createdOn.getTime();
          // To calculate the no. of days between two dates
          this.differenceInDays = differenceInTime / (1000 * 3600 * 24);
          console.log("the New creation daTE IS ", createdOn)
          console.log("todays date is ", currentDate)
          console.log("Difference in dayS ", this.differenceInDays)
          console.log("Difference in time ", differenceInTime)
          internship.createdOn = this.differenceInDays;
          if (internship.companyEmail === this.userEmail) {
            this.internshipsPostedByMe.push(internship);
            console.log("################################################################")
          }
        })
        console.log("internhsip details internshipsPostedByMe are ", this.internshipsPostedByMe)
        console.log("applicationsAppliedToMe details are ", this.applicationsAppliedToMe)




        //get total applications for each internship
        this.internshipsPostedByMe.forEach((internship: any) => {
          internship['applicationsCount'] = this.applicationsAppliedToMe.filter(application => application.internshipId == internship.id).length
          internship['approvedCount'] = this.applicationsAppliedToMe.filter(application => application.internshipId == internship.id).filter(application => application.status === 'APPROVED').length
        })
        console.log("-------------------=====================")
        console.log(this.internshipsPostedByMe);
        console.log("Length of internships posted by me", this.internshipsPostedByMe.length)
        this.reloadedInternships = this.internshipsPostedByMe;

        if (this.internshipsPostedByMe.length === 0) {
          console.log("You have not posted any internhsip")
          setTimeout(() => {
            this.loading = false;

          }, 2000)


        }
        else {
          let index = 0;
          let totalIndex = this.internshipsPostedByMe.length;
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
            index++;
            if (index === totalIndex) {
              this.loading = false

            }
          })


        }


      },
      (err) => { console.log("error fetching all internhips", err) }
    )
  }
  findAllAdverts(): void {
    this.studentLoading = true;
    this.postInternshipService.getFiles().subscribe(
      (res) => {
        let date = new Date().toJSON().slice(0, 10);

        this.studentLoading = true;
        console.log("Found all internships ", res)
        this.allInternships = res;

        console.log("Found all internships testing ", this.allInternships)




        this.allInternships.forEach((internship) => {
          console.log("Testing dates", internship.reportingDate >= date && internship.internshipStatus === InternshipStatus.CLOSED);


          if (internship.reportingDate >= date && internship.internshipStatus === InternshipStatus.CLOSED) {
            internship.internshipStatus = InternshipStatus.ACTIVE;
            console.log("About to update the intenship back to active ", internship)

            this.postInternshipService.updateAdvertDetails(internship.id, internship).subscribe(
              (event: any) => {

                if (event instanceof HttpResponse) {
                  var message = event.body.message;
                  console.log("Message");



                }
              },
              (err) => {
                console.log("error updating internship", err)
              }
            )
          }

          if (internship.internshipStatus === InternshipStatus.ACTIVE) {
            let currentDate = new Date(new Date().toJSON().slice(0, 10))
            var createdOn = new Date(internship.createdOn);
            // To calculate the time difference of two dates
            var differenceInTime = currentDate.getTime() - createdOn.getTime();
            // To calculate the no. of days between two dates
            this.differenceInCreationDays = differenceInTime / (1000 * 3600 * 24);
            console.log("the New creation daTE IS ", createdOn)
            console.log("todays date is ", currentDate)
            console.log("Difference in dayS ", this.differenceInCreationDays)
            console.log("Difference in time ", differenceInTime)
            internship.createdOn = this.differenceInCreationDays;
            this.internships.push(internship)
          }
        })
        console.log("Found ********88 testing ", this.internships)
        this.studentLoading = false;


        console.log("Found active internships ", this.internships)
        console.log("Found active internships current date ", date)

        this.internships.forEach((internship: any) => {
          console.log("Found active internships set date ", internship.reportingDate)

          if (internship.reportingDate < date && internship.internshipStatus === InternshipStatus.ACTIVE) {
            internship.internshipStatus = InternshipStatus.CLOSED;
            console.log("About to update the intenship to closed ", internship)

            this.postInternshipService.updateAdvertDetails(internship.id, internship).subscribe(
              (event: any) => {

                if (event instanceof HttpResponse) {
                  var message = event.body.message;
                  console.log("Message");



                }
              },
              (err) => {
                console.log("error updating internship", err)
              }
            )
          }


          this.applyInternship.getApplicationsByAppliedBy(this.userEmail).subscribe(
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



  async getCurrentLoggedInUsername(): Promise<void> {
    console.log("Current logged in user token", this.tokenService.getToken());
    console.log("Current logged in username and token ", this.tokenService.getUsername());
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail = JSON.parse(localStorage.getItem('currentUser')!).email
    await this.findApplicationsAppliedToMe()
  }

  getBioDetails(): void {
    this.userService.findByEmail(this.userEmail).subscribe(
      (res) => {
        this.userBioDetail = res;
        console.log("Found user details", this.userBioDetail)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // getPostedInternshipByMe(): void {
  //   this.loading = true;
  //   this.postInternshipService.findAll().subscribe(
  //     (res) => {
  //       this.allPostedInternships = res;
  //       console.log("all internhsip posted are", this.allPostedInternships)

  //       this.allPostedInternships.forEach((internship: any) => {
  //         if (internship.companyEmail === this.userEmail) {
  //           this.internshipsPostedByMe.push(internship);
  //           console.log("internhsip details i have posted are are", this.internshipsPostedByMe)

  //         }

  //         this.loading = false;

  //       })
  //       console.log("Length of internships posted by me", this.internshipsPostedByMe.length)
  //       if (this.internshipsPostedByMe.length === 0) {
  //         console.log("You have not posted any internhsip")

  //       }
  //       else {
  //         this.internshipsPostedByMe.forEach((internshipPostedByMe: any) => {
  //           if (internshipPostedByMe.internshipStatus === InternshipStatus.ACTIVE) {
  //             this.activeInternshipsPostedByMe.push(internshipPostedByMe)
  //             console.log("Active internships posted by me are", this.activeInternshipsPostedByMe)
  //           }
  //           else if (internshipPostedByMe.internshipStatus === InternshipStatus.CLOSED) {
  //             this.closedInternshipsPostedByMe.push(internshipPostedByMe)
  //             console.log("Closed internships posted by me are", this.closedInternshipsPostedByMe)

  //           }
  //           else { console.log("No status found") }

  //         })
  //       }

  //     },
  //     (err) => { console.log("error fetching all internhips", err) }
  //   )

  // }
  searchAdvert(): void {
    this.loading = true;
    console.log("Findinnnnnnnng ", this.searchText)
    this.postInternshipService.searchAdvert(this.searchText).subscribe(
      result => {
        this.loading = false;
        this.internships = result;
        let date = new Date().toJSON().slice(0, 10);
        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date) {
            internship.skillsList = internship.skills.split(",");
            internship.internshipStatus = InternshipStatus.CLOSED;
          }
          let currentDate = new Date(new Date().toJSON().slice(0, 10))
          var createdOn = new Date(internship.createdOn);
          // To calculate the time difference of two dates
          var differenceInTime = currentDate.getTime() - createdOn.getTime();
          // To calculate the no. of days between two dates
          this.differenceSearchInCreationDays = differenceInTime / (1000 * 3600 * 24);
          console.log("the New creation daTE IS ", createdOn)
          console.log("todays date is ", currentDate)
          console.log("Difference in dayS ", this.differenceSearchInCreationDays)
          console.log("Difference in time ", differenceInTime)
          internship.createdOn = this.differenceSearchInCreationDays;
        });
        console.log("Search produces internships:", this.internships)
      },
      error => {
        console.error('error getting searched internship', error);
      }
    )
  }
  filterAdvert(value: string): void {
    this.loading = true;
    this.studentLoading = true;
    this.filterText = value;
    console.log("filtering ", this.filterText)
    console.log("user course study is ", this.userBioDetail?.course)
    if (this.filterText === '(Recommended)') {
      if (this.userBioDetail?.course === Course.BCOM || this.userBioDetail?.course === Course.BUSINESS) {
        this.filterText = Domain.BUSINESS

      }
      else if (this.userBioDetail?.course === Course.CS || this.userBioDetail?.course === Course.IT) {
        this.filterText = Domain.TECH
      }
    }
    console.log("final filtering ", this.filterText)


    // if(this.filterText == 'All'){
    //   this.findAllAdverts();
    // }
    this.postInternshipService.filterAdvert(this.filterText).subscribe(
      result => {
        this.loading = false;
        this.studentLoading = false;
        this.internships = result;
        let date = new Date().toJSON().slice(0, 10);
        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date) {
            internship.skillsList = internship.skills.split(",");
            internship.internshipStatus = InternshipStatus.CLOSED;
          }
          let currentDate = new Date(new Date().toJSON().slice(0, 10))
          var createdOn = new Date(internship.createdOn);
          // To calculate the time difference of two dates
          var differenceInTime = currentDate.getTime() - createdOn.getTime();
          // To calculate the no. of days between two dates
          this.differenceFilterInCreationDays = differenceInTime / (1000 * 3600 * 24);
          console.log("the New creation daTE IS ", createdOn)
          console.log("todays date is ", currentDate)
          console.log("Difference in dayS ", this.differenceFilterInCreationDays)
          console.log("Difference in time ", differenceInTime)
          internship.createdOn = this.differenceFilterInCreationDays
        });
        console.log("filter produces internships:", this.internships)
      },
      error => {
        console.error('error getting filteres internship', error);
      }
    )
  }
  softDelete(title: any, id: any): void {
    this.deleteId = id;
    this.deleteTitle = title;
  }

  deleteAdvert(id: any): void {
    console.log("Deleting advert of id", id);
    this.postInternshipService.deleteAdvert(id).subscribe(
      (res) => {
        console.log("Deleted advert")
        window.location.reload();
      },
      (err) => { console.log("Error deleting advert") }
    )

  }
  findTotalOccurrence(arr: any, key: any): any {

    arr.forEach((x: any) => {

      // Checking if there is any object in arr2
      // which contains the key value
      if (this.specificApplicationsAppliedToMeArray.some((val) => { return val[key] == x[key] })) {
        // If yes! then increase the occurrence by 1
        this.specificApplicationsAppliedToMeArray.forEach((k) => {
          if (k[key] === x[key]) {
            k["occurrence"]++
          }
        })

      } else {
        // If not! Then create a new object initialize 
        // it with the present iteration key's value and 
        // set the occurrence to 1
        let a: any = {}
        a[key] = x[key]
        a["occurrence"] = 1
        this.specificApplicationsAppliedToMeArray.push(a);
      }
    })

    return this.specificApplicationsAppliedToMeArray
  }
  findApprovalOccurrence(arr: any, key: any): any {

    arr.forEach((x: any) => {

      // Checking if there is any object in arr2
      // which contains the key value
      if (this.specificApprovalsAppliedToMeArray.some((val) => { return val[key] == x[key] })) {
        // If yes! then increase the occurrence by 1
        this.specificApprovalsAppliedToMeArray.forEach((k) => {
          if (k[key] === x[key]) {
            k["occurrence"]++
          }
        })

      } else {
        // If not! Then create a new object initialize 
        // it with the present iteration key's value and 
        // set the occurrence to 1
        let a: any = {}
        a[key] = x[key]
        a["occurrence"] = 1
        this.specificApprovalsAppliedToMeArray.push(a);
      }
    })

    return this.specificApprovalsAppliedToMeArray
  }
  findApplicationsAppliedToMe(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.applyInternship.getApplicationsWithPostedBy(this.userEmail).subscribe(
        (res) => {
          this.showReport = true;
          console.log("These are the applications under my name", res);
          let key = "internshipId"

          console.log("Final count arrsy", this.findTotalOccurrence(res, key))

          this.applicationsAppliedToMe = res;

          this.applicationsAppliedToMe.forEach((applicationAppliedToMe) => {

            if (applicationAppliedToMe.status === Status.APPROVED) {
              this.approvedApplicationsAppliedToMe.push(applicationAppliedToMe)

            }
          })
          console.log("These are the applications under my name", res);
          let key2 = "internshipId"
          console.log("Final count recommended arrsy", this.findApprovalOccurrence(this.approvedApplicationsAppliedToMe, key2))
          resolve()
        },
        (err) => {
          console.log("Error whoop whoop whoop");
        }
      )
    })
  }
  savePdf() {
    let DATA: any = document.getElementById('report');
    html2canvas(DATA, { logging: true, allowTaint: true, useCORS: true }).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/*');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'image/*', 0, position, fileWidth, fileHeight);
      PDF.save('report.pdf');
    });


  }
  filterReportByDate(): void {
    this.loading = true;
    this.studentLoading = true;
    this.filterLoading = true

    console.log("We will be filtering reportfor these,  ", this.internshipsPostedByMe);


    // Define the start and end dates for the date range
    const startDate = this.reportFilterDateRange.startDate;
    const endDate = this.reportFilterDateRange.endDate;
    console.log("We will be filtering reportfor these dates,  ", startDate, " and end", endDate);
    // Filter the array of report objects using the `Array.prototype.filter()` method
    this.reloadedInternships = this.internshipsPostedByMe.filter(report => {
      // Check if the date of the current report falls within the specified date range
      return report.createdOnDate >= startDate && report.createdOnDate <= endDate;
    });
    console.log("These are the filtered matches", this.reloadedInternships);
    console.log("These are the filter loading lastt", this.filterLoading);

    this.loading = false;
    this.studentLoading = false;
    this.filterLoading = false
    console.log("These are the filter loading lastttttttttttttt", this.filterLoading);

  }
  reloadAllPostedAdvertsByMe(): void {
    this.reset();
    console.log("What about", this.reloadedInternships);
    this.reloadedInternships = this.internshipsPostedByMe;

  }
  reset(): void {
    this.reportFilterDateRange = {
      startDate: '',
      endDate: ''
    }

  }

  // findAllinternships(): void {
  //   this.loading = true;
  //   this.postInternshipService.findAll().subscribe(
  //     (res) => {
  //       this.loading = true;
  //       this.loading = false;
  //       console.log("Found all internships ", res)
  //       this.allInternships = res;

  //       this.allInternships.forEach((internship) => {
  //         if (internship.internshipStatus === InternshipStatus.ACTIVE) {
  //           this.internships.push(internship)
  //         }
  //       })
  //       let date = new Date().toJSON().slice(0, 10);
  //       console.log("Found active internships ", this.internships)
  //       this.internships.forEach((internship: any) => {
  //         internship.skillsList = internship.skills.split(",");
  //         if (internship.reportingDate === date && internship.internshipStatus === InternshipStatus.ACTIVE) {
  //           internship.internshipStatus = InternshipStatus.CLOSED;
  //           this.postInternshipService.updateInternship(internship).subscribe(
  //             (res) => {
  //               console.log(" updated internship to ,", res)
  //             },
  //             (err) => {
  //               console.log("error updating internship", err)
  //             }
  //           )
  //         }
  //         this.applyInternship.findByAppliedBy(this.userEmail).subscribe(
  //           (res) => {
  //             this.applications = res;
  //             this.applications.forEach((application: any) => {
  //               if (application.internshipId === internship.id) {
  //                 this.appliedInternshipIdArray.push(internship.id)
  //                 console.log("length is", this.appliedInternshipIdArray.length)
  //               }
  //             })
  //           },
  //           (err) => { console.log(err) }
  //         )
  //       });
  //     }
  //   )
  // }
  // searchInternship(): void {
  //   this.loading = true;
  //   this.postInternshipService.searchInternship(this.searchText).subscribe(
  //     result => {
  //       this.loading = false;
  //       this.internships = result;
  //       let date = new Date().toJSON().slice(0, 10);
  //       this.internships.forEach((internship: any) => {
  //         if (internship.reportingDate === date) {
  //           internship.skillsList = internship.skills.split(",");
  //           internship.internshipStatus = InternshipStatus.CLOSED;
  //         }
  //       });
  //       console.log("Search produces internships:", this.internships)
  //     },
  //     error => {
  //       console.error('error getting searched internship', error);
  //     }
  //   )
  // }
}

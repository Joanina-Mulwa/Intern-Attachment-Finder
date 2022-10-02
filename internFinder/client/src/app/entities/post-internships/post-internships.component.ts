import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { Authority, UserBio } from '../users/user-bio-model';
import { InternshipType, InternshipStatus, WorkPlaceType, MinimumQualification, ExperienceLevel, Period, Domain } from './post-internship-model';

@Component({
  selector: 'app-post-internships',
  templateUrl: './post-internships.component.html',
  styleUrls: ['./post-internships.component.css']
})
export class PostInternshipsComponent implements OnInit {

  constructor(
    protected postInternshipService: PostInternshipService,
    protected userService: UserService,
    protected router: Router,
  ) { }
  internship = {
    id: undefined as any,
    internshipTitle: '',
    companyName: '',
    companyEmail: '',
    workPlaceType: 'ONSITE',
    location: '',
    internshipType: '',
    reportingDate: '',
    vacancy: '',
    description: '',
    skills: '',
    responsibilities: '',
    important: '',
    internshipPeriod: '',
    internshipStatus: 'ACTIVE',
    createdOn: '',
    createdBy: '',
    minimumQualification: '',
    experienceLevel: '',
  }

  advertDetails = {
    id: undefined as any,
    internshipTitle: '',
    companyName: '',
    companyEmail: '',
    companyLogo:'',
    period: '',
    domain: '',
    internshipStatus: 'ACTIVE',
    createdOn: '',
    reportingDate: '',
  }



  companyDetails!: '';
  companyLogo!: '';
  workPlaceTypes = [WorkPlaceType.ONSITE, WorkPlaceType.REMOTE, WorkPlaceType.HYBRID];
  internshipTypes = [InternshipType.FULLTIME, InternshipType.PARTTIME, InternshipType.CONTRACT, InternshipType.VOLUNTEER]
  internshipStatus = [InternshipStatus.ACTIVE, InternshipStatus.CLOSED]
  minimumQualifications = [MinimumQualification.CERTIFICATE, MinimumQualification.DIPLOMA, MinimumQualification.DEGREE, MinimumQualification.POSTGRADUATE]
  experienceLevels = [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.MIDLEVEL, ExperienceLevel.EXPERT]
  periods = [Period.JAN, Period.MAY, Period.JULY]
  domains = [Domain.BUSINESS, Domain.ENGINEERING, Domain.TECH, Domain.ENGINEERINGTECH, Domain.BUILDING, Domain.HOSPITALITY, Domain.TELECOMS, Domain.TEACHING];


  selectedFiles!: FileList;
  currentFile!: any;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  today?: any;

  ngOnInit(): void {
    this.getCurrentUser();
    this.fileInfos = this.postInternshipService.getFiles();
    console.log("Here:", this.fileInfos);
    this.today = new Date().toISOString().split('T')[0];
    console.log("Got date", this.today)
    //this.advertDetails.companyLogo = this.companyLogo;
    //document.getElementsByName("reportingDate")[0].setAttribute('min', today);
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.advertDetails.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.advertDetails.companyName = this.companyDetails;
    this.advertDetails.companyLogo = this.companyLogo;
    console.log("About to create internship ", this.currentFile, " and ", this.advertDetails);
    this.postInternshipService.upload(this.currentFile, this.advertDetails).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          setTimeout(() => {
            this.message = '';
            this.reset2();
            this.router.navigate(['/internships'])

          }, 3000)
        }
        this.fileInfos = this.postInternshipService.getFiles();


      },

      err => {
        // if (err instanceof HttpResponse) {
        //   this.message = err.body.message;
        //   this.currentFile = undefined;
        //   setTimeout(() => {
        //     this.message = '';
        //   }, 3000)
        // }
        this.progress = 0;
        this.message = 'Could not upload the file! Try again later.';
        this.currentFile = undefined;
        setTimeout(() => {
          this.message = '';
          //this.reset2();
        }, 5000)
      });

    // this.selectedFiles = undefined;
  }





  reset(): void {
    this.internship = {
      id: undefined as any,
      internshipTitle: '',
      companyName: '',
      companyEmail: '',
      workPlaceType: 'ONSITE',
      location: '',
      internshipType: '',
      reportingDate: '',
      vacancy: '',
      description: '',
      skills: '',
      responsibilities: '',
      important: '',
      internshipPeriod: '',
      internshipStatus: 'ACTIVE',
      createdOn: '',
      createdBy: '',
      minimumQualification: '',
      experienceLevel: '',
    }
  }
  reset2(): void {
    this.advertDetails = {
      id: undefined as any,
      internshipTitle: '',
      companyName: '',
      companyEmail: '',
      companyLogo:'',
      period: '',
      domain: '',
      internshipStatus: 'ACTIVE',
      createdOn: '',
      reportingDate: '',
    }
  }
  postinternship(): void {
    this.internship.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.internship.companyName = this.companyDetails;
    console.log("About to create internship ", this.internship);
    this.router.navigate(['/internships'])
    this.postInternshipService.createInternship(this.internship).subscribe(
      (res) => {
        console.log("created this internship", res);
        window.location.reload();
        this.router.navigate(['/internships'])
      },
      (err) => {
        console.log("error creating internship", err)
      }
    )
  }

  counter(i: number) {
    return new Array(i);
  }

  // findAlinternships():void{
  //   this.postInternshipService.findAll().subscribe(
  //     (res)=>{
  //       console.log("Found internships ", res)

  //     }  

  //   )
  // }

  getCurrentUser(): void {
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.internship.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    console.log("current posting person is ", this.internship.companyEmail)
    this.userService.findByEmail(this.internship.companyEmail).subscribe(
      (res) => {
        this.companyDetails = res.name;
        this.companyLogo = res.profileImageUrl;
        console.log("jhherrreeee company name details posting confirmation is", res);
        console.log("jhherrreeee company name details posting confirmation is", this.companyDetails);
        console.log("jhherrreeee company name details posting confirmation is", this.companyLogo);
        
      },
      (err) => {
        console.log("Error fetching current user details", err)
      }
    )

  }

}


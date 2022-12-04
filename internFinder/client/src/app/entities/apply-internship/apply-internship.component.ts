import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { PostInternship } from '../post-internships/post-internship-model';
import { UserBio } from '../users/user-bio-model';
import { ApplyInternship } from './apply-internship-model';

@Component({
  selector: 'app-apply-internship',
  templateUrl: './apply-internship.component.html',
  styleUrls: ['./apply-internship.component.css']
})
export class ApplyInternshipComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected applyInternship: ApplyInternshipService,
    protected postInternshipService: PostInternshipService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) { }
  ifProfileComplete = true;
  currentEmail: any;
  profile!: UserBio;
  profileCompleteFailure = '';
  profileCompleteSuccess = false;
  showUpdateButton = false;
  resume!: File;

  internshipDetail?: PostInternship
  currentInternshipId!: number;
  // application={
  //   id: undefined as any,

  //   internshipId: undefined as unknown  as number,

  //   appliedBy: '',

  //   appliedOn: '',

  //   postedBy: '',

  //   introduction: '',

  //   reason: '',

  //   strength: '',

  //   weakness: '',

  //   resume: '',



  // }
  applicationDetails: any = {
    id: undefined as any,

    internshipId: undefined as unknown as number,

    appliedBy: '',

    appliedOn: '',

    postedBy: '',

    postedByEmail: '',

    parsedApplicationIdentifier: '',

    parsedSkills: [],
  }
  selectedFiles!: FileList;
  currentFile!: any;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  today?: any;
  progressBar?: number;
  extractedResumeIdentifier?: any;
  extractedResumeSkills: any[] = [];




  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentInternshipId = params['id'];
      console.log("We want to view profile of intenrhsip of is  ", this.currentInternshipId)
    });
    this.checkIfProfileComplete();
    this.findPostedBy();
  }
  back(): void {
    window.history.back();
  }
  url: any;
  msg = "";
  selectFile(event: any) {
    this.selectedFiles = event.target.files;



    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.progressBar = 5;
    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
      const jobData = this.url.split('base64,')[1];

      // parse the job 
      console.log("Selected image data, ", jobData)
      this.progressBar = 15;

      const { AffindaCredential, AffindaAPI } = require("@affinda/affinda");

      const credential = new AffindaCredential("d153960084941a25474abb34ceec73d2bce6e70d")
      const client = new AffindaAPI(credential)
      this.progressBar = 30;

      var arrrayBuffer = base64ToArrayBuffer(jobData); //data is the base64 encoded string
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
      this.progressBar = 50;

      client.createResume({ file: blob }).then((result: any) => {
        this.progressBar = 85;

        console.log("Returned resume data:");
        console.dir(result);
        this.extractedResumeIdentifier = result.meta.identifier;
        result.data.skills.forEach((skill: any) => {

          this.applicationDetails.parsedSkills.push(skill.name);

        });
        console.log("Returned skills:", this.applicationDetails.parsedSkills);

        console.log("Returned job identifier:", this.extractedResumeIdentifier);

        this.progressBar = 100;

      }).catch((err: any) => {
        console.log("An error occurred while creating parse:");
        console.error(err);
      });



    }







  }

  submitApplication() {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    this.applicationDetails.internshipId = this.currentInternshipId;
    this.applicationDetails!.appliedBy = this.currentEmail;
    this.applicationDetails.parsedApplicationIdentifier = this.extractedResumeIdentifier;

    let date = new Date().toJSON().slice(0, 10);
    this.applicationDetails!.appliedOn = date;
    console.log("About to create application", this.applicationDetails, "and resume", this.currentFile)
    this.applyInternship.createApplication(this.currentFile, this.applicationDetails).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          // setTimeout(() => {
          //   this.message = '';
          this.router.navigate(['/users/', this.currentEmail])

          // }, 3000)
        }
      },
      (err) => {
        console.log(err)
        this.progress = 0;
        this.message = 'Could not upload the file! Try again later.';
        this.currentFile = undefined;
        setTimeout(() => {
          this.message = '';
        }, 5000)
      }
    )
  }

  checkIfProfileComplete(): void {
    this.currentEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.currentEmail).subscribe(
      (res) => {
        console.log("current user deatils are", res);
        this.profile = res;
        console.log("check if profile can be null", res);
        if (this.profile.name === null || this.profile.institution === null || this.profile.programme === null || this.profile.course === null || this.profile.experienceLevel === null) {
          this.ifProfileComplete = false;
          this.profileCompleteFailure = "Update Profile first to apply for an internship!"
          setTimeout(() => {
            this.profileCompleteFailure = '';
            this.ifProfileComplete = true;
          }, 3000);
          this.showUpdateButton = true;
        }
        else {
          this.profileCompleteSuccess = true;

        }


      },
      (err) => { console.log("Error fetching current user bio") }
    )

  }

  findPostedBy(): void {
    this.postInternshipService.findAdvertById(this.currentInternshipId).subscribe(
      (res) => {
        console.log("internship details are", res)
        this.internshipDetail = res;
        console.log("Current internship was posted by this company email :", this.internshipDetail?.companyEmail);
        this.applicationDetails.postedBy = res.companyName;
        this.applicationDetails.postedByEmail = res.companyEmail;
      },
      (err) => {
        console.log("Error fetching current internship details", err)
      }
    )
  }

  // submit(): void{
  //   this.application.internshipId=this.currentInternshipId;
  //   this.application!.appliedBy=this.currentEmail;
  //   let date = new Date().toJSON().slice(0, 10);
  //   this.application!.appliedOn = date;   
  //   console.log("About to create application", this.application)
  //   this.applyInternship.applyInternship(this.application).subscribe(
  //     (res)=>{
  //       console.log("created appliccation",res)
  //       this.router.navigate(['/users/', this.currentEmail])
  //     },
  //     (err)=>{console.log(err)}
  //   )

  // }




}

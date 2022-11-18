import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { Domain, Period } from '../../post-internships/advert-details-model';
import { WorkPlaceType, InternshipType, InternshipStatus, MinimumQualification, ExperienceLevel } from '../../post-internships/post-internship-model';

@Component({
  selector: 'app-internship-edit',
  templateUrl: './internship-edit.component.html',
  styleUrls: ['./internship-edit.component.css']
})
export class InternshipEditComponent implements OnInit {

  constructor(
    protected postInternshipService: PostInternshipService,
    protected userService: UserService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) { }
  intern = {
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
    companyLogo: '',
    period: '',
    domain: '',
    internshipStatus: 'ACTIVE',
    createdOn: '',
    reportingDate: '',
    url: '',
    parsedJobIdentifier: ''
  }

  companyDetails!: '';
  internshipId!: number;
  companyName!: '';
  companyLogo!: '';

  selectedFiles!: FileList;
  currentFile!: any;
  foundFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  today?: any;
  clearUploaded: boolean=false;

  extractedJobDescription?: any;
  extractedJobDescriptionSkills?: any[];
  extractedResumeDescriptionSkills?: any;
  extractedJobIdentifier?: any;
  progressBar?: number;



  workPlaceTypes = [WorkPlaceType.ONSITE, WorkPlaceType.REMOTE, WorkPlaceType.HYBRID];
  internshipTypes = [InternshipType.FULLTIME, InternshipType.PARTTIME, InternshipType.CONTRACT, InternshipType.VOLUNTEER]
  internshipStatus = [InternshipStatus.ACTIVE, InternshipStatus.CLOSED]
  minimumQualifications = [MinimumQualification.CERTIFICATE, MinimumQualification.DIPLOMA, MinimumQualification.DEGREE, MinimumQualification.POSTGRADUATE]
  experienceLevels = [ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.MIDLEVEL, ExperienceLevel.EXPERT]
  periods = [Period.JAN, Period.MAY, Period.JULY]
  domains = [Domain.BUSINESS, Domain.ENGINEERING, Domain.TECH, Domain.BUILDING, Domain.HOSPITALITY, Domain.TELECOMS, Domain.TEACHING];


  ngOnInit(): void {
    this.getCurrentUser()
    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      console.log("We want to edit profile of intenrhsip of is  ", this.internshipId)


    });
    this.findInternshipById()
    this.today = new Date().toISOString().split('T')[0];
    console.log("Got date", this.today)


  }
  url: any;
  msg = "";

  selectFile(event: any) {
    this.clearUploaded=true;
    this.selectedFiles = event.target.files;
    console.log("Hereeeeeeeeeeeeeeee", this.selectedFiles.length);
    if(this.selectedFiles === undefined){
      this.progressBar = 100;
      console.log("Do nothing", this.progressBar);

      
    }else{

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
  
        const credential = new AffindaCredential("02bfae960b3de66b98010fb3e18fc34ab0996c89")
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
  
        console.time("Parse Job")
        client.createJobDescription({ file: blob }).then((result: any) => {
          this.progressBar = 85;
  
          console.log("Returned job data:");
          console.dir(result)
          this.extractedJobDescription = result;
          console.log("Returned job data skills only:");
          console.timeEnd("Parse Job")
          this.extractedJobDescriptionSkills = result.data.skills;
          this.extractedJobIdentifier = result.meta.identifier;
  
          console.log("Returned job identifier:", this.extractedJobIdentifier);
          
          console.dir(this.extractedJobDescriptionSkills)
          this.progressBar = 100;
  
        }).catch((err: any) => {
          console.log("An error occurred:");
          console.error(err);
        });
  
      }

    
    }

  }

  updateAdvert() {
    //this.reset();
    this.progress = 0;
    if(this.selectedFiles === undefined){
      console.log("About to update internship ", this.advertDetails);

      this.postInternshipService.updateAdvertDetails(this.internshipId, this.advertDetails).subscribe(

        (event: any)=>{
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            setTimeout(() => {
              this.message = '';
              this.reset();
              window.history.back();
              this.router.navigate(['/internship/', this.internshipId])
            }, 1500)
            setTimeout(() => {
              this.router.navigate(['/internship/', this.internshipId])
              window.location.reload();
  
  
            }, 2000)
  
  
          }
          this.fileInfos = this.postInternshipService.getFiles();
        },
        (err)=>{
          this.progress = 0;
          this.message = 'Could not upload the file! Try again later.';
          this.currentFile = undefined;
          setTimeout(() => {
            this.message = '';
            //this.reset2();
          }, 3000)
        }
      )
      
    }
    else{
      this.progress = 0;
      this.currentFile = this.selectedFiles.item(0);
    console.log("file is", this.currentFile);
    console.log("Details are ", this.advertDetails);
    this.advertDetails.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    this.advertDetails.companyName = this.companyName;
    this.advertDetails.companyLogo = this.companyLogo;
    this.advertDetails.parsedJobIdentifier = this.extractedJobIdentifier;
    this.advertDetails.id = this.internshipId;
    console.log("About to update internship ", this.currentFile, " and ", this.advertDetails);
    this.postInternshipService.updateAdvert(this.currentFile, this.advertDetails).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          setTimeout(() => {
            this.message = '';
            this.reset();
            window.history.back();
            this.router.navigate(['/internship/', this.internshipId])
          }, 1500)
          setTimeout(() => {
            this.router.navigate(['/internship/', this.internshipId])
            window.location.reload();


          }, 2000)


        }
        this.fileInfos = this.postInternshipService.getFiles();


      },

      err => {
        this.progress = 0;
        this.message = 'Could not upload the file! Try again later.';
        this.currentFile = undefined;
        setTimeout(() => {
          this.message = '';
          //this.reset2();
        }, 3000)
      });
    }

    // this.selectedFiles = undefined;
  }


  // updateinternship(): void {
  //   this.advertDetails.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
  //   this.advertDetails.companyName = this.companyName;
  //   console.log("About to update internship ", this.advertDetails);
  //   this.router.navigate(['/internships'])
  //   this.postInternshipService.updateAdvert(this.currentFile).subscribe(
  //     (res) => {


  //       console.log("updated this internship", res);
  //       window.location.reload();
  //       this.router.navigate(['/internships'])

  //         ;


  //     },
  //     (err) => {
  //       console.log("error updating internship", err)
  //     }
  //   )
  // }

  reset(): void {
    // this.intern ={
    //   id: undefined as any,
    //   internshipTitle:'',
    //   companyName : '',
    //   companyEmail: '',
    //   workPlaceType : 'ONSITE',
    //   location : '',
    //   internshipType: '',
    //   reportingDate: '',
    //   vacancy: '',
    //   description: '',
    //   skills: '',
    //   responsibilities: '',
    //   important: '',
    //   internshipPeriod: '',
    //   internshipStatus: 'ACTIVE',
    //   createdOn: '',
    //   createdBy: '',
    //   minimumQualification:'',
    //   experienceLevel:'',

    // }
    this.advertDetails = {
      id: undefined as any,
      internshipTitle: '',
      companyName: '',
      companyEmail: '',
      companyLogo: '',
      period: '',
      domain: '',
      internshipStatus: 'ACTIVE',
      createdOn: '',
      reportingDate: '',
      url: '',
      parsedJobIdentifier: ''

    }

  }
  counter(i: number) {
    return new Array(i);
  }
  back(): void {
    window.history.back();
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
    this.advertDetails.companyEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
    console.log("current posting person is ", this.advertDetails.companyEmail)
    this.userService.findByEmail(this.advertDetails.companyEmail).subscribe(
      (res) => {

        this.companyDetails = res;

        console.log("jhherrreeee company name details posting confirmation is", this.companyDetails);
        this.companyName = res.name;
        this.companyLogo = res.profileImageUrl;
        console.log("jhherrreeee company name details posting confirmation is", this.companyName, "and ", this.companyLogo);

      },
      (err) => {
        console.log("Error fetching current user details", err)
      }
    )

  }

  findInternshipById(): void {
    console.log("Want to find internship of id ", this.internshipId)
    this.postInternshipService.findAdvertById(this.internshipId).subscribe(
      (res) => {
        console.log("Found internship this", res);
        this.advertDetails = res;

        this.foundFile = new File([res.data], res.name, { type: res.type });

        console.log("Found internship this", this.foundFile);

      },
      (err) => { console.log("Failed to find internship of id ", this.internshipId) }
    )
  }


}

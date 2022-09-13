import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { PostInternship } from '../../post-internships/post-internship-model';

@Component({
  selector: 'app-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.css']
})
export class ApplicationDetailComponent implements OnInit {

  constructor(
    protected route: ActivatedRoute,
    protected applyInternship: ApplyInternshipService,
    protected postInternship: PostInternshipService
  ) { }
  internshipId!: number;
  loading: boolean = false;
  applications!: ApplyInternship[];
  loggedInUserEmail!: string;
  applicationDetails?: ApplyInternship;
  internshipDetail?: PostInternship


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      console.log("We want to view profile of ", this.internshipId)
this.viewApplication();
    });
  }
  back(): void{
    window.history.back();
  }
  viewApplication():void{
    this.loading = true;  
    this.applyInternship.findApplicationsByInternshipId(this.internshipId).subscribe(
      (res) => {
        this.loading=false;
        this.applications = res;
        console.log("Found this aplications for the internship, ", this.applications)
        this.loggedInUserEmail = JSON.parse(localStorage.getItem('currentUser')!).email;
        this.applications.forEach((application)=>{
          if(application.appliedBy === this.loggedInUserEmail){
            this.applicationDetails=application;
            console.log("Found this specific aplication for the internship, ", this.applicationDetails)
            this.postInternship.findInternshipById(this.internshipId).subscribe(
              (res)=>{
                this.internshipDetail=res
                console.log("here the internship", this.internshipDetail)
                console.log("here", this.internshipDetail?.companyName)
                this.applicationDetails!.postedBy=this.internshipDetail?.companyName;
                console.log("Found this updated specific aplication for the internship, ", this.applicationDetails)
              },
              (err)=>{console.log(err)}
            )
          }

        }) ;  
      },
      (err) => { console.log("error fetching internhips applied", err) }

    )
    
  }
}

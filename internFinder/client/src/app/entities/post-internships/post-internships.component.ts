import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { Authority, UserBio } from '../users/user-bio-model';
import { InternshipType, InternshipStatus, WorkPlaceType } from './post-internship-model';

@Component({
  selector: 'app-post-internships',
  templateUrl: './post-internships.component.html',
  styleUrls: ['./post-internships.component.css']
})
export class PostInternshipsComponent implements OnInit {

  constructor(
    protected postInternshipService : PostInternshipService,
    protected userService: UserService,
    protected router: Router,
    ) { }
  internship = {
    id: undefined as any,
    internshipTitle:'',
    companyName : '',
    companyEmail: '',
    workPlaceType : 'ONSITE',
    location : '',
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
  }

  companyDetails!: '';
 


  workPlaceTypes=[WorkPlaceType.ONSITE, WorkPlaceType.REMOTE, WorkPlaceType.HYBRID];
  internshipTypes=[InternshipType.FULLTIME, InternshipType.PARTTIME, InternshipType.CONTRACT, InternshipType.VOLUNTEER]
  internshipStatus = [InternshipStatus.ACTIVE, InternshipStatus.CLOSED]


  ngOnInit(): void {
    this.getCurrentUser()
    
    
  }
  reset(): void{
    this.internship ={
      id: undefined as any,
      internshipTitle:'',
      companyName : '',
      companyEmail: '',
      workPlaceType : 'ONSITE',
      location : '',
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
  
    }
  
  }


  postinternship(): void{    
    this.internship.companyEmail= JSON.parse(localStorage.getItem('currentUser')!).email;
    this.internship.companyName=this.companyDetails;
    console.log("About to create internship ", this.internship);
    this.router.navigate(['/internships'])
    this.postInternshipService.createInternship(this.internship).subscribe(
      (res)=>{
       
        
        console.log("created this internship",res);
        window.location.reload();
        this.router.navigate(['/internships'])

      },
      (err)=>{
        console.log("error creating internship",err)
      }
    )
  }

  // findAlinternships():void{
  //   this.postInternshipService.findAll().subscribe(
  //     (res)=>{
  //       console.log("Found internships ", res)
        
  //     }  

  //   )
  // }

  getCurrentUser(): void{
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.internship.companyEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    console.log("current posting person is ", this.internship.companyEmail)
    this.userService.findByEmail(this.internship.companyEmail).subscribe(
      (res)=>{

        this.companyDetails = res;
        console.log("jhherrreeee company name details posting confirmation is", res.name);
        this.companyDetails=res.name;    
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

}


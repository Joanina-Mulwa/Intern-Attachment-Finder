import { Component, OnInit } from '@angular/core';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { Authority } from '../users/user-bio-model';
import { InternshipType, InternshipStatus, WorkPlaceType } from './post-internship-model';

@Component({
  selector: 'app-post-internships',
  templateUrl: './post-internships.component.html',
  styleUrls: ['./post-internships.component.css']
})
export class PostInternshipsComponent implements OnInit {

  constructor(
    protected postInternshipService : PostInternshipService,
    protected userService: UserService
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
    period: '',
    internshipStatus: 'ACTIVE',
    createdOn: '',
    createdBy: '',
  }
 


  workPlaceTypes=[WorkPlaceType.ONSITE, WorkPlaceType.REMOTE, WorkPlaceType.HYBRID];
  internshipTypes=[InternshipType.FULLTIME, InternshipType.PARTTIME, InternshipType.CONTRACT, InternshipType.VOLUNTEER]
  internshipStatus = [InternshipStatus.ACTIVE, InternshipStatus.CLOSED]


  ngOnInit(): void {
    
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
      period: '',
      internshipStatus: 'ACTIVE',
      createdOn: '',
      createdBy: '',
  
    }
  
  }


  postinternship(): void{
    console.log("About to create internship ", this.internship);
    this.postInternshipService.createInternship(this.internship).subscribe(
      (res)=>{
        //console.log("The authority 2 is",res.authority)
        this.reset();
        console.log(res);

      }
    )
  }

  findAlinternships():void{
    this.postInternshipService.findAll().subscribe(
      (res)=>{
        console.log("Found internships ", res)}
    )
  }

}


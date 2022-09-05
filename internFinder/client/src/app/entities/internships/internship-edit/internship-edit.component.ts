import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { UserService } from 'src/app/services/user.service';
import { WorkPlaceType, InternshipType, InternshipStatus } from '../../post-internships/post-internship-model';

@Component({
  selector: 'app-internship-edit',
  templateUrl: './internship-edit.component.html',
  styleUrls: ['./internship-edit.component.css']
})
export class InternshipEditComponent implements OnInit {

  constructor(
    protected postInternshipService : PostInternshipService,
    protected userService: UserService,
    protected router: Router,
    protected route: ActivatedRoute,
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
  internshipId!: number;
 


  workPlaceTypes=[WorkPlaceType.ONSITE, WorkPlaceType.REMOTE, WorkPlaceType.HYBRID];
  internshipTypes=[InternshipType.FULLTIME, InternshipType.PARTTIME, InternshipType.CONTRACT, InternshipType.VOLUNTEER]
  internshipStatus = [InternshipStatus.ACTIVE, InternshipStatus.CLOSED]


  ngOnInit(): void {
    this.getCurrentUser()
    this.route.params.subscribe(params => {
      this.internshipId = params['id'];
      console.log("We want to edit profile of intenrhsip of is  ", this.internshipId)
      
      
    });
    this.findInternshipById()
    
    
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


  updateinternship(): void{    
    this.internship.companyEmail= JSON.parse(localStorage.getItem('currentUser')!).email;
    this.internship.companyName=this.companyDetails;
    console.log("About to update internship ", this.internship);
    this.router.navigate(['/internships'])
    this.postInternshipService.updateInternship(this.internship).subscribe(
      (res)=>{
       
        
        console.log("updated this internship",res);
        window.location.reload();
        this.router.navigate(['/internships'])
      
     ;
        

      },
      (err)=>{
        console.log("error updating internship",err)
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
        console.log("jhherrreeee company name details posting confirmation is", this.internship.id);
        this.companyDetails=res.name;    
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

  findInternshipById(): void{
    console.log("Want to find internship of id ", this.internshipId)
    this.postInternshipService.findInternshipById(this.internshipId).subscribe(
      (res)=>{
        console.log("Found internship this", res);
        this.internship=res;
      },
      (err)=>{console.log("Failed to find internship of id ", this.internshipId)}
    )
  }


}

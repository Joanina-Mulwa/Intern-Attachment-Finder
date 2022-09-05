import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Authority, Programme } from '../user-bio-model';

@Component({
  selector: 'app-bio-edit',
  templateUrl: './bio-edit.component.html',
  styleUrls: ['./bio-edit.component.css']
})
export class BioEditComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected router: Router,
  ) { }
  
userEmail: any;
  profile={
    id: undefined as any,
    email: '',
    authority: '',
    name: '',
    profileImageUrl: '',
    username: '',
    institution: '',
    programme: 'DEGREE',
    course: '',
    skills: '',
    skillsList: '',
    experience: '',
    //Company
    companyName: '',
    companyEmail: '',
    companyPhoneNumber: '',
    companyLocation:'',
    companyDescription:'',
    companyWorkingHours:'',
    companyLogo:'',
    companyIndustry: '',
    companyWebsite: '',
    companyNumberOfEmployees: '',
    companyPostalAddress:'',

  }

  isStudent?: boolean;
  loading: boolean=false;

  programmes = [Programme.DEGREE,Programme.DIPLOMA, Programme.CERTIFICATE, Programme.POSTGRADUATE];

  ngOnInit(): void {
    this.getCurrentUser();
  }


  previousState(): void {
    window.history.back();
  }

  getCurrentUser(): void{
    this.loading=true;
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
       
        if(res.authority === Authority.STUDENT){
          this.loading=false;
          this.isStudent = true;
          this.profile=res;
          console.log("User details to update is", this.profile)
          

        }
        else if(res.authority === Authority.EMPLOYER){
          this.isStudent = false;
        }
        else{
          console.log("Error fetching logged in authority")
        }

        
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

  updateUser(): void{
    console.log("User details to update is", this.profile)
    this.userService.updateUser(this.profile).subscribe(
      (res)=>{
        console.log("Updated user to ,",this.profile);
        window.history.back();
      },
      (err)=>{console.log("error updating user", err)}
    )

    
  }
}

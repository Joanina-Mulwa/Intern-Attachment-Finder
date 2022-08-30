import { Component, OnInit } from '@angular/core';
import { Authority, UserBio } from 'src/app/entities/users/user-bio-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    protected userService: UserService
  ) { }
authority!: Authority;
userEmail: any;
  profile={
    id: undefined as any,
    email: '',
    authority: '',
    name: '',
    profileImageUrl: '',
    username: '',
    institution: '',
    programme: '',
    course: '',
    skills: '',
    skillsList: '',
    experience: '',
    //Company
    companyName: '',
    companyEmail: '',
    companyDescription:'',
    companyPhoneNumber: '',

  }

  ngOnInit(): void {
    this.getCurrentUser();
    //this.updateUser();
  }

  previousState(): void {
    window.history.back();
  }

  getCurrentUser(): void{
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
        console.log("User details is", res)
        this.profile=res;
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

  updateUser(): void{
    this.userService.updateUser(this.profile).subscribe(
      (res)=>{
        console.log("Updated user to ,",res)
      },
      (err)=>{console.log("error updating user")}
    )

    
  }

}

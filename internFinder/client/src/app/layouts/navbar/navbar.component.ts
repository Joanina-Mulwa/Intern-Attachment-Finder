import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { Authority } from 'src/app/entities/users/user-bio-model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  constructor(
    protected userService: UserService,
    protected router: Router,
    
  ) { }


  currentRouteUrl!: string;
  showNavbar: boolean=false;
  userEmail: any;
  showPostInternship: boolean=false;
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
    companyPhoneNumber: '',
    companyLocation:'',
    companyDescription:'',
    companyWorkingHours:'',
    companyLogo:'',

  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRouteUrl = event.url;
        console.log("Current route is",this.currentRouteUrl)
        if(this.currentRouteUrl != "/")
        {
          this.showNavbar=true;
          this.getCurrentUser();
          
        }
      }
    });
    
  }

  getCurrentUser(): void{
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
       // window.location.reload();
        console.log("User details is", res)
        this.profile=res;
        if(res.authority === Authority.EMPLOYER){
          this.showPostInternship=true; 
        }
        else if (res.authority === Authority.STUDENT){
          this.showPostInternship=false
        }
        else{
          console.log("Error fetching user authority")
        }
        
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

  logOut(): void{
    //window.location.reload();
    this.router.navigate(['']);
    this.showNavbar=false;

  }


  

}

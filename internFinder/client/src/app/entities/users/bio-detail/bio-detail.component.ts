import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Authority, UserBio } from '../user-bio-model';

@Component({
  selector: 'app-bio-detail',
  templateUrl: './bio-detail.component.html',
  styleUrls: ['./bio-detail.component.scss']
})
export class BioDetailComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected route: ActivatedRoute,
  ) { }

  userBioDetail?: UserBio;
  loggedInUserEmail!: string;
  userEmail!: string;
  username!: string;
  isMe: boolean=false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userEmail = params['email'];
      console.log("We want to view profile of ", this.userEmail)
      this.checkIfMe();

      
    });

   
    
  }
  

  checkIfMe(): void{
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.loggedInUserEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    if(this.loggedInUserEmail === this.userEmail){
      this.isMe=true;
    }
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
        console.log("User details is", res)
        this.userBioDetail = res;
        if (this.userBioDetail?.skills) {
          this.userBioDetail.skillsList = this.userBioDetail.skills.split(",");
    
        }
        console.log("User this.userBioDetai is", this.userBioDetail)   
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }



}

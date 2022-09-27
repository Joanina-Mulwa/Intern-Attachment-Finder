
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
// import { UserBioService } from '../services/user-bio.service';
 import { Authority, UserBio } from '../user-bio-model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    protected userService: UserService
    ) 
    { }

  users!: UserBio[];
  username?: any;
  loading = false;
  searchText: string = '';
  usersStudent: UserBio[]=[];
  usersEmployer: UserBio[]=[];
  usersGuest: UserBio[]=[];
  userEmail!: string;
  userBioDetail?: UserBio;


  ngOnInit(): void {
    this.getAllUsers(); 
    this.getCurrentLoggedInUsername();
    this.getBioDetails();
  }

  getCurrentLoggedInUsername(): any {
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail = JSON.parse(localStorage.getItem('currentUser')!).email


  }

  getBioDetails(): void{
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
        this.userBioDetail=res;
        console.log("Found user details", this.userBioDetail)
      },
      (err)=> {
        console.log(err)}
    )
  }




  getAllUsers():void{
    this.loading=true;
    this.userService.findAllUsers().subscribe(
      (res) => {
        console.log("here",res);
        let date = new Date().toJSON().slice(0, 10);
        this.users = res;
        this.loading=false
        this.users.forEach((user: any) => {
          user.createdOn=date;
          if (user.skills) {
            user.skillsList = user.skills.split(",");
          }
          if(user.authority === Authority.STUDENT){
            this.usersStudent.push(user);
          }
          else if(user.authority === Authority.EMPLOYER){
            this.usersEmployer.push(user)
          }
          else{
            this.usersGuest.push(user);
          }
        });
        console.log("Success users: ", this.users);       
      }
    )
  }
  searchUser(): void {
    this.loading = true;
    this.userService.searchUser(this.searchText).subscribe(
      result => {
        this.loading = false;
        this.users = result;
        this.users.forEach((user: any) => {
          if (user.skills) {
            user.skillsList = user.skills.split(",");
          }
        });   
        console.log("Search produces users:", this.users) ;
      },
      error => {
        console.error('error getting searched user', error);
      }
    )
  }
}



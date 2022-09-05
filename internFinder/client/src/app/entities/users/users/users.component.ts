
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
// import { UserBioService } from '../services/user-bio.service';
 import { UserBio } from '../user-bio-model';


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


  ngOnInit(): void {
    this.getAllUsers();
    

    
  }



  getAllUsers():void{
    this.loading=true;
    this.userService.findAllUsers().subscribe(
      (res) => {
        this.loading=false;
        console.log("here",res);
        //console.log("The authority 2 is",res.authority)
        let date = new Date().toJSON().slice(0, 10);
        this.users = res;
        this.users.forEach((user: any) => {
          user.createdOn=date;
          if (user.skills) {
            user.skillsList = user.skills.split(",");

          }
        });
       
        // this.users.forEach((user: any) => {
        //   if (user.email) {
        //     this.username = user.email.match(/^([^@]*)@/)[1];

        //   }
        // });
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
      
        console.log("Search produces users:", this.users)
      },
      error => {
        console.error('error getting searched user', error);
      }
    )
  }

  


}



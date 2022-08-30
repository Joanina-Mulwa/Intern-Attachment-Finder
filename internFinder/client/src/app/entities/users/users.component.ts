
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
// import { UserBioService } from '../services/user-bio.service';
 import { UserBio } from './user-bio-model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    protected userSrvice: UserService
    ) 
    { }

  users!: UserBio[];
  username?: any;


  ngOnInit(): void {
    this.getAllUsers();
    

    
  }



  getAllUsers():void{
    this.userSrvice.findAllUsers().subscribe(
      (res) => {
        console.log(res);
        //console.log("The authority 2 is",res.authority)
        this.users = res;
        this.users.forEach((user: any) => {
          if (user.skills) {
            user.skillsList = user.skills.split(",");

          }
        });
        this.users.forEach((user: any) => {
          if (user.email) {
            this.username = user.email.match(/^([^@]*)@/)[1];

          }
        });
        console.log("Success users: ", this.users);       
      }
    )
  }

  


}



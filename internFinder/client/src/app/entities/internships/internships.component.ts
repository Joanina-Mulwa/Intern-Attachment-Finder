import { Component, OnInit } from '@angular/core';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { PostInternship } from '../post-internships/post-internship-model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css']
})
export class InternshipsComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected postInternshipService: PostInternshipService,
    protected tokenService: TokenService
  ) {
   }
  category: Boolean = false;
  internships?: PostInternship[];
  username!: string;


  ngOnInit(): void {
    this.findAllinternships();
    this.getCurrentLoggedInUsername();
    //this.getUsername2();
  }

  // getCategory(): void {
  //   this.userLoginService.findCategory(this.userLogins.email).subscribe(
  //     (res) => {
  //       console.log(res)
  //       if (res == null) {
  //         this.router.navigate(['/internships'])
  //       }
  //       else {
  //         this.router.navigate(['/users'])
  //       }
  //     }
  //   )
  // }

  getCurrentLoggedInUsername(): any {


   console.log("Current logged in user token",this.tokenService.getToken());
   console.log("Current logged in username and token ",this.tokenService.getUsername());
   console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
 

}


  findAllinternships():void{
    this.postInternshipService.findAll().subscribe(
      (res)=>{
        console.log("Found internships ", res)
        this.internships= res;
    }
    )
  }

}

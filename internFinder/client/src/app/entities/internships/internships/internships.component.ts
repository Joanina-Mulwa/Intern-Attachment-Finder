import { Component, OnInit } from '@angular/core';
import { PostInternshipService } from 'src/app/services/post-internship.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { InternshipStatus, PostInternship } from '../../post-internships/post-internship-model';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {

  constructor(
    protected userService: UserService,
    protected postInternshipService: PostInternshipService,
    protected tokenService: TokenService
  ) {
  }
  category: Boolean = false;
  internships!: PostInternship[];
  username!: string;
  loading=false;
  searchText: string = '';
  //today = new Date().toJSON().slice(0, 10)
  //date?: string


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


    console.log("Current logged in user token", this.tokenService.getToken());
    console.log("Current logged in username and token ", this.tokenService.getUsername());
    console.log("Current logged in username", JSON.parse(localStorage.getItem('currentUser')!).email);


  }


  findAllinternships(): void {
    this.loading=true;
    this.postInternshipService.findAll().subscribe(
      (res) => {
        this.loading=true;
        this.loading=false;
        console.log("Found internships ", res)
        let date = new Date().toJSON().slice(0, 10);
        this.internships = res;

        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date) {
            internship.skillsList = internship.skills.split(",");
            internship.internshipStatus = InternshipStatus.CLOSED;

          }
        });

          
      }
    )
  }
  searchInternship():void{
    this.loading = true;
    this.postInternshipService.searchInternship(this.searchText).subscribe(
      result => {
        this.loading = false;
        this.internships = result;
        let date = new Date().toJSON().slice(0, 10);

        this.internships.forEach((internship: any) => {
          if (internship.reportingDate === date) {
            internship.skillsList = internship.skills.split(",");
            internship.internshipStatus = InternshipStatus.CLOSED;

          }
        });

      
        console.log("Search produces internships:", this.internships)
      },
      error => {
        console.error('error getting searched internship', error);
      }
    )
  
  }

}

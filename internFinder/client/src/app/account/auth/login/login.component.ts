import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/services/user-login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    protected userLoginService: UserLoginService, 
    protected router: Router, 
   
    ) { }
  index = 1;
  username: any;
  users: any[] = [];
  loginFailure = '';
  registerSuccess = '';
  registerFailure = '';
  showRegister = false;
  forgotPass=false;
  resetPassFailure='';
  resetPassSuccess='';

  userLogins = {
    email: '',
    password: ''
  };

  ngOnInit(): void {
  }

  reset(): void {
    this.userLogins = {
      email: '',
      password: ''
    }
  }

  loginUser(): void {
    this.showRegister = false;
    console.log("User to be logged in : ", this.userLogins);
    
    this.userLoginService.loginUser(this.userLogins).subscribe(
      (res) => {
        console.log(res);
        if (res == null) {

          this.userLoginService.findByEmail(this.userLogins.email).subscribe(
            (res)=>{
              console.log("email is: ", res)
              if(res == null){
  
                this.loginFailure = "Register, user " + this.userLogins.email + " does not exist";
                setTimeout(
                  ()=>{
                    this.reset();
                    this.loginFailure='';
                    this.showRegister=true;
                  },3000
                )
              }
              else{
                this.loginFailure = "Incorrect credentials..Try Again"
                setTimeout(() => {
                  this.loginFailure = '';
                }, 3000);
      
              }
            },
      
          )

        } else {
          console.log("Successfull login, "+ this.userLogins.email)
          this.router.navigate(['/users'])

        }

      },
      (err) => { console.log("User login failure : ", err) }

    )
  }

  loginWithGoogle(): void {
 
    //this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


  registerUser(): void {
    this.showRegister = true;
    console.log(this.userLogins);
    this.userLoginService.findByEmail(this.userLogins.email).subscribe(
      (res) => {
        console.log(res)
        if (res != null) {
          this.registerFailure = "Login, User "+ this.userLogins.email +" already exists";
          setTimeout(
            () => {
              this.reset();
              this.registerFailure = '';
              this.showRegister=false;
            }, 3000
          )
        }
        else {
          if (this.userLogins.password.length <= 3) {
            this.registerFailure = "Enter valid password(too short)"
            setTimeout(
              ()=>{
                this.reset();
                this.registerFailure='';
              },3000
            )
          }
          else {
            console.log("user to be registered : ", this.userLogins)
            this.userLoginService.registerUser(this.userLogins).subscribe(
              (res) => {
                console.log(res)
                this.registerSuccess="Registration sucessfull. Login to proceed";
                setTimeout(
                  () => {
                    this.registerSuccess = '';
                    this.reset();
                this.showRegister=false;
                  }, 3000
                )
                
                
              }
            )
          }

        }
      }

    )

  }

  forgotPassword():void{
    this.forgotPass=true;
  }
  resetPassword():void{
    console.log("About to reset password")
    this.userLoginService.findByEmail(this.userLogins.email).subscribe(
      (res)=>{
        if(res == null){
          this.resetPassFailure="User" +this.userLogins.email+" is not registered in the system. Register";
          setTimeout(
            ()=>{
              this.reset();
              this.resetPassFailure='';
              this.backToRegister();

            },3000
          )
        }
        else{
          this.userLoginService.resetPassword(this.userLogins).subscribe(
            (res)=>{
              this.resetPassSuccess="Password successfuly reset, Login";
          setTimeout(
            () => {
              this.reset();
              this.resetPassSuccess='';
              this.backToLogin();

            },3000
            )
            }
          )
          }
      },
      (err)=>{
        console.log("Error reseting password")
      }
    )
 
  }
  backToLogin():void{
    this.forgotPass=false;
  }
  backToRegister():void{
    this.forgotPass=false;
    this.showRegister=true;
  }


}

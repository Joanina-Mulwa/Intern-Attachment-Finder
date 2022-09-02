import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { TokenService } from 'src/app/services/token.service';
import { Authority } from 'src/app/entities/users/user-bio-model';
export { userLogins } from 'src/app/account/auth/login/userLoginsModel'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    protected userService: UserService,
    protected router: Router,
    protected socialAuthService: SocialAuthService,
    protected tokenService: TokenService

  ) { }
  index = 1;
  username: any;
  users: any[] = [];
  loginFailure = '';
  registerSuccess = '';
  registerFailure = '';
  showRegister = false;
  forgotPass = false;
  resetPassFailure = '';
  resetPassSuccess = '';
  socialUser!: SocialUser;
  isLoggedIn!: boolean;

  userLogins = {
    email: '',
    password: '',
    authority: ''
  };


  showPassword!: boolean;
  authority!: Authority;


  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(user => {

      this.socialUser = user;
      console.log("The user is" + user);
    });

    console.log("logins with button click is", this.userLogins);



  }

  // togglePassword():void{
  //   this.showPassword = !this.showPassword
  // }

  reset(): void {
    this.userLogins = {
      email: '',
      password: '',
      authority: ''
    }
  }
  setAuthority(authority: string): void {
    this.authority = authority as Authority;
    this.userLogins.authority = this.authority;
    console.log("User choose authority is", this.authority)
  }

  loginUser(): void {
    this.showRegister = false;
    console.log("User to be logged in : ", this.userLogins);

    this.userService.loginUser(this.userLogins).subscribe(
      {
        next: (res) => {
          console.log("response to log in is: ", res);
          console.log("Authority is : ", res.authority);
          this.userLogins.authority = res.authority;
          console.log("User to be logged in with authority is : ", this.userLogins);
          this.tokenService.saveToken(this.userLogins.email, res.bearerToken);

          console.log("Got token ,", res.bearerToken)

          console.log("Successfull login, " + this.userLogins.email)
          //this.router.navigate(['/internships'])
          this.getCategory();

        },
        error: (err) => {
          console.log("User login failure : ", err)

          this.userService.findByEmail(this.userLogins.email).subscribe(
            (res) => {
              console.log("email is: ", res)
              if (res == null) {
                this.loginFailure = "Register, user " + this.userLogins.email + " does not exist";
                setTimeout(
                  () => {
                    this.reset();
                    this.loginFailure = '';
                    this.showRegister = true;
                  }, 3000
                )
              }
              else {
                this.loginFailure = "Incorrect credentials..Try Again"
                setTimeout(() => {
                  this.loginFailure = '';
                }, 3000);

              }
            },

          )

          this.loginFailure = "Invalid usernae or password"
          setTimeout(() => {
            this.loginFailure = '';
          }, 3000);

        }


      }


    )
  }

  getCategory(): void {
    this.userService.findCategory(this.userLogins.email).subscribe(
      (res) => {
        console.log(res);
        if (res != null) {
          console.log("here", res);
          if (res === Authority.EMPLOYER) {
            this.router.navigate(['/post-internship']);
          }
          else if (res === Authority.STUDENT) {
            this.router.navigate(['internships']);

          }
          else {
            console.log("No authority found for logged ");
            //this.router.navigate(['post-internship']);
          }

        }
        else {
          console.log("Authority found for logged in user is null");

        }
      }
    )
  }



  loginWithGoogle(): void {

    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // signOut(): void {
  //   this.socialAuthService.signOut();
  //this.tokenService.clearToken();

  // }



  registerUser(): void {
    this.showRegister = true;
    console.log(this.userLogins);
    this.userService.findByEmail(this.userLogins.email).subscribe(
      (res) => {
        console.log(res)
        if (res != null) {
          this.registerFailure = "Login, User " + this.userLogins.email + " already exists";
          setTimeout(
            () => {
              this.reset();
              this.registerFailure = '';
              this.showRegister = false;
            }, 3000
          )
        }
        else {
          if (this.userLogins.password.length <= 3) {
            this.registerFailure = "Enter valid password(too short)"
            setTimeout(
              () => {
                this.reset();
                this.registerFailure = '';
              }, 3000
            )
          }
          else {
            this.userLogins.authority = this.authority;
            console.log("user to be registered : ", this.userLogins)

            this.userService.registerUser(this.userLogins).subscribe(
              (res) => {
                console.log(res)
                this.registerSuccess = "Registration sucessfull. Login to proceed";
                setTimeout(
                  () => {
                    this.registerSuccess = '';
                    this.reset();
                    this.showRegister = false;
                  }, 3000
                )


              }
            )
          }

        }
      }

    )

  }



  forgotPassword(): void {
    this.forgotPass = true;
    this.reset();
  }
  resetPassword(): void {
    console.log("About to reset password")
    this.userService.findByEmail(this.userLogins.email).subscribe(
      (res) => {
        if (res == null) {
          this.resetPassFailure = "User" + this.userLogins.email + " is not registered in the system. Register";
          setTimeout(
            () => {
              this.reset();
              this.resetPassFailure = '';
              this.backToRegister();

            }, 3000
          )
        }
        else {
          this.userService.resetPassword(this.userLogins).subscribe(
            (res) => {
              this.resetPassSuccess = "Password successfuly reset, Login";
              setTimeout(
                () => {
                  this.reset();
                  this.resetPassSuccess = '';
                  this.backToLogin();

                }, 3000
              )
            }
          )
        }
      },
      (err) => {
        console.log("Error reseting password")
      }
    )

  }
  backToLogin(): void {
    this.forgotPass = false;
    this.reset();
  }
  backToRegister(): void {
    this.forgotPass = false;
    this.showRegister = true;
  }



}





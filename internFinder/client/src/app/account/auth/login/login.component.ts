import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
//import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { TokenService } from 'src/app/services/token.service';
import { Authority, UserBio, UserStatus } from 'src/app/entities/users/user-bio-model';
export { userLogins } from 'src/app/account/auth/login/userLoginsModel'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    protected userService: UserService,
    protected router: Router,
    //protected socialAuthService: SocialAuthService,
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
  //socialUser!: SocialUser;
  isLoggedIn!: boolean;

  userLogins = {
    email: '',
    password: '',
    authority: ''
  };
  userConfirm = {
    passwordConfirm: '',
  }




  showPassword!: boolean;
  authority!: Authority;
  isAuthorityButtonVisible: boolean = true;
  deactiveUser = '';
  activationSuccess = '';
  activationFailure = '';
  showActivate = false;
  currentUserDetails!: UserBio;


  ngOnInit(): void {
    // this.socialAuthService.authState.subscribe(user => {

    //   this.socialUser = user;
    //   console.log("The user is" + user);
    // });

    console.log("logins with button click is", this.userLogins);



  }

  // togglePassword():void{
  //   this.showPassword = !this.showPassword
  // }

  reset(): void {
    this.isAuthorityButtonVisible = true;
    this.userLogins = {
      email: '',
      password: '',
      authority: ''
    }
    this.userConfirm = {
      passwordConfirm: '',
    }
  }
  setAuthority(authority: string): void {
    this.authority = authority as Authority;
    this.userLogins.authority = this.authority;
    console.log("User choose authority is", this.authority)
    this.isAuthorityButtonVisible = false;
  }

  changeAuthority(): void {
    this.userLogins.authority = '';
    console.log("User removed authority ", this.userLogins.authority)
    this.isAuthorityButtonVisible = true

  }

  activateAccount(): void {
    this.userService.findByEmail(this.userLogins.email).subscribe(
      (res) => {
        this.currentUserDetails = res;
        if (res == null) {
          this.activationFailure = "Register, user " + this.userLogins.email + " does not exist";
          setTimeout(
            () => {
              this.reset();
              this.activationFailure = '';
              this.showActivate = false;
              this.showRegister = true;
            }, 3000
          )
        }
        else {
          if (this.userLogins.password === this.userConfirm.passwordConfirm) {
            this.currentUserDetails.userStatus = UserStatus.ACTIVE;
            console.log("About to update", this.currentUserDetails);
            this.userService.loginUser(this.userLogins).subscribe(
              (res) => {
                this.userService.updateUser(this.currentUserDetails).subscribe(
                  (res) => {
                    console.log("Activated", res)
                    this.activationSuccess = "Account activated. Login to continue!";
                    setTimeout(
                      () => {
                        this.reset();
                        this.activationSuccess = '';
                        this.showRegister = false;
                        this.showActivate = false;
                      }, 3000
                    )
                   
                  },
                  (err) => {
                    console.log("Activation failure")
                    this.activationFailure = "Activation failure. Try again later"
                    setTimeout(() => {
                      this.activationFailure = '';
                    }, 3000);
                  }
                )



              },
              (err) => {
                console.log("Invalid username or password")
                this.activationFailure = "Invalid username or password"
                setTimeout(() => {
                  this.activationFailure = '';
                }, 3000);

              }
            )
          }
          else {
            this.activationFailure = "Password mismatch"
            setTimeout(() => {
              this.activationFailure = '';
            }, 3000);

          }




        }

      },
      () => { }
    )


  }

  loginUser(): void {
    this.showRegister = false;
    console.log("User to be logged in : ", this.userLogins);
    this.userService.findByEmail(this.userLogins.email).subscribe(
      (res) => {
        console.log("heere:,", res)
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
          if (res.userStatus === UserStatus.PASSIVE) {
            this.deactiveUser = "Account Deactive. Activate account first to login"
            setTimeout(
              () => {
                this.deactiveUser = ''
                this.reset();
                this.showActivate = true;

              }, 3000
            )
          }
          else {

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
        }
      },
      (err) => {
        console.log("here", err)

        this.loginFailure = "Incorrect credentials..Try Again"
        setTimeout(() => {
          this.loginFailure = '';
        }, 3000);

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
            //this.router.navigate(['/users/edit'])
            this.router.navigate(['users/', this.userLogins.email]);
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



  // loginWithGoogle(): void {

  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

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

          if (!this.isValidEmail(this.userLogins.email)) {
            this.registerFailure = "Enter valid valid email"
            setTimeout(
              () => {

                this.registerFailure = '';
              }, 3000
            )

          }
          else {

            if (this.userLogins.password === this.userConfirm.passwordConfirm) {
              if (this.userLogins.password.length < 8) {
                this.registerFailure = "Too short password(Must contain atleast 8 characters)"
                setTimeout(
                  () => {

                    this.registerFailure = '';
                  }, 3000
                )
              }
              else {
                let pattern = new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$"); //Regex: At least 8 characters with at least 1 numericals (0-9),1 letters in Upper Case,1 Special Character (!@#$&*), 3 letters in Lower Case  "
                //other regex
                // "^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$"
                // "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"

                if (pattern.test(this.userLogins.password)) {
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



                else {
                  this.registerFailure = "Password must contain at least 1 numerical (0-9),1 letter in Upper Case,1 Special Character (!@#$&*), 3 letters in Lower Case"
                  setTimeout(
                    () => {

                      this.registerFailure = '';
                    }, 5000
                  )

                }
              }

            }
            else {
              this.registerFailure = "Password Mismatch"
              setTimeout(
                () => {

                  this.registerFailure = '';
                }, 3000
              )

            }


          }

        }
      }

    )

  }

  isValidEmail(email: string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(email)) {
      return true;
    }

    return false;
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





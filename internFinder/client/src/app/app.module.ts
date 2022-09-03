import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SocialLoginModule,SocialAuthServiceConfig} from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/auth/login/login.component';
import { UsersComponent } from './entities/users/users/users.component';
import { InternshipsComponent } from './entities/internships/internships/internships.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { PostInternshipsComponent } from './entities/post-internships/post-internships.component';
import { ProfileComponent } from './account/auth/profile/profile.component';
import { BioDetailComponent } from './entities/users/bio-detail/bio-detail.component';
import { BioEditComponent } from './entities/users/bio-edit/bio-edit.component';
import { InternshipDetailComponent } from './entities/internships/internship-detail/internship-detail.component';
import { InternshipEditComponent } from './entities/internships/internship-edit/internship-edit.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    InternshipsComponent,
    NavbarComponent,
    PostInternshipsComponent,
    ProfileComponent,
    BioDetailComponent,
    BioEditComponent,
    InternshipDetailComponent,
    InternshipDetailComponent,
    InternshipEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    CommonModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('475049910206-mfg3ar2rrrvl9jjn30i9okqge6ehotv4.apps.googleusercontent.com')
          }
        ]
      }as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
//import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';  
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
//import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ApplyInternshipComponent } from './entities/apply-internship/apply-internship.component';
import { AngularEditorModule } from '@kolkov/angular-editor'; 
import { TabsModule} from 'ngx-bootstrap/tabs';
import { ApplicationComponent } from './entities/applications/application/application.component';
import { ApplicantsComponent } from './entities/applications/applicants/applicants.component';
import { ApplicationDetailComponent } from './entities/applications/application-detail/application-detail.component';
import { ReviewsComponent } from './feedback/reviews/reviews.component';
import { LoginWithGoogleComponent } from './account/auth/login-with-google/login-with-google.component';
import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { AboutUsComponent } from './about/about-us/about-us.component';
import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginWithGoogleComponent,
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
    ApplyInternshipComponent,
    ApplicationComponent,
    ApplicantsComponent,
    ApplicationDetailComponent,
    ReviewsComponent,
    AboutUsComponent,
    SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
   //SocialLoginModule,
    CommonModule,
   PdfViewerModule,
    BrowserAnimationsModule,
    AngularEditorModule,
    TabsModule.forRoot(),
    //MDBBootstrapModule.forRoot(),
    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
//   providers: [
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
          
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('475049910206-mfg3ar2rrrvl9jjn30i9okqge6ehotv4.apps.googleusercontent.com')
//           }
//         ]
//       }as SocialAuthServiceConfig
//     },
//     // {
//     //   provide: HTTP_INTERCEPTORS,
//     //   useClass: JwtInterceptorService,
//     //   multi: true

//     // }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

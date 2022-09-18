import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginWithGoogleComponent } from './account/auth/login-with-google/login-with-google.component';
//import { LoginWithGoogleComponent } from './account/auth/login-with-google/login-with-google.component';
import { LoginComponent } from './account/auth/login/login.component';
import { ProfileComponent } from './account/auth/profile/profile.component';
import { ApplicantsComponent } from './entities/applications/applicants/applicants.component';
import { ApplicationDetailComponent } from './entities/applications/application-detail/application-detail.component';
import { ApplicationComponent } from './entities/applications/application/application.component';
import { ApplyInternshipComponent } from './entities/apply-internship/apply-internship.component';
import { InternshipDetailComponent } from './entities/internships/internship-detail/internship-detail.component';
import { InternshipEditComponent } from './entities/internships/internship-edit/internship-edit.component';
import { InternshipsComponent } from './entities/internships/internships/internships.component';
import { PostInternshipsComponent } from './entities/post-internships/post-internships.component';
import { ReviewsComponent } from './feedback/reviews/reviews.component';
import { BioDetailComponent } from './entities/users/bio-detail/bio-detail.component';
import { BioEditComponent } from './entities/users/bio-edit/bio-edit.component';
import { UsersComponent } from './entities/users/users/users.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { AboutUsComponent } from './about/about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'loginWithGoogle',
    component: LoginWithGoogleComponent
  },
  {
    path: 'internships',
    component: InternshipsComponent
  },
  {
    path: 'navbar',
    component: NavbarComponent
  },
  {
    path: 'post-internship',
    component: PostInternshipsComponent
  },
  {
    path: 'users/:email',
    component: BioDetailComponent
  },
  {
    path: 'user/edit',
    component: BioEditComponent
  },
  {
    path: 'internship/:id',
    component: InternshipDetailComponent
  },
  {
    path: 'internship/edit/:id',
    component: InternshipEditComponent
  },
  {
    path: 'internship/apply/:id',
    component: ApplyInternshipComponent
  },
  {
    path: 'applicants/:id',
    component: ApplicantsComponent
  },
  {
    path: 'applied/:id/:email',
    component: ApplicationComponent
  },
  {
    path: 'details/:id',
    component: ApplicationDetailComponent
  },
  {
    path: 'reviews',
    component: ReviewsComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

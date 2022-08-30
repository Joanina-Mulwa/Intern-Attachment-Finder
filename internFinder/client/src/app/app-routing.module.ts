import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginWithGoogleComponent } from './account/auth/login-with-google/login-with-google.component';
import { LoginComponent } from './account/auth/login/login.component';
import { ProfileComponent } from './account/auth/profile/profile.component';
import { InternshipsComponent } from './entities/internships/internships.component';
import { PostInternshipsComponent } from './entities/post-internships/post-internships.component';
import { UsersComponent } from './entities/users/users.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';

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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

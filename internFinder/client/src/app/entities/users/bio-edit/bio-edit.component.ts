import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplyInternshipService } from 'src/app/services/apply-internship.service';
import { UserService } from 'src/app/services/user.service';
import { ApplyInternship } from '../../apply-internship/apply-internship-model';
import { Authority, CompanyIndustry, companyLocation, Course, ExperienceLevel, Institution, Programme } from '../user-bio-model';

@Component({
  selector: 'app-bio-edit',
  templateUrl: './bio-edit.component.html',
  styleUrls: ['./bio-edit.component.css']
})
export class BioEditComponent implements OnInit {
 
  constructor(
    protected userService: UserService,
    protected router: Router,
    protected applyInternship: ApplyInternshipService,
  ) { }
  
userEmail: any;
  profile={
    id: undefined as any,
    email: '',
    authority: '',
    name: '',
    profileImageUrl: '',
    username: '',
    institution: '',
    programme: 'DEGREE',
    course: '',
    skills: '',
    skillsList: '',
    //Company
    companyName: '',
    companyEmail: '',
    companyPhoneNumber: '',
    companyLocation:'',
    companyDescription:'',
    companyWorkingHours:'',
    companyLogo:'',
    companyIndustry: '',
    companyWebsite: '',
    companyNumberOfEmployees: '',
    companyPostalAddress:'',
    experienceLevel:'',
    experience: '',
    about:'',


  }

  isStudent?: boolean;
  loading: boolean=false;
  selectedFile: any;
  imgURL: any;

  appliedInternships!: ApplyInternship

  programmes = [Programme.DEGREE,Programme.DIPLOMA, Programme.CERTIFICATE, Programme.POSTGRADUATE];
  institutions = [Institution.DEKUT, Institution.LAIKIPIA, Institution.JKUAT, Institution.MOI, Institution.KMTC];
  courses = [Course.CS, Course.IT, Course.BUSINESS, Course.ENGINEERING, Course.HOSPITALITY, Course.BCOM];
  companyIndustrys = [CompanyIndustry.BUSINESS, CompanyIndustry.ENGINEERING, CompanyIndustry.TECH,CompanyIndustry.ENGINEERINGTECH, CompanyIndustry.BUILDING,CompanyIndustry.HOSPITALITY, CompanyIndustry.TELECOMS];
  experienceLevels=[ExperienceLevel.BEGINNER, ExperienceLevel.INTERMEDIATE, ExperienceLevel.MIDLEVEL, ExperienceLevel.EXPERT]
  companyLocations = [companyLocation.BARINGO,companyLocation.BOMET,companyLocation.BUNGOMA,companyLocation.BUSIA,companyLocation.EMBU,companyLocation.GARISSA,companyLocation.HOMABAY,companyLocation.ISIOLO,companyLocation.KAJIADO,companyLocation.KAKAMEGA,companyLocation.KERICHO,companyLocation.KIAMBU,companyLocation.KILIFI,companyLocation.KIRINYAGA,companyLocation.KISII,companyLocation.KISUMU,companyLocation.KITUI,companyLocation.KWALE,companyLocation.LAIKIPIA,companyLocation.LAMU,companyLocation.MACHAKOS,companyLocation.MAKUENI,companyLocation.MANDERA,companyLocation.MARAKWET,companyLocation.MARSABIT,companyLocation.MERU,companyLocation.MIGORI,companyLocation.MOMBASA,companyLocation.MURANGA,companyLocation.NAIROBICITY,companyLocation.NAKURU,companyLocation.NANDI,companyLocation.NAROK,companyLocation.NYAMIRA,companyLocation.NYANDARUA,companyLocation.NYERI,companyLocation.SAMBURU,companyLocation.SIAYA,companyLocation.TAITATAVETA,companyLocation.TANARIVER,companyLocation.THARAKANITHI,companyLocation.TRANSNZOIA,companyLocation.TURKANA,companyLocation.UASINGISHU,companyLocation.VIHIGA,companyLocation.WAJIR,companyLocation.WESTPOKOT]

  ngOnInit(): void {
    this.getCurrentUser();
   
  }

  back():void{
    window.history.back();
  }

  onFileChanged(event: any) {
     const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgURL = reader.result as string;
      };
    }
  }
  url: any;
  msg = "";

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
      this.profile.profileImageUrl = this.url;
    }
  }

  previousState(): void {
    window.history.back();
  }

  counter(i: number) {
    return new Array(i);
}

  getCurrentUser(): void{
    this.loading=true;
    console.log("Current logged in username",JSON.parse(localStorage.getItem('currentUser')!).email);
    this.userEmail=JSON.parse(localStorage.getItem('currentUser')!).email;
    this.userService.findByEmail(this.userEmail).subscribe(
      (res)=>{
        this.loading=false;

       
        if(res.authority === Authority.STUDENT){
          this.isStudent = true;
          this.profile=res;
          console.log("User details to update is", this.profile)
          

        }
        else if(res.authority === Authority.EMPLOYER){
          this.isStudent = false;
          this.profile=res;
        }
        else{
          console.log("Error fetching logged in authority")
        }

        
      },
      (err)=>{
        console.log("Error fetching current user details", err)
      }
    )

  }

  updateUser2(): void{
    //testing
    console.log("User details to update is", this.profile)
    this.profile.profileImageUrl = this.url;
    console.log("User details to update is", this.profile)


    // this.userService.updateUser(this.profile).subscribe(
    //   (res)=>{
    //     console.log("Updated user to ,",this.profile);
    //     window.history.back();
    //   },
    //   (err)=>{console.log("error updating user", err)}
    // )

    
  }

  updateUser():void{
    console.log("User details to update is", this.profile)
    this.userService.updateUser(this.profile).subscribe(
      (res)=>{
        console.log("Updated user to ,",this.profile);
        this.router.navigate(['users/',this.profile.email])
       // window.history.back();
      },
      (err)=>{console.log("error updating user", err)}
    )
  }


  
}



export class UserBio{
     id?: number;
     email?: string;
     authority?: Authority;
     name?: string;
     profileImageUrl?: string;
     username?: string;
     institution?: string;
     programme?: Programme;
     course?: string;
     skills?: string;
     skillsList?: string[];
     experience?: string;
     createdOn?:Date;
     //Company
     companyName?: string;
     companyEmail?: string;
     companyPhoneNumber?: string;
     companyLocation?:string;
     companyDescription?:string;
     companyWorkingHours?:string;
     companyLogo?:string;
     companyIndustry?: string;
     companyWebsite?: string;
     companyNumberOfEmployees?: number;
     companyPostalAddress?: string;
     


    constructor(
        id?: number,
        email?: string,
        authority?: Authority,
        name?: string,
        profileImageUrl?: string,
        username?: string,
        institution?: string,
        programme?: Programme,
        course?: string,
        skills?: string,
        skillsList?: string[],
        experience?: string,
        createdOn?:Date,
        //Company
        companyName?: string,
        companyEmail?: string,
        companyPhoneNumber?: string,
        companyLocation?:string,
        companyDescription?:string,
        companyWorkingHours?:string,
        companyLogo?:string,
        companyIndustry?: string,
        companyWebsite?: string,
        companyNumberOfEmployees?: number,
        companyPostalAddress?: string,
        
   
    ){
        this.id=id;
        this.email=email;
        this.authority=authority;
        this.name=name;
        this.profileImageUrl=profileImageUrl;
        this.username=username;
        this.institution=institution;
        this.programme=programme;
        this.course=course;
        this.skills=skills;
        this.skillsList=skillsList;
        this.experience=experience;
        this.createdOn=createdOn;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.companyPhoneNumber=companyPhoneNumber;
        this.companyLocation=companyLocation;
        this.companyDescription=companyDescription;
        this.companyWorkingHours=companyWorkingHours;
        this.companyLogo=companyLogo;
        this.companyIndustry=companyIndustry;
        this.companyWebsite=companyWebsite;
        this.companyNumberOfEmployees=companyNumberOfEmployees;
        this.companyPostalAddress=companyPostalAddress;

    }
}

export enum EmploymentStatus{
    EMPLOYED = 'EMPLOYED',
    UNEMPLOYED = 'UNEMPLOYED',
    SELF_EMPLOYED = 'SELF_EMPLOYED',
    FREELANCER = 'FREELANCER',
}

export enum Authority{
    EMPLOYER = 'EMPLOYER',
    STUDENT = 'STUDENT'
}

export enum Programme{
    DEGREE = 'DEGREE',
    DIPLOMA = 'DIPLOMA',
    CERTIFICATE = 'CERTIFICATE',
    POSTGRADUATE = 'POST-GRADUATE'

}
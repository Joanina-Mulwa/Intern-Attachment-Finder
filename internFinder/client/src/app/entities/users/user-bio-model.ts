export class UserBio{
     id?: number;
     email?: string;
     authority?: Authority;
     name?: string;
     profileImageUrl?: string;
     username?: string;
     institution?: string;
     programme?: string;
     course?: string;
     skills?: string;
     skillsList?: string[];
     experience?: string;
     //Company
     companyName?: string;
     companyEmail?: string;
     companyPhoneNumber?: string;



    constructor(
        id?: number,
        email?: string,
        authority?: Authority,
        name?: string,
        profileImageUrl?: string,
        username?: string,
        institution?: string,
        programme?: string,
        course?: string,
        skills?: string,
        skillsList?: string[],
        experience?: string,
        //Company
        companyName?: string,
        companyEmail?: string,
        companyPhoneNumber?: string,
   
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
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.companyPhoneNumber=companyPhoneNumber;

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
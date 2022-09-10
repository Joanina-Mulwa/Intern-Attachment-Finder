export class UserBio {
    id?: number;
    email?: string;
    authority?: Authority;
    name?: string;
    profileImageUrl?: string;
    username?: string;
    institution?: Institution;
    programme?: Programme;
    course?: Course;
    skills?: string;
    skillsList?: string[];
    createdOn?: string;
    //Company
    companyName?: string;
    companyEmail?: string;
    companyPhoneNumber?: string;
    companyLocation?: string;
    companyDescription?: string;
    companyWorkingHours?: string;
    companyLogo?: string;
    companyIndustry?: CompanyIndustry;
    companyWebsite?: string;
    companyNumberOfEmployees?: number;
    companyPostalAddress?: string;
    experienceLevel?: ExperienceLevel;
    experience?: string;
    about?: string;





    constructor(
        id?: number,
        email?: string,
        authority?: Authority,
        name?: string,
        profileImageUrl?: string,
        username?: string,
        institution?: Institution,
        programme?: Programme,
        course?: Course,
        skills?: string,
        skillsList?: string[],
        createdOn?: string,
        //Company
        companyName?: string,
        companyEmail?: string,
        companyPhoneNumber?: string,
        companyLocation?: string,
        companyDescription?: string,
        companyWorkingHours?: string,
        companyLogo?: string,
        companyIndustry?: CompanyIndustry,
        companyWebsite?: string,
        companyNumberOfEmployees?: number,
        companyPostalAddress?: string,
        experienceLevel?: ExperienceLevel,
        experience?: string,
        about?: string,



    ) {
        this.id = id;
        this.email = email;
        this.authority = authority;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
        this.username = username;
        this.institution = institution;
        this.programme = programme;
        this.course = course;
        this.skills = skills;
        this.skillsList = skillsList;
        this.experience = experience;
        this.createdOn = createdOn;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.companyPhoneNumber = companyPhoneNumber;
        this.companyLocation = companyLocation;
        this.companyDescription = companyDescription;
        this.companyWorkingHours = companyWorkingHours;
        this.companyLogo = companyLogo;
        this.companyIndustry = companyIndustry;
        this.companyWebsite = companyWebsite;
        this.companyNumberOfEmployees = companyNumberOfEmployees;
        this.companyPostalAddress = companyPostalAddress;
        this.experienceLevel = experienceLevel;
        this.experience=experience;
        this.about=about;

    }
}

export enum EmploymentStatus {
    EMPLOYED = 'EMPLOYED',
    UNEMPLOYED = 'UNEMPLOYED',
    SELF_EMPLOYED = 'SELF_EMPLOYED',
    FREELANCER = 'FREELANCER',
}

export enum Authority {
    EMPLOYER = 'EMPLOYER',
    STUDENT = 'STUDENT'
}

export enum Programme {
    DEGREE = 'DEGREE',
    DIPLOMA = 'DIPLOMA',
    CERTIFICATE = 'CERTIFICATE',
    POSTGRADUATE = 'POST-GRADUATE'

}
export enum Institution {
    DEKUT = 'Dedan Kimathi University',
    LAIKIPIA = 'Laikipia University',
    MOI = 'Moi University',
    JKUAT = 'JKUAT University',
    KMTC = 'KMTC College'
}

export enum Course {
    CS = 'Computer Science',
    IT = 'Information Technology',
    ENGINEERING = 'Engineering',
    BUSINESS = 'Business',
    BCOM = 'Business Commerce',
    HOSPITALITY = 'Hospitality'
}

export enum CompanyIndustry {
    TECH = 'Technology',
    ENGINEERING = 'Engineering',
    ENGINEERINGTECH = 'Technology & Engineering',
    BUSINESS = 'Business',
    HOSPITALITY = 'Hotel & Hospitality',
    BUILDING = 'Building and constrution',
    TELECOMS = 'Telecoms'
}

export enum ExperienceLevel {
    BEGINNER = 'Beginner (less than 1 year)',
    INTERMEDIATE = 'Intermediate (2 - 3 years)',
    MIDLEVEL = 'MidLeve (3 - 5 years)',
    EXPERT = 'Expert (over 5 years)'
}
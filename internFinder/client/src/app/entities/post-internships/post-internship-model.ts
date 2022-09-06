export class PostInternship{
    id?: number;
    internshipTitle?:string;
    companyName?: string;
    companyEmail?: string;
    workPlaceType?: WorkPlaceType;
    location?: string;
    internshipType?: InternshipType;
    reportingDate?: string;
    vacancy?: string;
    description?: string;
    skills?: string;
    responsibilities?: string;
    important?: string;
    internshipPeriod?: number;
    internshipStatus?: InternshipStatus;
    createdOn?: string;
    createdBy?: string;
    minimumQualification?: MinimumQualification;
    experienceLevel?:ExperienceLevel;
    constructor(
    id?: number,
    internshipTitle?:string,
    companyName?: string,
    companyEmail?: string,
    workPlaceType?: WorkPlaceType,
    location?: string,
    internshipType?: InternshipType,
    reportingDate?: string,
    vacancy?: string,
    description?: string,
    skills?: string,
    responsibilities?: string,
    important?: string, 
    internshipPeriod?: number,
    internshipStatus?: InternshipStatus,
    createdOn?: string,
    createdBy?: string,
    minimumQualification?: MinimumQualification,
    experienceLevel?:ExperienceLevel,



    ){
        this.id=id;
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.workPlaceType=workPlaceType;
        this.location=location;
        this.internshipType=internshipType;
        this.reportingDate=reportingDate;
        this.vacancy=vacancy;
        this.description=description;
        this.skills=skills;
        this.responsibilities=responsibilities;
        this.important=important;
        this.internshipPeriod=internshipPeriod;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.createdBy=createdBy;
        this.minimumQualification=minimumQualification;
        this.experienceLevel=experienceLevel;

    }
}
export enum WorkPlaceType{
    ONSITE = 'ONSITE',
    REMOTE = 'REMOTE',
    HYBRID = 'HYBRID'
}
export enum InternshipType{
    FULLTIME='FULLTIME',
    PARTTIME='PARTTIME',
    CONTRACT='CONTRACT',
    VOLUNTEER='VOLUNTEER'
}
export enum InternshipStatus{
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}
export enum MinimumQualification{    
    CERTIFICATE = 'Certificate',
    DIPLOMA = 'Diploma',
    DEGREE = 'Degree',
    POSTGRADUATE = 'Post-Graduate'
}

export enum ExperienceLevel{
    BEGINNER = 'Beginner (less than 1 year)',
    INTERMEDIATE = 'Intermediate (2 - 3 years)',
    MIDLEVEL = 'MidLevel (3 - 5 years)',
    EXPERT = 'Expert (over 5 years)'
}
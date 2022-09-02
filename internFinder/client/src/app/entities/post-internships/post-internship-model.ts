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
    period?: number;
    internshipStatus?: InternshipStatus;
    createdOn?: string;
    createdBy?: string;
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
    period?: number,
    internshipStatus?: InternshipStatus,
    createdOn?: string,
    createdBy?: string,

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
        this.period=period;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.createdBy=createdBy;
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
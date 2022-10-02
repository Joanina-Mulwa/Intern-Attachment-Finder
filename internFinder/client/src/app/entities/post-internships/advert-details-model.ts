export class AdvertDetails{
    id?: number;
    internshipTitle?: string;
    companyName?: string;
    companyEmail?: string;
    companyLogo?: string;
    period?: Period;
    domain?: Domain;
    internshipStatus?: InternshipStatus;
    createdOn?: string;
    reportingDate?: string;
    data?: File;
    constructor(
        id?: number,
        internshipTitle?: string,
        companyName?: string,
        companyEmail?: string,
        companyLogo?: string,
        period?: Period,
        domain?: Domain,
        internshipStatus?: InternshipStatus,
        createdOn?: string,
        reportingDate?: string,
        data?: File,
    ){
        this.id=id;
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.companyLogo=companyLogo;
        this.period=period;
        this.domain=domain;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.reportingDate=reportingDate;
        this.data=data;

    }
  }
  export enum Period{
    JAN = "January - April",
    MAY = "May - August",
    JULY = "September - December"
}

export enum Domain {
    TECH = 'Technology',
    ENGINEERING = 'Engineering',
    ENGINEERINGTECH = 'Technology & Engineering',
    BUSINESS = 'Business',
    HOSPITALITY = 'Hotel & Hospitality',
    BUILDING = 'Building and constrution',
    TELECOMS = 'Telecoms',
    TEACHING = 'Teaching'
}
export enum InternshipStatus{
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}

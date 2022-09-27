export class AdvertDetails{
    id?: number;
    internshipTitle?: string;
    companyName?: string;
    companyEmail?: string;
    period?: Period;
    domain?: Domain;
    constructor(
        id?: number,
        internshipTitle?: string,
        companyName?: string,
        companyEmail?: string,
        period?: Period,
        domain?: Domain,

    ){
        this.id=id;
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.period=period;
        this.domain=domain
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

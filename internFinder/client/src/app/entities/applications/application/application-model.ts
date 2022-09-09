export class ApplicationResponse{
    id?: number;
    applicationId?: number;
    internshipId?: number;
    applicantEmail?: string;
    status?: Status;
    constructor(
        id?: number,
        applicationId?: number,
        internshipId?: number,
        applicantEmail?: string,
        status?: Status,     
    ){
        this.id=id;
        this.applicationId=applicationId;
        this.internshipId=internshipId;
        this.applicantEmail=applicantEmail;
        this.status=status
    }
}
export enum Status{
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IGNORED = 'IGNORED',
}
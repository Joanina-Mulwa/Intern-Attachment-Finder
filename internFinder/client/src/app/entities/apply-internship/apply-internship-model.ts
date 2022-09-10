export class ApplyInternship {
    id?: number;
    internshipId?: number;
    appliedBy?: string;
    appliedOn?: string;
    postedBy?: string;
    introduction?: string;
    reason?: string;
    strength?: string;
    weakness?: string;
    resume?: string;
    status?: Status;
    constructor(
        id?: number,
        internshipId?: number,
        appliedBy?: string,
        appliedOn?: string,
        postedBy?: string,
        introduction?: string,
        reason?: string,
        strength?: string,
        weakness?: string,
        resume?: string,
        status?: Status,
    ) {
        this.id = id;
        this.internshipId = internshipId;
        this.appliedBy = appliedBy;
        this.appliedOn = appliedOn;
        this.postedBy = postedBy;
        this.introduction = introduction;
        this.reason = reason;
        this.strength = strength;
        this.weakness = weakness;
        this.resume = resume;
        this.status=status;
    }
}
export enum Status{
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IGNORED = 'IGNORED',
}

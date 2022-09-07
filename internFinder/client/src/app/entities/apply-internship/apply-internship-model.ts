export class ApplyInternship {
    [x: string]: any;
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
    }
}

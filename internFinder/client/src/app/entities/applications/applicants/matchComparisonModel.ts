export class MatchComparisonModel {
    email?: string;
    matchCount?: number;

    constructor(
        email?: string,
        matchCount?: number,
    ) {
        this.email=email;
        this.matchCount=matchCount;
    }

}
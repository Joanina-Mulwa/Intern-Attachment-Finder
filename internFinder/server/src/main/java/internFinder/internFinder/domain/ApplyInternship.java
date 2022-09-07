package internFinder.internFinder.domain;

import javax.persistence.*;
import java.io.File;

@Entity
@Table(name="tbl_apply_internship")
public class ApplyInternship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long internshipId;

    public String appliedBy;

    public String appliedOn;

    public String postedBy;

    public String introduction;

    public String reason;

    public String strength;

    public String weakness;

    public String resume;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public String getAppliedBy() {
        return appliedBy;
    }

    public void setAppliedBy(String appliedBy) {
        this.appliedBy = appliedBy;
    }

    public String getAppliedOn() {
        return appliedOn;
    }

    public void setAppliedOn(String appliedOn) {
        this.appliedOn = appliedOn;
    }

    public String getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(String postedBy) {
        this.postedBy = postedBy;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }

    public String getWeakness() {
        return weakness;
    }

    public void setWeakness(String weakness) {
        this.weakness = weakness;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    @Override
    public String toString() {
        return "InternshipApplication{" +
                "id=" + id +
                ", internshipId=" + internshipId +
                ", appliedBy='" + appliedBy + '\'' +
                ", appliedOn='" + appliedOn + '\'' +
                ", postedBy='" + postedBy + '\'' +
                ", introduction='" + introduction + '\'' +
                ", reason='" + reason + '\'' +
                ", strength='" + strength + '\'' +
                ", weakness='" + weakness + '\'' +
                ", resume=" + resume +
                '}';
    }
}

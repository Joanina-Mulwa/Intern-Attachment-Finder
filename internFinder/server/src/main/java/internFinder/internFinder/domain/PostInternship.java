package internFinder.internFinder.domain;

import internFinder.internFinder.domain.enumarations.InternshipStatus;
import internFinder.internFinder.domain.enumarations.InternshipType;
import internFinder.internFinder.domain.enumarations.WorkPlaceType;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Table(name = "tbl_post_internship")
public class PostInternship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String internshipTitle;

    public String companyName;

    public String companyEmail;

    @Enumerated(EnumType.STRING)
    public WorkPlaceType workPlaceType;

    @Enumerated(EnumType.STRING)
    public InternshipStatus internshipStatus;

    public String location;
    @Enumerated(EnumType.STRING)
    public InternshipType internshipType;

    public String reportingDate;

    public String vacancy;

    public String description;

    public String skills;

    public String responsibilities;

    public String important;

    private LocalDateTime createdOn;

    private String createdBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInternshipTitle() {
        return internshipTitle;
    }

    public void setInternshipTitle(String internshipTitle) {
        this.internshipTitle = internshipTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyEmail() {
        return companyEmail;
    }

    public void setCompanyEmail(String companyEmail) {
        this.companyEmail = companyEmail;
    }

    public WorkPlaceType getWorkPlaceType() {
        return workPlaceType;
    }

    public void setWorkPlaceType(WorkPlaceType workPlaceType) {
        this.workPlaceType = workPlaceType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public InternshipType getInternshipType() {
        return internshipType;
    }

    public void setEmploymentType(InternshipType internshipType) {
        this.internshipType = internshipType;
    }

    public InternshipStatus getInternshipStatus() {
        return internshipStatus;
    }

    public void setInternshipStatus(InternshipStatus internshipStatus) {
        this.internshipStatus = internshipStatus;
    }

    public String getReportingDate() {
        return reportingDate;
    }

    public void setReportingDate(String reportingDate) {
        this.reportingDate = reportingDate;
    }

    public String getVacancy() {
        return vacancy;
    }

    public void setVacancy(String vacancy) {
        this.vacancy = vacancy;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(String responsibilities) {
        this.responsibilities = responsibilities;
    }

    public String getImportant() {
        return important;
    }

    public void setImportant(String important) {
        this.important = important;
    }

    public void setInternshipType(InternshipType internshipType) {
        this.internshipType = internshipType;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public String toString() {
        return "PostInternship{" +
                "id=" + id +
                ", internshipTitle='" + internshipTitle + '\'' +
                ", companyName='" + companyName + '\'' +
                ", companyEmail='" + companyEmail + '\'' +
                ", workPlaceType=" + workPlaceType +
                ", internshipStatus=" + internshipStatus +
                ", location='" + location + '\'' +
                ", internshipType=" + internshipType +
                ", reportingDate='" + reportingDate + '\'' +
                ", vacancy='" + vacancy + '\'' +
                ", description='" + description + '\'' +
                ", skills='" + skills + '\'' +
                ", responsibilities='" + responsibilities + '\'' +
                ", important='" + important + '\'' +
                ", createdOn='" + createdOn + '\'' +
                ", createdBy='" + createdBy + '\'' +
                '}';
    }
}

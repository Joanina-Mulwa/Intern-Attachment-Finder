package internFinder.internFinder.domain;

import internFinder.internFinder.domain.enumarations.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;


@Entity
@Table(name = "tbl_post_internship")
public class PostInternship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private String name;

    private String type;

    @Lob
    private byte[] data;

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

    public Long internshipPeriod;

    public String reportingDate;

    public String vacancy;

    public String description;

    public String skills;

    public String responsibilities;

    public String important;

    private LocalDate createdOn;

    private String createdBy;

    private String minimumQualification;

    private String experienceLevel;

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }

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

    public Long getInternshipPeriod() {
        return internshipPeriod;
    }

    public void setInternshipPeriod(Long internshipPeriod) {
        this.internshipPeriod = internshipPeriod;
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

    public LocalDate getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDate createdOn) {
        this.createdOn = createdOn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getMinimumQualification() {
        return minimumQualification;
    }

    public void setMinimumQualification(String  minimumQualification) {
        this.minimumQualification = minimumQualification;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }



    public PostInternship() {
    }

    public PostInternship(String name, String type, byte[] data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
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
                ", internshipPeriod=" + internshipPeriod +
                ", reportingDate='" + reportingDate + '\'' +
                ", vacancy='" + vacancy + '\'' +
                ", description='" + description + '\'' +
                ", skills='" + skills + '\'' +
                ", responsibilities='" + responsibilities + '\'' +
                ", important='" + important + '\'' +
                ", createdOn=" + createdOn +
                ", createdBy='" + createdBy + '\'' +
                ", minimumQualification='" + minimumQualification + '\'' +
                ", experienceLevel='" + experienceLevel + '\'' +
                '}';
    }
}

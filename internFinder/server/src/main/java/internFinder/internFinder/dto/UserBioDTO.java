package internFinder.internFinder.dto;

import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.Category;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Data
public class UserBioDTO {

    //private Long id;

    private String email;

    @Enumerated(EnumType.STRING)
    private UserAuthority authority;

    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String createdOn;

    private String createdBy;

    private String name;

    private String username;

    private String institution;

    private String programme;

    private String course;

    private String skills;

    private String companyName;

    private String companyEmail;

    private String companyLocation;

    private String companyDescription;

    private String companyWorkingHours;

    private String companyLogo;

    private String companyIndustry;

    private String companyWebsite;

    private Long companyNumberOfEmployees;

    private String companyPostalAddress;

    private String companyPhoneNumber;

    private String experienceLevel;

    private String experience;

    private String about;

    public UserBioDTO() {
    }

    public UserBioDTO(User user) {
        //this.setId(authenticateUser.getId());
        this.setEmail(user.getEmail());
        this.setAuthority(user.getAuthority());
        this.setProfileImageUrl(user.getProfileImageUrl());
        this.setCreatedOn(user.getCreatedOn());
        this.setCreatedBy(user.getCreatedBy());
        this.setName(user.getName());
        this.setUsername(user.getUsername());
        this.setInstitution(user.getInstitution());
        this.setProgramme(user.getProgramme());
        this.setCourse(user.getCourse());
        this.setSkills(user.getSkills());
        this.setCompanyName(user.getCompanyName());
        this.setCompanyEmail(user.getCompanyEmail());
        this.setCompanyLocation(user.getCompanyLocation());
        this.setCompanyDescription(user.getCompanyDescription());
        this.setCompanyWorkingHours(user.getCompanyWorkingHours());
        this.setCompanyLogo(user.getCompanyLogo());
        this.setCompanyIndustry(user.getCompanyIndustry());
        this.setCompanyWebsite(user.getCompanyWebsite());
        this.setCompanyNumberOfEmployees(user.getCompanyNumberOfEmployees());
        this.setCompanyPostalAddress(user.getCompanyPostalAddress());
        this.setCompanyPhoneNumber(user.getCompanyPhoneNumber());
        this.setExperienceLevel(user.getExperienceLevel());
        this.setExperience(user.getExperience());
        this.setAbout(user.getAbout());

    }

}



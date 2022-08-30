package internFinder.internFinder.dto;

import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.Category;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import lombok.Data;

import javax.persistence.*;

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

    public UserBioDTO() {
    }

    public UserBioDTO(User user) {
        //this.setId(authenticateUser.getId());
        this.setEmail(user.getEmail());
        this.setAuthority(user.getAuthority());
        this.setProfileImageUrl(user.getProfileImageUrl());
        this.setCreatedOn(user.getCreatedOn());
        this.setCreatedOn(user.getCreatedBy());
        this.setName(user.getName());
        this.setUsername(user.getUsername());
        this.setInstitution(user.getInstitution());
        this.setProgramme(user.getProgramme());
        this.setCourse(user.getCourse());
        this.setSkills(user.getSkills());
        this.setCompanyName(user.getCompanyName());
        this.setCompanyEmail(user.getCompanyEmail());

    }

}



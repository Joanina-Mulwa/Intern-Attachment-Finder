package internFinder.internFinder.domain;

import com.sun.istack.NotNull;
import internFinder.internFinder.domain.enumarations.IdentityProvider;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import internFinder.internFinder.domain.enumarations.UserStatus;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "tbl_user")
public class User {
    @Id
    @Column(nullable = false)
    public String email;

//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @NotNull
    public String password;

//    @Enumerated(EnumType.STRING)
//    public Category category;

    @Enumerated(EnumType.STRING)
    private UserAuthority authority;

    @Enumerated(EnumType.STRING)
    private UserStatus userStatus;

    @Enumerated(EnumType.STRING)
    private IdentityProvider identityProvider;

    private String name;

    private int active;

    private String roles="";

    private String permissions="";

    //UserBioData
    private String profileImageUrl;

    private String createdOn;

    private String createdBy;

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


    public User() {
    }

    public String getEmail() {

        return email;
    }

    public String getPassword() {

        return password;
    }

    public IdentityProvider getIdentityProvider() {
        return identityProvider;
    }

    public int getActive() {
        return active;
    }

    public String getRoles() {
        return roles;
    }

    public String getPermissions() {
        return permissions;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public Category getCategory() {
//        return category;
//    }
//
//    public void setCategory(Category category) {
//        this.category = category;
//    }

    public void setActive(int active) {
        this.active = active;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }

    public List<String> getRolesList(){
        if(this.roles != null){
            return Arrays.asList(this.roles.split(","));
        }
        return new ArrayList<>();
    }

    public List<String> getPermissionsList(){
        if(this.permissions != null){
            return Arrays.asList(this.permissions.split(","));
        }
        return new ArrayList<>();
    }

    public String getAuthorityName(){
        if (this.authority != null){
            return authority.name();
        }
        return "";
    }

//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserAuthority getAuthority() {
        return authority;
    }

    public void setAuthority(UserAuthority authority) {
        this.authority = authority;
    }

    public UserStatus getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(UserStatus userStatus) {
        this.userStatus = userStatus;
    }

    public void setIdentityProvider(IdentityProvider identityProvider) {
        this.identityProvider = identityProvider;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public String getProgramme() {
        return programme;
    }

    public void setProgramme(String programme) {
        this.programme = programme;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
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

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getCompanyWorkingHours() {
        return companyWorkingHours;
    }

    public void setCompanyWorkingHours(String companyWorkingHours) {
        this.companyWorkingHours = companyWorkingHours;
    }

    public String getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getCompanyIndustry() {
        return companyIndustry;
    }

    public void setCompanyIndustry(String companyIndustry) {
        this.companyIndustry = companyIndustry;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public Long getCompanyNumberOfEmployees() {
        return companyNumberOfEmployees;
    }

    public void setCompanyNumberOfEmployees(Long companyNumberOfEmployees) {
        this.companyNumberOfEmployees = companyNumberOfEmployees;
    }

    public String getCompanyPostalAddress() {
        return companyPostalAddress;
    }

    public void setCompanyPostalAddress(String companyPostalAddress) {
        this.companyPostalAddress = companyPostalAddress;
    }

    public String getCompanyPhoneNumber() {
        return companyPhoneNumber;
    }

    public void setCompanyPhoneNumber(String companyPhoneNumber) {
        this.companyPhoneNumber = companyPhoneNumber;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", authority=" + authority +
                ", userStatus=" + userStatus +
                ", identityProvider=" + identityProvider +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", roles='" + roles + '\'' +
                ", permissions='" + permissions + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                ", createdOn='" + createdOn + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", username='" + username + '\'' +
                ", institution='" + institution + '\'' +
                ", programme='" + programme + '\'' +
                ", course='" + course + '\'' +
                ", skills='" + skills + '\'' +
                ", companyName='" + companyName + '\'' +
                ", companyEmail='" + companyEmail + '\'' +
                ", companyLocation='" + companyLocation + '\'' +
                ", companyDescription='" + companyDescription + '\'' +
                ", companyWorkingHours='" + companyWorkingHours + '\'' +
                ", companyLogo='" + companyLogo + '\'' +
                ", companyIndustry='" + companyIndustry + '\'' +
                ", companyWebsite='" + companyWebsite + '\'' +
                ", companyNumberOfEmployees=" + companyNumberOfEmployees +
                ", companyPostalAddress='" + companyPostalAddress + '\'' +
                ", companyPhoneNumber='" + companyPhoneNumber + '\'' +
                ", experienceLevel='" + experienceLevel + '\'' +
                ", experience='" + experience + '\'' +
                ", about='" + about + '\'' +
                '}';
    }
}


package internFinder.internFinder.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "tbl_applications")
@Getter
@Setter
public class ApplyAdvert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    private String name;

    private String type;

    private String url;

    @Lob
    private byte[] data;

    public Long internshipId;

    public String appliedBy;

    public String appliedOn;

    public String postedBy;

    public String postedByEmail;

    public String status;

    public String parsedApplicationIdentifier;

    public String parsedSkills;

    public ApplyAdvert(String name, String type, byte[] data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }
    public ApplyAdvert(Long internshipId, String appliedBy, String appliedOn, String postedBy, String postedByEmail, String parsedApplicationIdentifier, String parsedSkills) {
        this.internshipId=internshipId;
        this.appliedBy=appliedBy;
        this.appliedOn=appliedOn;
        this.postedBy=postedBy;
        this.postedByEmail=postedByEmail;
        this.parsedApplicationIdentifier = parsedApplicationIdentifier;
        this.parsedSkills = parsedSkills;
    }

    public ApplyAdvert(Long internshipId, String appliedBy, String appliedOn, String postedBy, String postedByEmail, String status, String parsedApplicationIdentifier, String parsedSkills) {
        this.internshipId=internshipId;
        this.appliedBy=appliedBy;
        this.appliedOn=appliedOn;
        this.postedBy=postedBy;
        this.postedByEmail=postedByEmail;
        this.status=status;
        this.parsedApplicationIdentifier = parsedApplicationIdentifier;
        this.parsedSkills = parsedSkills;
    }

    public ApplyAdvert() {

    }
    public List<String> getParsedSkillsList(){
        if(this.parsedSkills != null){
            return Arrays.asList(this.parsedSkills.split(","));
        }
        return new ArrayList<>();
    }

    @Override
    public String toString() {
        return "ApplyAdvert{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", url='" + url + '\'' +
                ", data=" + Arrays.toString(data) +
                ", internshipId=" + internshipId +
                ", appliedBy='" + appliedBy + '\'' +
                ", appliedOn='" + appliedOn + '\'' +
                ", postedBy='" + postedBy + '\'' +
                ", postedByEmail='" + postedByEmail + '\'' +
                ", status='" + status + '\'' +
                ", parsedApplicationIdentifier='" + parsedApplicationIdentifier + '\'' +
                ", parsedSkills='" + parsedSkills + '\'' +
                '}';
    }
}

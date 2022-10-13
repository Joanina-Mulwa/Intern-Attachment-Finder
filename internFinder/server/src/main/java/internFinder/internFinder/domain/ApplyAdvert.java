package internFinder.internFinder.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

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

    public String status;
    public ApplyAdvert(String name, String type, byte[] data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }
    public ApplyAdvert(Long internshipId, String appliedBy, String appliedOn, String postedBy) {
        this.internshipId=internshipId;
        this.appliedBy=appliedBy;
        this.appliedOn=appliedOn;
        this.postedBy=postedBy;
    }

    public ApplyAdvert(Long internshipId, String appliedBy, String appliedOn, String postedBy, String status) {
        this.internshipId=internshipId;
        this.appliedBy=appliedBy;
        this.appliedOn=appliedOn;
        this.postedBy=postedBy;
        this.status=status;
    }

    public ApplyAdvert() {

    }

    @Override
    public String toString() {
        return "ApplyAdvert{" +
                "id=" + id +
                ", internshipId=" + internshipId +
                ", appliedBy='" + appliedBy + '\'' +
                ", appliedOn='" + appliedOn + '\'' +
                ", postedBy='" + postedBy + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}

package internFinder.internFinder.domain;

import javax.persistence.*;

@Entity
@Table(name = "tbl_adverts")
public class PostAdvert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    private String type;

    private String url;

    @Lob
    private byte[] data;

    private String internshipTitle;

    private String companyName;

    private String companyEmail;

    private String companyLogo;

    private String domain;

    private String period;

    private String internshipStatus;

    private String createdOn;

    private String updatedOn;

    private String reportingDate;

    private String parsedJobIdentifier;


    public PostAdvert() {
    }

    public PostAdvert(String name, String type, byte[] data) {
        this.name = name;
        this.type = type;
        this.data = data;
    }
    public PostAdvert(String internshipTitle, String companyName, String companyEmail, String companyLogo, String domain, String period, String internshipStatus, String createdOn, String reportingDate, String parsedJobIdentifier) {
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.companyLogo=companyLogo;
        this.domain=domain;
        this.period=period;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.reportingDate=reportingDate;
        this.parsedJobIdentifier = parsedJobIdentifier;
    }
    public PostAdvert(Long id, String internshipTitle, String companyName, String companyEmail, String companyLogo, String domain, String period, String internshipStatus, String createdOn, String updatedOn, String reportingDate,String parsedJobIdentifier) {
        this.id=id;
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.companyLogo=companyLogo;
        this.domain=domain;
        this.period=period;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.updatedOn=updatedOn;
        this.reportingDate=reportingDate;
        this.parsedJobIdentifier = parsedJobIdentifier;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public String getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getInternshipStatus() {
        return internshipStatus;
    }

    public void setInternshipStatus(String internshipStatus) {
        this.internshipStatus = internshipStatus;
    }

    public String getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(String createdOn) {
        this.createdOn = createdOn;
    }

    public String getReportingDate() {
        return reportingDate;
    }

    public void setReportingDate(String reportingDate) {
        this.reportingDate = reportingDate;
    }

    public String getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(String updatedOn) {
        this.updatedOn = updatedOn;
    }



    public String getParsedJobIdentifier() {
        return parsedJobIdentifier;
    }

    public void setParsedJobIdentifier(String parsedJobIdentifier) {
        this.parsedJobIdentifier = parsedJobIdentifier;
    }
}


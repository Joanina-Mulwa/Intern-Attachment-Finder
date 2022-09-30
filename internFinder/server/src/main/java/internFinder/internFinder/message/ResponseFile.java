package internFinder.internFinder.message;

import java.time.LocalDate;

public class ResponseFile {
    private Long id;

    private String name;
    private String url;
    private String type;
    private long size;

    private String internshipTitle;

    private String companyName;

    private String companyEmail;

    private String domain;

    private String period;

    private String internshipStatus;

    private String createdOn;

    private String reportingDate;

    public ResponseFile(Long id, String name, String url, String type, long size, String internshipTitle, String companyName, String companyEmail, String domain, String period, String internshipStatus, String createdOn, String reportingDate) {
        this.id=id;
        this.name = name;
        this.url = url;
        this.type = type;
        this.size = size;
        this.internshipTitle=internshipTitle;
        this.companyName=companyName;
        this.companyEmail=companyEmail;
        this.domain=domain;
        this.period=period;
        this.internshipStatus=internshipStatus;
        this.createdOn=createdOn;
        this.reportingDate=reportingDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
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
}

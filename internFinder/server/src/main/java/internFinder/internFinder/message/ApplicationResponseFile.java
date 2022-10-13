package internFinder.internFinder.message;

public class ApplicationResponseFile {
    private Long id;

    private String name;
    private String url;
    private String type;
    private long size;
    public Long internshipId;

    public String appliedBy;

    public String appliedOn;

    public String postedBy;

    public String status;

    public ApplicationResponseFile(Long id, String name, String url, String type, long size, Long internshipId, String appliedBy, String appliedOn, String postedBy, String status) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.type = type;
        this.size = size;
        this.internshipId = internshipId;
        this.appliedBy = appliedBy;
        this.appliedOn = appliedOn;
        this.postedBy = postedBy;
        this.status = status;
    }
}

package internFinder.internFinder.vm;

public class RegisterResponseVM {

    private int code;

    private String description;

    public RegisterResponseVM(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public RegisterResponseVM() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "RegisterResponseVM{" +
                "code=" + code +
                ", description='" + description + '\'' +
                '}';
    }
}

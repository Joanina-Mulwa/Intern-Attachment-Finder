package internFinder.internFinder.vm;

import lombok.Data;

@Data
public class JWTResponseVM {
    private String bearerToken;

    private String authority;

    private int code;

    private String description;

    public JWTResponseVM(String bearerToken, String authority) {
        this.bearerToken = bearerToken;
        this.authority = authority;
        this.code = 200;
        this.description = "successful";
    }

    public JWTResponseVM(int code, String description) {
        this.code = code;
        this.description = description;
    }
}

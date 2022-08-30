package internFinder.internFinder.Security;

import org.springframework.security.core.GrantedAuthority;

public class InternFinderAuthority implements GrantedAuthority {
    private String authority;

    public InternFinderAuthority(String authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    @Override
    public String toString() {
        return "InternFinderAuthority{" +
                "authority='" + authority + '\'' +
                '}';
    }
}

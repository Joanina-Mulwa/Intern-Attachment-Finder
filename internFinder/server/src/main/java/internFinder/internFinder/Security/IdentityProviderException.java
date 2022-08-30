package internFinder.internFinder.Security;

import org.springframework.security.core.AuthenticationException;

public class IdentityProviderException extends AuthenticationException {

    public IdentityProviderException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public IdentityProviderException(String msg) {
        super(msg);
    }
}

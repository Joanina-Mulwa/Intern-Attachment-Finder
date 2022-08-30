package internFinder.internFinder.vm;

import internFinder.internFinder.domain.enumarations.UserAuthority;
import lombok.Data;

@Data
public class RegisterUserVM {
    private String email;

    private String password;

    private UserAuthority authority;
}

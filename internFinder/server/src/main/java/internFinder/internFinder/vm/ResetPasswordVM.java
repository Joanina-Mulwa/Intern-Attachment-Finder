package internFinder.internFinder.vm;

import internFinder.internFinder.domain.enumarations.UserAuthority;
import lombok.Data;

@Data
public class ResetPasswordVM {

        private String email;

        private String password;


}

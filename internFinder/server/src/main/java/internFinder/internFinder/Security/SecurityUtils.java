package internFinder.internFinder.Security;

import internFinder.internFinder.Security.jwt.CustomAuthentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SecurityUtils {
    public SecurityUtils() {

    }

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        //SecurityContext securityContext1=SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return Optional.ofNullable(securityContext.getAuthentication())
                .map(authentication -> {
                    if (authentication instanceof CustomAuthentication) {
                        return authentication.getName();
                    }
                    return null;
                });
    }

    public static Optional<String> getCurrentUseEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return Optional.ofNullable(authentication.getName());
    }

    public static Optional<String> getCurrentUserLogin2() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        if (securityContext.getAuthentication() != null) {
            return Optional.ofNullable(securityContext.getAuthentication().getName());
        }
        return Optional.empty();
    }

    public static String getCurrentUserLogin3() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Yaa my method got user,"+authentication);
        System.out.println("name is "+authentication.getName());
        String email = authentication.getPrincipal().toString();
        System.out.println("Helooooo"+ email);
        if (authentication instanceof CustomAuthentication) {
            return authentication.getName();
        }else{
            System.out.println("No User Found currently logged in");
            return null;
        }
    }


}

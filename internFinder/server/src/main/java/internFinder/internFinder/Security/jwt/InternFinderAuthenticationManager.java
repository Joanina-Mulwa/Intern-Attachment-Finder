package internFinder.internFinder.Security.jwt;

import internFinder.internFinder.Security.IdentityProviderException;
import internFinder.internFinder.Security.InternFinderAuthority;
import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.IdentityProvider;
import internFinder.internFinder.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class InternFinderAuthenticationManager implements AuthenticationManager {
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public InternFinderAuthenticationManager(PasswordEncoder passwordEncoder, UserService userService) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        String username = authentication.getPrincipal().toString();
        String password = authentication.getCredentials().toString();

        Optional<User> optionalUser = userService.findByEmail(username);

        // check if user exists
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("Username not registered");
        }

        User user = optionalUser.get();

        if (password.isEmpty() || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }

        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new InternFinderAuthority(user.getAuthorityName()));


        return new CustomAuthentication(grantedAuthorities, null, username, true, user.getEmail(), user.getIdentityProvider());
    }

    public User authenticateAndReturnUser(Authentication authentication) throws AuthenticationException {

        String email = authentication.getPrincipal().toString();
        String password = authentication.getCredentials().toString();

        System.out.println("Found the user of email "+ email + " and password "+ password);


        Optional<User> optionalUser = userService.findByEmail(email);

        // check if user exists
        if (optionalUser.isEmpty()) {
            System.out.println("Username not registered");

            throw new UserNotFoundException("Username not registered");
        }

        User user = optionalUser.get();


        if (user.getIdentityProvider() == IdentityProvider.GOOGLE){
            System.out.println("Login not allowed for identity provider");

            throw new IdentityProviderException("Login not allowed for identity provider");
        }

        if (password.isEmpty() || !passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Invalid Credentials");
            throw new BadCredentialsException("Invalid Credentials");
        }
        System.out.println("The user to be logged in will be "+ user);

        return user;
    }
}

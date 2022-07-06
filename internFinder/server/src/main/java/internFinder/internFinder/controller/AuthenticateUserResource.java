package internFinder.internFinder.controller;

import internFinder.internFinder.domain.AuthenticateUser;
import internFinder.internFinder.security.jwt.JwtTokenProvider;
import internFinder.internFinder.service.AuthenticateUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static internFinder.internFinder.domain.enumarations.UserAuthority.USER;
import static internFinder.internFinder.domain.enumarations.UserPermission.*;

@Slf4j
@RestController
@RequestMapping("/api")
public class AuthenticateUserResource {
    private final AuthenticateUserService authenticateUserService;
    private final PasswordEncoder passwordEncoder;
    public static final int logRounds = 10;

    private final JwtTokenProvider jwtTokenProvider;


    public AuthenticateUserResource(AuthenticateUserService authenticateUserService,
                                    PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.authenticateUserService = authenticateUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/userLogin")
    public JwtLogin loginUser(@RequestBody AuthenticateUser authenticateUser) {
        log.debug("Rest request to login user {} ",authenticateUser );
        String userEmail = authenticateUser.getEmail();
        String userPassword = authenticateUser.getPassword();
        AuthenticateUser optionalUser = authenticateUserService.findByEmail(userEmail);
        Optional<?>optional= Optional.ofNullable(optionalUser);
        if (optional.isPresent()) {
            System.out.println("Password provided is : "+ userPassword);
            String newHashPassword = passwordEncoder.encode(userPassword);
            System.out.println("Currently Hashed pass is : "+ newHashPassword);
            String dbHashPassword = optionalUser.password;
            System.out.println("Database Hashed Pass is: "+ dbHashPassword);
            System.out.println("Result is "+ passwordEncoder.matches(userPassword,dbHashPassword));

            if (passwordEncoder.matches(userPassword,dbHashPassword)) {
                authenticateUserService.loginUser(authenticateUser);
                log.debug("Login success");
                System.out.println("Login success");
                return new JwtLogin(jwtTokenProvider.generateToken(optionalUser.getEmail(), ""));

//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.add("Authorization", "Bearer " + jwtToken);
//        return new ResponseEntity<>(jwtToken, httpHeaders, HttpStatus.OK);

            } else {
                log.debug("Incorrect password");
                System.out.println("Incorrect password");
            }
        } else {
            log.debug("Register, user does not exist");
            System.out.println("Register, user does not exist");
        }
        return null;
    }



    @PostMapping("/register")
    public AuthenticateUser registerUser(@RequestBody AuthenticateUser authenticateUser) {
        System.out.println("REST request to create user " + authenticateUser);

        String userEmail = authenticateUser.getEmail();
        String userPassword = authenticateUser.getPassword();

        AuthenticateUser optionalUser = authenticateUserService.findByEmail(userEmail);

        Optional<?>optional= Optional.ofNullable(optionalUser);

        if (optional.isPresent()) {
            log.debug("Login, user already exist");
            System.out.print("Login, user already exist");
        } else {
            if (userPassword.length() < 5) {
                log.debug("Input valid credentials");
                System.out.print("Input valid credentials");
            } else {

                AuthenticateUser saveUser = new AuthenticateUser();
                saveUser.setEmail(userEmail);
                //saveUser.setPassword(userPassword);
                saveUser.setPassword(passwordEncoder.encode(userPassword));
                saveUser.setRoles(USER.name());
                saveUser.setPermissions(READ.name());
                saveUser.setPermissions(WRITE.name());
                saveUser.setPermissions(UPDATE.name());
                saveUser.setActive(1);
                return authenticateUserService.registerUser(saveUser);

            }
        }

        return authenticateUser;
    }

    @GetMapping("/findRegistered")
    public List<AuthenticateUser> findAll() {
        log.debug("REST request to find all Registered users");
        return authenticateUserService.findAll();
    }



    @GetMapping("/findByEmail/{email}")
    public AuthenticateUser findByEmail(@PathVariable String email){
        log.debug("REST request to find user by email : {}", email);
        return authenticateUserService.findByEmail(email);
    }

    @PostMapping("/resetPassword")
    public AuthenticateUser resetPassword(@RequestBody AuthenticateUser authenticateUser){
        log.debug("REST request to reset password");
        authenticateUserService.resetPassword(authenticateUser);
        AuthenticateUser saveUser = new AuthenticateUser();
        String userEmail = authenticateUser.getEmail();
        String userPassword = authenticateUser.getPassword();
        saveUser.setEmail(userEmail);
        //saveUser.setPassword(userPassword);
        saveUser.setPassword(passwordEncoder.encode(userPassword));
        saveUser.setRoles(USER.name());
        saveUser.setPermissions(READ.name());
        saveUser.setPermissions(WRITE.name());
        saveUser.setPermissions(UPDATE.name());
        saveUser.setActive(1);
        return authenticateUserService.registerUser(saveUser);

    }


    static class JwtLogin {
        private String jwt;

        public JwtLogin(String jwt) {
            this.jwt = jwt;
        }

        public String getJwt() {
            return jwt;
        }
    }


}


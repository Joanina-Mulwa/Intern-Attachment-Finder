package internFinder.internFinder.controller;

import internFinder.internFinder.Security.IdentityProviderException;
import internFinder.internFinder.Security.SecurityUtils;
import internFinder.internFinder.Security.jwt.InternFinderAuthenticationManager;
import internFinder.internFinder.Security.jwt.TokenProvider;
import internFinder.internFinder.domain.PostAdvert;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.Category;
import internFinder.internFinder.domain.enumarations.IdentityProvider;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import internFinder.internFinder.dto.UserBioDTO;
import internFinder.internFinder.service.UserService;
import internFinder.internFinder.vm.JWTResponseVM;
import internFinder.internFinder.vm.LoginVM;
import internFinder.internFinder.vm.RegisterResponseVM;
import internFinder.internFinder.vm.RegisterUserVM;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserResource {

    private final UserService userService;


    private final TokenProvider tokenProvider;

    private final InternFinderAuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    public UserResource(UserService userService, TokenProvider tokenProvider, InternFinderAuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseVM> register(@RequestBody RegisterUserVM registerUserVM) {
        log.debug("REST request to register user : {}", registerUserVM);

        String email = registerUserVM.getEmail();
        String password = registerUserVM.getPassword();
        UserAuthority authority = registerUserVM.getAuthority();

        Optional<User> userOptional = userService.findByEmail(email);

        if (userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponseVM(400, "email address already used"));
        }
        else {

//            if (password.length() < 5) {
//                log.debug("Input valid credentials");
//                System.out.print("Input valid credentials");
//                ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(new RegisterResponseVM(206, "The password provided is too short"))
//            } else {

            this.userService.create(email, password, authority);
            return ResponseEntity.ok().body(new RegisterResponseVM(200, "Account successfully created"));
            //}

        }


    }

    @PostMapping("/resetPassword")
    public Optional<User> resetPassword(@RequestBody User user){
        log.debug("REST request to reset password");
        return userService.resetPassword(user);
    }


    @PostMapping("/login")
    public ResponseEntity<JWTResponseVM> login(@RequestBody LoginVM loginVM) {
        String email = loginVM.getEmail();
        String password = loginVM.getPassword();
        System.out.println("Login in user of email "+ email + " and password"+ password);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email,
                password
        );

        try {
            User user = authenticationManager.authenticateAndReturnUser(authenticationToken);

            System.out.println("I need to see details"+ user);

            long expiryTime = 86400 + (System.currentTimeMillis() / 1000);
            String jwt = tokenProvider.createToken(email, IdentityProvider.LOCAL, expiryTime, user.getAuthorityName());
            System.out.println("Created jwt"+ jwt);
            return ResponseEntity.ok().body(new JWTResponseVM(jwt, user.getAuthority().name()));
        } catch (IdentityProviderException exception) {
            System.out.println("Error authenticating user bad request");
            log.warn("Error authenticating user", exception);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new JWTResponseVM(400, "Please log in with google"));
        } catch (AuthenticationException exception) {
            System.out.println("Error authenticating user unauthorized");
            log.warn("Error authenticating user", exception);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new JWTResponseVM(401, "invalid username or password"));
        }
    }



    @GetMapping("/user/profile")
    public User getProfile() {
        log.info("REST request to get current user profile");
        String email = SecurityUtils.getCurrentUserLogin3();
        System.out.println("Email of currently logged in user is "+ email);

        String email2 = SecurityUtils.getCurrentUseEmail().orElseThrow();

        System.out.println("Email of currently logged in user 2 is "+ email2);

        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("Invalid email address : " + email);
        }

        return userOptional.get();
    }

    @PutMapping("/update")
    public void updateUser(@RequestBody UserBioDTO userBioDTO) {
        log.info("REST request to update user : {}", userBioDTO);
        userBioDTO.setProfileImageUrl(ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/downloadProfilePicture/")
                .path(String.valueOf(userBioDTO.getEmail()))
                .toUriString());
        userService.updateUser(userBioDTO);
    }
    @GetMapping("/downloadProfilePicture/{email}")
    public ResponseEntity<byte[]> downloadProfilePicture(@PathVariable String email) {
        User user = userService.downloadProfilePicture((email));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + user.getProfileImageName() + "\"")
                .body(user.getProfileImageData());
    }

    @DeleteMapping("/deleteUserAndActions/{email}")
    public void deleteUserAndActions(@PathVariable String email){
        log.info("REST request to delete user and actions {}", email);
        userService.deleteUserAndActions(email);

    }

    @GetMapping("/user/bio")
    public ResponseEntity<UserBioDTO> getUserBio() {

        log.info("REST request to get User Bio Info");

        String email = SecurityUtils.getCurrentUseEmail().orElseThrow();

        System.out.println("Email of currently logged in user is "+ email);

        Optional<UserBioDTO> userBioDTOOptional = userService.getUserBioByEmail(email);

        System.out.println("Found details of current logged in user: "+ userBioDTOOptional);

        return ResponseEntity.of(userBioDTOOptional);
    }

    @GetMapping("/user/bio/{username}")
    public ResponseEntity<UserBioDTO> getUserBioByUsername(@PathVariable String username) {

        log.info("REST request to get User Bio Info for user : {}", username);


        Optional<UserBioDTO> userBioDTOOptional = userService.getUserBioByUsername(username);

        return ResponseEntity.of(userBioDTOOptional);
    }

    @GetMapping("/findByEmail/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        log.debug("REST request to find user by email : {}", email);
        return userService.findByEmail(email);
    }

    @GetMapping("/findAll")
    public List<User> getAllUsersBio() {

        log.info("REST request to get all Users Bio Info");

        return userService.getAllUsersBio();
    }

    @GetMapping("/user/search")
    public List<User> findAll(@RequestParam(required = false) String text) {
        log.debug("REST request to search all users with text : {}", text);

        if (text == null) {
            text = "";
        }

        return userService.search(text);
    }

    @GetMapping("/getCategory/{email}")
    public UserAuthority getCategory(@PathVariable String email){
        System.out.println("REST request to get category for user " + email);
        Optional<User> userOptional = userService.findByEmail(email);
        System.out.println(userOptional);
        UserAuthority authority = userOptional.get().getAuthority();
        System.out.println("Found category"+authority);
        return authority;
    }



    private boolean isPasswordLengthInvalid(String password) {
        return (
                StringUtils.isEmpty(password) ||
                        password.length() < 4 ||
                        password.length() > 100
        );
    }


}

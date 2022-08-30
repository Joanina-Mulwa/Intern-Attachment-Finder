package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.Category;
import internFinder.internFinder.domain.enumarations.IdentityProvider;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import internFinder.internFinder.dto.UserBioDTO;
import internFinder.internFinder.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import static internFinder.internFinder.domain.enumarations.UserAuthority.STUDENT;
import static internFinder.internFinder.domain.enumarations.UserPermission.*;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        log.info("Request to find user with email : {}", email);

        Optional<User> user = userRepository.findByEmail(email);
        log.info("Found user : {}", user);
        return user;
    }

    public Optional<UserBioDTO> getUserBioByEmail(String email) {
        log.debug("Request to find user with email : {}", email);

        Optional<UserBioDTO> userBioDTOOptional = Optional.empty();
        //Get the user by email.
        return userRepository.findByEmail(email).map(
                user -> {
                    return new UserBioDTO(user);
                }
        );

    }

    public Optional<UserBioDTO> getUserBioByUsername(String username) {
        log.debug("Request to find user with username : {}", username);

        //Get the user by email.
        return userRepository.findByUsername(username).map(
                UserBioDTO::new
        );

    }

    public List<User> getAllUsersBio() {
        log.debug("Request to get all Users Bio Info");

        //Get the user by email.
         return userRepository.findAll();
    }

    public List<User> findAll() {
        log.debug("Request to find All users");
        return userRepository.findAll();
    }

    public User create(String email, String password, UserAuthority authority) {
        log.debug("Request to register user with email : {}", email);

        User saveUser = new User();
        saveUser.setEmail(email);
        saveUser.setPassword(passwordEncoder.encode(password));
        saveUser.setAuthority(authority);

        saveUser.setUsername(getUsernameFromEmail(email));
        saveUser.setIdentityProvider(IdentityProvider.LOCAL);
        saveUser.setCreatedOn(LocalDateTime.now().toString());
        saveUser.setCreatedBy(email);
        saveUser.setRoles(String.valueOf(authority));
        saveUser.setPermissions(READ.name());
        saveUser.setPermissions(WRITE.name());
        saveUser.setPermissions(UPDATE.name());
        saveUser.setActive(1);
        System.out.println("Created user," + saveUser);
        return  userRepository.save(saveUser);

    }

    public String getUsernameFromEmail(String email) {
        String firstPartOfEmail = email.split("@")[0].trim();
        if (!firstPartOfEmail.isEmpty()) {
            Optional<User> optionalUser = userRepository.findByUsername(firstPartOfEmail);

            if (optionalUser.isPresent()) {
                firstPartOfEmail = firstPartOfEmail + (10 + new Random().nextInt(89));
            }

            optionalUser = userRepository.findByUsername(firstPartOfEmail);

            if (optionalUser.isPresent()) {
                firstPartOfEmail = firstPartOfEmail + (100 + new Random().nextInt(899));
            }
        }
        return firstPartOfEmail;
    }


    public Optional<User> resetPassword(User user){
        log.debug("Request to reset password of user : {} ", user);
        String email = user.getEmail();
        String password = user.getPassword();
        System.out.println("Request to reset password for user "+ email);
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            User user1 = userOptional.get();
            user1.setPassword(passwordEncoder.encode(password));
            userRepository.save(user1);

        }

        return userOptional;

    }


    public void updateUser(UserBioDTO userBioDTO) throws UserNotFoundException {
        log.debug("Request to update user : {}", userBioDTO);

        //get the user
        Optional<User> userOptional = this.userRepository.findById(userBioDTO.getEmail());


        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAuthority(userBioDTO.getAuthority());
            user.setRoles(userBioDTO.getAuthority().name());
            //Update the relevant fields'
            //user.setCategory(Category.valueOf(userBioDTO.getAuthority().name()));
            user.setName(userBioDTO.getName());
            user.setUsername(userBioDTO.getUsername());
            user.setInstitution(userBioDTO.getInstitution());
            user.setProgramme(userBioDTO.getProgramme());
            user.setCourse(userBioDTO.getCourse());
            user.setSkills(userBioDTO.getSkills());
            user.setCompanyName(userBioDTO.getCompanyName());
            user.setCompanyEmail(userBioDTO.getCompanyEmail());

            //Update the user info
            userRepository.save(user);

        } else {
            throw new UserNotFoundException("No user found with id " + userBioDTO.getEmail());
        }


    }


    public Optional<User> getUserById(Long id) {
        log.debug("Request to get user by id {}", id);

        return this.userRepository.findById(String.valueOf(id));

    }
}

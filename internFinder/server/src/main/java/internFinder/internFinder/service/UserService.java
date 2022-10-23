package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.PostAdvert;
import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.domain.enumarations.IdentityProvider;
import internFinder.internFinder.domain.enumarations.InternshipStatus;
import internFinder.internFinder.domain.enumarations.UserAuthority;
import internFinder.internFinder.domain.enumarations.UserStatus;
import internFinder.internFinder.dto.UserBioDTO;
import internFinder.internFinder.repository.PostInternshipRepository;
import internFinder.internFinder.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import static internFinder.internFinder.domain.enumarations.UserPermission.*;

@Slf4j
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PostInternshipRepository postInternshipRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PostInternshipRepository postInternshipRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postInternshipRepository = postInternshipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        log.info("Request to find user with email : {}", email);
        long startTime = System.nanoTime();
        Optional<User> user = userRepository.findByEmail(email);
        log.info("Found user : {}", user);
        long endTime = System.nanoTime();
        System.out.println("Find Email took " + (endTime - startTime)/1e6);
        return user;
    }

    public Optional<UserBioDTO> getUserBioByEmail(String email) {
        log.debug("Request to find user with email : {}", email);

        Optional<UserBioDTO> userBioDTOOptional = Optional.empty();
        //Get the user by email.
        return userRepository.findByEmail(email).map(
                user -> {
                    try {
                        return new UserBioDTO(user);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
        );

    }

    public Optional<UserBioDTO> getUserBioByUsername(String username) {
        log.debug("Request to find user with username : {}", username);

        //Get the user by email.
        return userRepository.findByUsername(username).map(
                user -> {
                    try {
                        return new UserBioDTO(user);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
        );

    }

    public List<User> getAllUsersBio() {
        log.debug("Request to get all Users Bio Info");

        //Get the user by email.
         return userRepository.findAll();
    }

    public List<User> searchEmployer(String text) {
        log.debug("Request to search user with text : {}", text);
        List<User> users = userRepository.findByUsernameContainingOrNameContainingOrCompanyIndustry(text, text, text);
        users.removeIf(user -> user.getAuthority() != UserAuthority.EMPLOYER);
        return users;
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
        saveUser.setUserStatus(UserStatus.ACTIVE);
        saveUser.setUsername(getUsernameFromEmail(email));
        saveUser.setIdentityProvider(IdentityProvider.LOCAL);
        saveUser.setCreatedOn(String.valueOf(LocalDate.now()));
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


    public User updateUser(UserBioDTO userBioDTO) throws UserNotFoundException {
        log.debug("Request to update user : {}", userBioDTO);

        //get the user
        Optional<User> userOptional = this.userRepository.findById(userBioDTO.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAuthority(userBioDTO.getAuthority());
            user.setUserStatus(userBioDTO.getUserStatus());
            user.setRoles(userBioDTO.getAuthority().name());
            //Update the relevant fields'
            //user.setCategory(Category.valueOf(userBioDTO.getAuthority().name()));
            user.setProfileImageUrl(userBioDTO.getProfileImageUrl());
            user.setProfileImageName(userBioDTO.getProfileImageName());
            user.setProfileImageData(userBioDTO.getProfileImageData());
            user.setName(userBioDTO.getName());
            user.setUsername(userBioDTO.getUsername());
            user.setInstitution(userBioDTO.getInstitution());
            user.setProgramme(userBioDTO.getProgramme());
            user.setCourse(userBioDTO.getCourse());
            user.setSkills(userBioDTO.getSkills());
            user.setCompanyName(userBioDTO.getCompanyName());
            user.setCompanyEmail(userBioDTO.getCompanyEmail());
            user.setCompanyLocation(userBioDTO.getCompanyLocation());
            user.setCompanyDescription(userBioDTO.getCompanyDescription());
            user.setCompanyWorkingHours(userBioDTO.getCompanyWorkingHours());
            user.setCompanyLogo(userBioDTO.getCompanyLogo());
            user.setCompanyIndustry(userBioDTO.getCompanyIndustry());
            user.setCompanyWebsite(userBioDTO.getCompanyWebsite());
            user.setCompanyNumberOfEmployees(userBioDTO.getCompanyNumberOfEmployees());
            user.setCompanyPostalAddress(userBioDTO.getCompanyPostalAddress());
            user.setCompanyPhoneNumber(userBioDTO.getCompanyPhoneNumber());
            user.setExperienceLevel(userBioDTO.getExperienceLevel());
            user.setExperience(userBioDTO.getExperience());
            user.setAbout(userBioDTO.getAbout());

            //Update the user info
            return userRepository.save(user);

        } else {
            throw new UserNotFoundException("No user found with id " + userBioDTO.getEmail());
        }


    }

    public User downloadProfilePicture(String email) {
        return userRepository.findByEmail(email).get();
    }

    public Optional<User> getUserById(Long id) {
        log.debug("Request to get user by id {}", id);

        return this.userRepository.findById(String.valueOf(id));

    }

    @Transactional
    public void deleteUserAndActions (String email){
        log.debug("Request to delete user and their actions of email {} ", email);
        this.userRepository.deleteById(email);
        this.deleteActions(email);

    }

    public void deleteActions(String email){
        if(this.postInternshipRepository.findByCompanyEmail(email) == null){
            log.debug("Request to delete user has not posted anything : email {} ", email);
        }
        else{
        this.postInternshipRepository.deleteById(this.postInternshipRepository.findByCompanyEmail(email).id);
        }
    }




}

package internFinder.internFinder.service;

import internFinder.internFinder.domain.AuthenticateUser;
import internFinder.internFinder.repository.AuthenticateUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.nullness.Opt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AuthenticateUserService{
    public final AuthenticateUserRepository authenticateUserRepository;

    public AuthenticateUserService(AuthenticateUserRepository authenticateUserRepository) {
        this.authenticateUserRepository = authenticateUserRepository;
    }

//  public Optional<AuthenticateUser> findByEmailAndPassword(String email, String userPassword) {
//    log.debug("Request to confirm username {} and password {}", email, userPassword);
//    return authenticateUserRepository.findByEmailAndPassword(email, userPassword);
//  }

    public AuthenticateUser registerUser(AuthenticateUser authenticateUser) {
        log.debug("Request to create user : {}", authenticateUser);
        return authenticateUserRepository.save(authenticateUser);
    }

    public AuthenticateUser loginUser(AuthenticateUser authenticateUser) {
        log.debug("Request to login user : {}", authenticateUser);
        return authenticateUser;
    }

    public void resetPassword(AuthenticateUser authenticateUser){
        log.debug("Request to reset password of user : {} ", authenticateUser);
        authenticateUserRepository.delete(authenticateUser);
    }

    public List<AuthenticateUser> findAll() {
        log.debug("Request to find All users");
        return authenticateUserRepository.findAll();
    }
    public AuthenticateUser findByEmail(String email) {
        log.debug("Request to find user of email {}", email);
        return authenticateUserRepository.findByEmail(email);
    }

}


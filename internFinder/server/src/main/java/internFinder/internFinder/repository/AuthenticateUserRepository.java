package internFinder.internFinder.repository;

import internFinder.internFinder.domain.AuthenticateUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthenticateUserRepository extends JpaRepository<AuthenticateUser, String> {
    Optional<AuthenticateUser> findByEmailAndPassword(String email, String password);

    AuthenticateUser findByEmail(String email);
}

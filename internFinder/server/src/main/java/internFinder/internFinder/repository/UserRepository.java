package internFinder.internFinder.repository;

import internFinder.internFinder.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailAndPassword(String email, String password);

    Optional <User> findByEmail(String email);

    Optional<User> findByUsername(String username);

}

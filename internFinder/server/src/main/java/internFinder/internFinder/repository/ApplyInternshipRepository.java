package internFinder.internFinder.repository;

import internFinder.internFinder.domain.ApplyInternship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplyInternshipRepository extends JpaRepository<ApplyInternship, Long> {
    List<ApplyInternship> findByAppliedBy(String appliedBy);
}

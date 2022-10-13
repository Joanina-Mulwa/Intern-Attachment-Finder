package internFinder.internFinder.repository;

import internFinder.internFinder.domain.ApplyAdvert;
import internFinder.internFinder.domain.ApplyInternship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.stream.Stream;

public interface ApplyAdvertRepository extends JpaRepository<ApplyAdvert, Long> {
    List<ApplyAdvert> findByAppliedBy(String appliedBy);

    List<ApplyAdvert> findByInternshipId(Long internshipId);
}

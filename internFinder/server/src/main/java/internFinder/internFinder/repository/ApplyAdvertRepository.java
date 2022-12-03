package internFinder.internFinder.repository;

import internFinder.internFinder.domain.ApplyAdvert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplyAdvertRepository extends JpaRepository<ApplyAdvert, Long> {
    List<ApplyAdvert> findByAppliedBy(String appliedBy);

    List<ApplyAdvert> findByInternshipId(Long internshipId);

    List<ApplyAdvert> findByAppliedByContaining(String text);

    List<ApplyAdvert> findByPostedByEmail(String postedByEmail);
}

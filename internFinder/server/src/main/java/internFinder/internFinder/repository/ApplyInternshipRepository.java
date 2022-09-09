package internFinder.internFinder.repository;

import internFinder.internFinder.domain.ApplyInternship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplyInternshipRepository extends JpaRepository<ApplyInternship, Long> {
    List<ApplyInternship> findByAppliedBy(String appliedBy);

    List<ApplyInternship> findByInternshipId(Long internshipId);

    //List<ApplyInternship> findByAppliedByContainingOrIntroductionContainingOrReasonContainingOrStrengthContainingOrWeaknessContaining(String text, String text1, String text2, String text3, String text4);
}

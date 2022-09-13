package internFinder.internFinder.repository;

import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.enumarations.InternshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostInternshipRepository extends JpaRepository<PostInternship, Long> {

    void deleteByCompanyEmail(String email);

    PostInternship findByCompanyEmail(String email);

    List<PostInternship> findByInternshipTitleContainingOrCompanyNameContainingOrCompanyEmailContainingOrLocationContainingOrDescriptionContainingOrSkillsContaining(String text, String text1, String text2, String text3, String text4, String text5);
}

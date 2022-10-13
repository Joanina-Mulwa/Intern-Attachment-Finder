package internFinder.internFinder.repository;

import internFinder.internFinder.domain.PostAdvert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Map;

public interface PostAdvertRepository extends JpaRepository<PostAdvert, Long> {
    byte findByData(byte[] data);

    List<PostAdvert> findByInternshipTitleContainingOrCompanyNameContainingOrCompanyEmailContainingOrDomainContainingOrPeriodContainingOrNameContaining(String text, String text1, String text2, String text3, String text4, String text5);
}

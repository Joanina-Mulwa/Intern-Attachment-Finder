package internFinder.internFinder.repository;

import internFinder.internFinder.domain.PostAdvert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Map;

public interface PostAdvertRepository extends JpaRepository<PostAdvert, Long> {
    byte findByData(byte[] data);
}

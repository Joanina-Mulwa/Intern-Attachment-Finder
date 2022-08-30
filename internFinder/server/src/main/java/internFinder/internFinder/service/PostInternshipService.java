package internFinder.internFinder.service;

import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.repository.PostInternshipRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class PostInternshipService {
    private final PostInternshipRepository postInternshipRepository;

    public PostInternshipService(PostInternshipRepository postInternshipRepository) {
        this.postInternshipRepository = postInternshipRepository;
    }


    public PostInternship createInternship(PostInternship postInternship){
        log.debug("Request to create Internship {}",postInternship );
        return postInternshipRepository.save(postInternship);
    }

    public List<PostInternship> findAllInternships(){
        log.debug("Request to find all internships");
        return  postInternshipRepository.findAll();
    }
}

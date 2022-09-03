package internFinder.internFinder.service;

import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.repository.PostInternshipRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PostInternshipService {
    private final PostInternshipRepository postInternshipRepository;

    public PostInternshipService(PostInternshipRepository postInternshipRepository) {
        this.postInternshipRepository = postInternshipRepository;
    }


    public PostInternship createInternship(PostInternship postInternship){
        log.debug("Request to create Internship {}",postInternship );
        PostInternship internship = new PostInternship();
        internship.setInternshipTitle(postInternship.getInternshipTitle());
        internship.setCompanyName(postInternship.getCompanyName());
        internship.setCompanyEmail(postInternship.getCompanyEmail());
        internship.setWorkPlaceType(postInternship.getWorkPlaceType());
        internship.setInternshipStatus(postInternship.getInternshipStatus());
        internship.setLocation(postInternship.getLocation());
        internship.setInternshipType(postInternship.getInternshipType());
        internship.setReportingDate(postInternship.getReportingDate());
        internship.setVacancy(postInternship.getVacancy());
        internship.setDescription(postInternship.getDescription());
        internship.setSkills(postInternship.getSkills());
        internship.setResponsibilities(postInternship.getResponsibilities());
        internship.setImportant(postInternship.getImportant());
        internship.setCreatedBy(postInternship.getCreatedBy());
        internship.setCreatedOn(LocalDateTime.now());
        return postInternshipRepository.save(internship);
    }

    public List<PostInternship> findAllInternships(){
        log.debug("Request to find all internships");
        return  postInternshipRepository.findAll();
    }

    public Optional<PostInternship> findInternshipById(Long id){
        log.debug("Request to find internship by id {}", id);
        return postInternshipRepository.findById(id);
    }
}

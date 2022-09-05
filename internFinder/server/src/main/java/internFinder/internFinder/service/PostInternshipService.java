package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.repository.PostInternshipRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        internship.setInternshipPeriod(postInternship.getInternshipPeriod());
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
        internship.setCreatedOn(LocalDate.now());
        return postInternshipRepository.save(internship);
    }

    public PostInternship updateInternship(PostInternship postInternship) throws UserNotFoundException{
        log.debug("Request to update internship : {}", postInternship);

        Optional<PostInternship> postInternshipOptional = this.postInternshipRepository.findById(postInternship.getId());

        if(postInternshipOptional.isPresent()){
            PostInternship postInternship1 = postInternshipOptional.get();
            postInternship1.setInternshipTitle(postInternship.getInternshipTitle());
            postInternship1.setCompanyName(postInternship.getCompanyName());
            postInternship1.setCompanyEmail(postInternship.getCompanyEmail());
            postInternship1.setWorkPlaceType(postInternship.getWorkPlaceType());
            postInternship1.setInternshipPeriod(postInternship.getInternshipPeriod());
            postInternship1.setInternshipStatus(postInternship.getInternshipStatus());
            postInternship1.setLocation(postInternship.getLocation());
            postInternship1.setInternshipType(postInternship.getInternshipType());
            postInternship1.setReportingDate(postInternship.getReportingDate());
            postInternship1.setVacancy(postInternship.getVacancy());
            postInternship1.setDescription(postInternship.getDescription());
            postInternship1.setSkills(postInternship.getSkills());
            postInternship1.setResponsibilities(postInternship.getResponsibilities());
            postInternship1.setImportant(postInternship.getImportant());
            postInternship1.setCreatedBy(postInternship.getCreatedBy());
            postInternship1.setCreatedOn(LocalDate.now());
            return postInternshipRepository.save(postInternship1);
        }else {
            throw new UserNotFoundException("No internship found with id " + postInternship.getId());
        }


    }

    public List<PostInternship> findAllInternships(){
        log.debug("Request to find all internships");
        return  postInternshipRepository.findAll();
    }

    public List<PostInternship> search(String text) {
        log.debug("Request to search internship with text : {}", text);

        return postInternshipRepository.findByInternshipTitleContainingOrCompanyNameContainingOrCompanyEmailContainingOrLocationContainingOrDescriptionContainingOrSkillsContaining(text, text, text, text, text, text);
    }

    public Optional<PostInternship> findInternshipById(Long id){
        log.debug("Request to find internship by id {}", id);
        return postInternshipRepository.findById(id);
    }
}

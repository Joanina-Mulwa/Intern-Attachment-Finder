package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.ApplyInternship;
import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.User;
import internFinder.internFinder.repository.ApplyInternshipRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ApplyInternshipService {
    private final ApplyInternshipRepository applyInternshipRepository;

    public ApplyInternshipService(ApplyInternshipRepository applyInternshipRepository) {
        this.applyInternshipRepository = applyInternshipRepository;
    }

    public ApplyInternship createApplication(ApplyInternship applyInternship){
        log.debug("Request to create application {} " , applyInternship);
        ApplyInternship application = new ApplyInternship();
        application.setInternshipId(applyInternship.getInternshipId());
        application.setAppliedOn(String.valueOf(LocalDate.now()));
        application.setAppliedBy(applyInternship.getAppliedBy());
        application.setIntroduction(applyInternship.getIntroduction());
        application.setReason(applyInternship.getReason());
        application.setStrength(applyInternship.getStrength());
        application.setWeakness(applyInternship.getWeakness());
        application.setResume(applyInternship.getResume());
        application.setStatus(applyInternship.getStatus());
        return applyInternshipRepository.save(application);
    }

    public ApplyInternship updateApplication(ApplyInternship applyInternship) throws UserNotFoundException{
        log.debug("Request to update application : {}", applyInternship);

        //get application
        Optional<ApplyInternship> applyInternshipOptional = this.applyInternshipRepository.findById(applyInternship.getId());
        if(applyInternshipOptional.isPresent()){
            ApplyInternship applyInternship1 = applyInternshipOptional.get();
            applyInternship1.setStatus(applyInternship.getStatus());
            return applyInternshipRepository.save(applyInternship1);
        }
        else {
            throw new UserNotFoundException("No user found with id " + applyInternship.getId());
        }
    }

    public List<ApplyInternship> findByAppliedBy(String appliedBy){
        log.debug("Request to get internship applied by {} ", appliedBy);
        List<ApplyInternship> internship = applyInternshipRepository.findByAppliedBy(appliedBy);
        log.info("Found internship : {} ", internship);
        return internship;

    }

    public List<ApplyInternship> findApplicationByInternshipId(Long internshipId){
        log.debug("Request to find applications of internship id {} ", internshipId);
        return applyInternshipRepository.findByInternshipId(internshipId);
    }

    public Optional<ApplyInternship> findApplicationById(Long id){
        log.debug("Request to find application of id {} ", id);
        return applyInternshipRepository.findById(id);
    }

//    public List<ApplyInternship> search(String text) {
//        log.debug("Request to applicant with text : {}", text);
//
//        return applyInternshipRepository.findByAppliedByContainingOrIntroductionContainingOrReasonContainingOrStrengthContainingOrWeaknessContaining(text, text, text, text, text);
//    }
}

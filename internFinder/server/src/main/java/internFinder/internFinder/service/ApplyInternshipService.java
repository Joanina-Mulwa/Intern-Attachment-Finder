package internFinder.internFinder.service;

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
        return applyInternshipRepository.save(application);
    }

    public List<ApplyInternship> findByAppliedBy(String appliedBy){
        log.debug("Request to get internship applied by {} ", appliedBy);
        List<ApplyInternship> internship = applyInternshipRepository.findByAppliedBy(appliedBy);
        log.info("Found internship : {} ", internship);
        return internship;

    }
}

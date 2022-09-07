package internFinder.internFinder.controller;

import internFinder.internFinder.domain.ApplyInternship;
import internFinder.internFinder.service.ApplyInternshipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class ApplyInternshipController {
    private final ApplyInternshipService applyInternshipService;

    public ApplyInternshipController(ApplyInternshipService applyInternshipService) {
        this.applyInternshipService = applyInternshipService;
    }

    @PostMapping("/applyInternship")
    public ApplyInternship createApplication(@RequestBody ApplyInternship applyInternship){
        log.debug("REST request to apply internship {}", applyInternship );
        return applyInternshipService.createApplication(applyInternship);
    }

    @GetMapping("/findByAppliedBy/{appliedBy}")
    public List<ApplyInternship> findByAppliedBy(@PathVariable String appliedBy){
        log.debug("REST request to find internships applied by : {}", appliedBy);
        return applyInternshipService.findByAppliedBy(appliedBy);
    }
}

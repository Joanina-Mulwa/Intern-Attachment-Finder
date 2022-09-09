package internFinder.internFinder.controller;

import internFinder.internFinder.domain.ApplyInternship;
import internFinder.internFinder.service.ApplyInternshipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/findApplicationsByInternshipId/{internshipId}")
    public List<ApplyInternship> findByInternshipId(@PathVariable Long internshipId){
        log.debug("REST request to find application of internship id {} ", internshipId);
        return applyInternshipService.findApplicationByInternshipId(internshipId);
    }

    @GetMapping("/findApplicationById")
    public Optional<ApplyInternship> findApplicationById(@PathVariable Long id){
        log.debug("REST request to find application by id {} ", id);
        return applyInternshipService.findApplicationById(id);
    }

//    @GetMapping("/applicant/search")
//    public List<ApplyInternship> findAll(@RequestParam(required = false) String text) {
//        log.debug("REST request to search all applicants with text : {}", text);
//
//        if (text == null) {
//            text = "";
//        }
//
//        return applyInternshipService.search(text);
//    }
}

package internFinder.internFinder.controller;

import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.service.PostInternshipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api")
public class PostInternshipResource {
    private final PostInternshipService postInternshipService;

    public PostInternshipResource(PostInternshipService postInternshipService) {
        this.postInternshipService = postInternshipService;
    }


    @PostMapping("/createInternship")
    public PostInternship createInternship(@RequestBody PostInternship postInternship) {
        log.debug("Rest request to create internship {} ", postInternship);
        return postInternshipService.createInternship(postInternship);
    }

    @PutMapping("/updateInternship")
    public PostInternship updateInternship(@RequestBody PostInternship postInternship){
        log.debug("Rest request to create internship {} ", postInternship);
        return postInternshipService.updateInternship(postInternship);
    }
    @GetMapping("/findAllInternships")
    public List<PostInternship> findAllInternships(){
        log.debug("REST request to find all internships");
        return postInternshipService.findAllInternships();
    }

    @GetMapping("/findInternshipById/{id}")
    public Optional<PostInternship> findInternshipById(@PathVariable Long id){
        log.debug("REST request to find internship of id {} ", id);
        return postInternshipService.findInternshipById(id);
    }
}


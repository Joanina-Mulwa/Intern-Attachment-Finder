package internFinder.internFinder.controller;

import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.User;
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

    @DeleteMapping("/deleteIntenship/{id}")
    public void deletePostedInternship(@PathVariable Long id){
        log.debug("Rest request to delete internship of id {} ",id);
        postInternshipService.deletePostedInternship(id);
    }


    @GetMapping("/findAllInternships")
    public List<PostInternship> findAllInternships(){
        log.debug("REST request to find all internships");
        return postInternshipService.findAllInternships();
    }

    @GetMapping("/internship/search")
    public List<PostInternship> findAll(@RequestParam(required = false) String text) {
        log.debug("REST request to search all internships with text : {}", text);

        if (text == null) {
            text = "";
        }

        return postInternshipService.search(text);
    }

    @GetMapping("/findInternshipById/{id}")
    public Optional<PostInternship> findInternshipById(@PathVariable Long id){
        log.debug("REST request to find internship of id {} ", id);
        return postInternshipService.findInternshipById(id);
    }
}


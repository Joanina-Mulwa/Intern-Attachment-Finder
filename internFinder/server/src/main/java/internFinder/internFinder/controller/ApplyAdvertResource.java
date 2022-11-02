package internFinder.internFinder.controller;

import internFinder.internFinder.domain.ApplyAdvert;
import internFinder.internFinder.message.ApplicationResponseFile;
import internFinder.internFinder.message.ResponseMessage;
import internFinder.internFinder.service.ApplyAdvertService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequestMapping("/api")
public class ApplyAdvertResource {

    private final ApplyAdvertService applyAdvertService;

    public ApplyAdvertResource(ApplyAdvertService applyAdvertService) {
        this.applyAdvertService = applyAdvertService;
    }

    @PostMapping("/createApplication")
    public ResponseEntity<ResponseMessage> createApplication(@RequestParam("file") MultipartFile file,
                                                             @RequestParam("internshipId") Long internshipId,
                                                             @RequestParam("appliedBy") String appliedBy,
                                                             @RequestParam("appliedOn") String appliedOn,
                                                             @RequestParam("postedBy") String postedBy){
        String message = "";
        System.out.println("**************************Testing************************");
        try {
            ApplyAdvert applyAdvert = new ApplyAdvert(internshipId, appliedBy, appliedOn, postedBy);
            applyAdvertService.createApplication(file, applyAdvert);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponseFile>> getAllApplications(){
        List<ApplicationResponseFile> files = applyAdvertService.getAllApplications().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/downloadApplicationById/")
                .path(String.valueOf(dbFile.getId()))
                .toUriString();
            return new ApplicationResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length,
                    dbFile.getInternshipId(),
                    dbFile.getAppliedBy(),
                    dbFile.getAppliedOn(),
                    dbFile.getPostedBy(),
                    dbFile.getStatus());
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }
    @GetMapping("getApplicationById/{id}")
    public ApplyAdvert getApplicationById(@PathVariable Long id) {
        ApplyAdvert file = applyAdvertService.getApplicationById(id);
        file.setUrl(ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/downloadApplicationById/")
                .path(String.valueOf(file.getId()))
                .toUriString());
        System.out.println("Got file"+ file);
        return file;

    }
    @GetMapping("getApplicationsByAppliedBy/{appliedBy}")
    public ResponseEntity<List<ApplyAdvert>> findApplicationsByAppliedBy(@PathVariable String appliedBy){
        List<ApplyAdvert> files = applyAdvertService.findApplicationsByAppliedBy(appliedBy);
        for (ApplyAdvert file : files){
            file.setUrl(ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadApplicationById/")
                    .path(String.valueOf(file.getId()))
                    .toUriString());
            System.out.println("Got file"+ file);
        }
        return ResponseEntity.status(HttpStatus.OK).body(files);

    }

    @GetMapping("getApplicationsByInternshipId/{internshipId}")
    public ResponseEntity<List<ApplyAdvert>> findApplicationsByInternshipId(@PathVariable Long internshipId){
        List<ApplyAdvert> files = applyAdvertService.findApplicationsByInternshipId(internshipId);
        for (ApplyAdvert file : files){
            file.setUrl(ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadApplicationById/")
                    .path(String.valueOf(file.getId()))
                    .toUriString());
            System.out.println("Got file"+ file);
        }
        return ResponseEntity.status(HttpStatus.OK).body(files);

    }

    @GetMapping("/downloadApplicationById/{id}")
    public ResponseEntity<byte[]> downloadApplicationById(@PathVariable Long id) {
        ApplyAdvert fileDB = applyAdvertService.downloadApplicationById((id));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData());
    }

    @PutMapping("/updateApplication")
    public ResponseEntity<ResponseMessage> updateApplication(@RequestParam("id") Long id,
                                                        @RequestParam("status") String status){
        log.debug("Rest request to update advert {}  ", id);
        String message = "";
        try {
            applyAdvertService.updateApplication(id, status);
            message = "updated the application successfully: ";
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));

        } catch (Exception e) {
            message = "Could not update the application status: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }


    @GetMapping("/application/search")
    public ResponseEntity<List<ApplicationResponseFile>> searchApplication(@RequestParam(required = false) String text) {
        log.debug("REST request to search all internships with text : {}", text);

        if (text == null) {
            text = "";
        }

        List<ApplicationResponseFile> files = applyAdvertService.searchApplication(text).map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadApplicationById/")
                    .path(String.valueOf(dbFile.getId()))
                    .toUriString();

            return new ApplicationResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length,
                    dbFile.getInternshipId(),
                    dbFile.getAppliedBy(),
                    dbFile.getAppliedOn(),
                    dbFile.getPostedBy(),
                    dbFile.getStatus());


        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }


}

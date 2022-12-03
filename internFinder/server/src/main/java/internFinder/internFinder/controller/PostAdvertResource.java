package internFinder.internFinder.controller;

import internFinder.internFinder.domain.PostAdvert;
import internFinder.internFinder.message.ResponseFile;
import internFinder.internFinder.message.ResponseMessage;
import internFinder.internFinder.service.PostAdvertService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api")
public class PostAdvertResource {
    private final PostAdvertService postAdvertService;

    public PostAdvertResource(PostAdvertService postAdvertService) {
        this.postAdvertService = postAdvertService;
    }


    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file,
                                                      @RequestParam("internshipTitle") String internshipTitle,
                                                      @RequestParam("companyName") String companyName,
                                                      @RequestParam("companyEmail") String companyEmail,
                                                      @RequestParam("companyLogo") String companyLogo,
                                                      @RequestParam("domain") String domain,
                                                      @RequestParam("period") String period,
                                                      @RequestParam("internshipStatus") String internshipStatus,
                                                      @RequestParam("createdOn") String createdOn,
                                                      @RequestParam("reportingDate") String reportingDate,
                                                      @RequestParam("parsedJobIdentifier") String parsedJobIdentifier){

        String message = "";
        System.out.println("**************************Testing************************");
        try {
            PostAdvert postAdvert = new PostAdvert(internshipTitle, companyName, companyEmail, companyLogo, domain, period, internshipStatus, createdOn, reportingDate, parsedJobIdentifier);
            postAdvertService.store(file, postAdvert);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));

//            Optional<Byte> data =postAdvertService.getFileData(file.getBytes());
//            System.out.println("Found advert data"+ data);
//            if(data.isEmpty()){
//                postAdvertService.store(file, postAdvert);
//                message = "Uploaded the file successfully: " + file.getOriginalFilename();
//                return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
//            }else{
//                message = "Failed! This vacancy has already been posted: " + file.getOriginalFilename() + "!";
//                return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
//            }

        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }

    }

    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = postAdvertService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadAdvertById/")
                    .path(String.valueOf(dbFile.getId()))
                    .toUriString();

            return new ResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length,
                    dbFile.getInternshipTitle(),
                    dbFile.getCompanyName(),
                    dbFile.getCompanyEmail(),
                    dbFile.getCompanyLogo(),
                    dbFile.getDomain(),
                    dbFile.getPeriod(),
                    dbFile.getInternshipStatus(),
                    dbFile.getCreatedOn(),
                    dbFile.getReportingDate(),
                    dbFile.getParsedJobIdentifier());

        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }


    @GetMapping("/get/file/{url}")
    public void getFileDetails(@PathVariable String url) throws IOException {


    }

    @GetMapping("/findAdvertById/{id}")
    public PostAdvert getAdvertById(@PathVariable Long id) {
        PostAdvert file = postAdvertService.getAdvertById(id);
        file.setUrl(ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/downloadAdvertById/")
                .path(String.valueOf(file.getId()))
                .toUriString());
        System.out.println("Got file"+ file);
        return file;

    }
    @GetMapping("/advert/search")
    public ResponseEntity<List<ResponseFile>> searchAdverts(@RequestParam(required = false) String text) {
        log.debug("REST request to search all internships with text : {}", text);

        if (text == null) {
            text = "";
        }

        List<ResponseFile> files = postAdvertService.searchAdvert(text).map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadAdvertById/")
                    .path(String.valueOf(dbFile.getId()))
                    .toUriString();

            return new ResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length,
                    dbFile.getInternshipTitle(),
                    dbFile.getCompanyName(),
                    dbFile.getCompanyEmail(),
                    dbFile.getCompanyLogo(),
                    dbFile.getDomain(),
                    dbFile.getPeriod(),
                    dbFile.getInternshipStatus(),
                    dbFile.getCreatedOn(),
                    dbFile.getReportingDate(),
                    dbFile.getParsedJobIdentifier());

        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/advert/filter")
    public ResponseEntity<List<ResponseFile>> filterAdverts(@RequestParam(required = false) String text) {
        log.debug("REST request to filter all internships with text : {}", text);

        if (text == null) {
            text = "";
        }

        List<ResponseFile> files = postAdvertService.filterAdvert(text).map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/downloadAdvertById/")
                    .path(String.valueOf(dbFile.getId()))
                    .toUriString();

            return new ResponseFile(
                    dbFile.getId(),
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length,
                    dbFile.getInternshipTitle(),
                    dbFile.getCompanyName(),
                    dbFile.getCompanyEmail(),
                    dbFile.getCompanyLogo(),
                    dbFile.getDomain(),
                    dbFile.getPeriod(),
                    dbFile.getInternshipStatus(),
                    dbFile.getCreatedOn(),
                    dbFile.getReportingDate(),
                    dbFile.getParsedJobIdentifier());

        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @PutMapping("/updateAdvert")
    public ResponseEntity<ResponseMessage> updateAdvert(@RequestParam("file") MultipartFile file,
                                                        @RequestParam("id") Long id,
                                                        @RequestParam("internshipTitle") String internshipTitle,
                                                        @RequestParam("companyName") String companyName,
                                                        @RequestParam("companyEmail") String companyEmail,
                                                        @RequestParam("companyLogo") String companyLogo,
                                                        @RequestParam("domain") String domain,
                                                        @RequestParam("period") String period,
                                                        @RequestParam("internshipStatus") String internshipStatus,
                                                        @RequestParam("createdOn") String createdOn,
                                                        @RequestParam("reportingDate") String reportingDate,
                                                        @RequestParam("parsedJobIdentifier") String parsedJobIdentifier){

        log.debug("Rest request to update advert {}  ", file);
        String message = "";
        try {
            String updatedOn = String.valueOf(LocalDate.now());
            PostAdvert postAdvert = new PostAdvert(id, internshipTitle, companyName, companyEmail, companyLogo, domain, period, internshipStatus, createdOn,updatedOn, reportingDate, parsedJobIdentifier);
            postAdvertService.updateAdvert(file, postAdvert);
            message = "updated the file successfully: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));

        } catch (Exception e) {
            message = "Could not update the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }
    @PutMapping("/updateAdvertDetails")
    public ResponseEntity<ResponseMessage> updateAdvertDetails(@RequestParam("id") Long id,
                                                               @RequestParam("internshipTitle") String internshipTitle,
                                                               @RequestParam("companyName") String companyName,
                                                               @RequestParam("companyEmail") String companyEmail,
                                                               @RequestParam("companyLogo") String companyLogo,
                                                               @RequestParam("domain") String domain,
                                                               @RequestParam("period") String period,
                                                               @RequestParam("internshipStatus") String internshipStatus,
                                                               @RequestParam("createdOn") String createdOn,
                                                               @RequestParam("reportingDate") String reportingDate,
                                                               @RequestParam("parsedJobIdentifier") String parsedJobIdentifier){


        log.debug("Rest request to update advert {}  ", id);
        String message = "";
        try {
            String updatedOn = String.valueOf(LocalDate.now());
            PostAdvert postAdvert = new PostAdvert(id, internshipTitle, companyName, companyEmail, companyLogo, domain, period, internshipStatus, createdOn, updatedOn, reportingDate, parsedJobIdentifier);

            postAdvertService.updateAdvertDetails(id, postAdvert);
            message = "updated the application successfully: ";
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));

        } catch (Exception e) {
            message = "Could not update the application status: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }



    @GetMapping("/downloadAdvertById/{id}")
    public ResponseEntity<byte[]> downloadAdvertById(@PathVariable Long id) {
        PostAdvert fileDB = postAdvertService.downloadAdvertById((id));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData());
    }

    @DeleteMapping("/deleteAdvert/{id}")
    public void deleteAdvert(@PathVariable Long id){
        log.debug("Rest request to delete internship of id {} ",id);
        postAdvertService.deleteAdvert(id);
    }


}

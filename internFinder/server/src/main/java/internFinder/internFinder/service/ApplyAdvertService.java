package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.ApplyAdvert;
import internFinder.internFinder.repository.ApplyAdvertRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Slf4j
public class ApplyAdvertService {
    private final ApplyAdvertRepository applyAdvertRepository;

    public ApplyAdvertService(ApplyAdvertRepository applyAdvertRepository) {
        this.applyAdvertRepository = applyAdvertRepository;
    }

    public ApplyAdvert createApplication(MultipartFile file, ApplyAdvert applyAdvert) throws IOException {
        System.out.println("*************************Testing Servive************************");
        System.out.println("Receiving this application " + file);
        System.out.println("Receiving this application details" + applyAdvert);
        applyAdvertRepository.save(applyAdvert);
        Optional<ApplyAdvert> applyAdvertOptional = applyAdvertRepository.findById(applyAdvert.getId());
        System.out.println("Search found" + applyAdvertOptional);
        if (applyAdvertOptional.isPresent()) {
            ApplyAdvert fileDetails = applyAdvertOptional.get();
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            fileDetails.setName(fileName);
            fileDetails.setType(file.getContentType());
            fileDetails.setData(file.getBytes());
            return applyAdvertRepository.save(fileDetails);
        } else {
            throw new UserNotFoundException("No application found with id " + applyAdvert.getId());
        }

    }

    public ApplyAdvert updateApplication(Long id, String status) throws IOException {
        Optional<ApplyAdvert> optionalApplyAdvert = applyAdvertRepository.findById(id);
        System.out.println("Search found" + optionalApplyAdvert);
        if (optionalApplyAdvert.isPresent()) {
            ApplyAdvert fileDetails = optionalApplyAdvert.get();
            fileDetails.setStatus(status);
            return applyAdvertRepository.save(fileDetails);
        } else {
            throw new UserNotFoundException("No application found with id " + id);
        }
    }

    public Stream<ApplyAdvert> getAllApplications() {
        return applyAdvertRepository.findAll().stream();
    }

    public ApplyAdvert getApplicationById(Long id) {
        log.debug("Request to find application of id {} ", id);

        return applyAdvertRepository.findById(id).get();
    }

    public ApplyAdvert downloadApplicationById(Long id) {

        return applyAdvertRepository.findById(id).get();
    }

    public List<ApplyAdvert> findApplicationsByAppliedBy(String appliedBy) {
        log.debug("Request to get internship applied by {} ", appliedBy);
        return applyAdvertRepository.findByAppliedBy(appliedBy);
    }

    public List<ApplyAdvert> findApplicationsByPostedBy(String postedByEmail) {
        log.debug("Request to get internship applied by {} ", postedByEmail);
        return applyAdvertRepository.findByPostedByEmail(postedByEmail);
    }

    public List<ApplyAdvert> findApplicationsByInternshipId(Long internshipId) {
        log.debug("Request to find applications of internship id {} ", internshipId);
        return applyAdvertRepository.findByInternshipId(internshipId);
    }

    public Stream<ApplyAdvert> searchApplication(String text) {
        log.debug("Request to search internship with text : {}", text);

        List<ApplyAdvert> applications = applyAdvertRepository.findByAppliedByContaining(text);
        return applications.stream();
    }


}

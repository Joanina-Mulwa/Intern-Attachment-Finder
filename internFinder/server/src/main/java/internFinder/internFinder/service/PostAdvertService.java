package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.ApplyAdvert;
import internFinder.internFinder.domain.PostAdvert;
import internFinder.internFinder.domain.PostInternship;
import internFinder.internFinder.domain.enumarations.InternshipStatus;
import internFinder.internFinder.message.ResponseFile;
import internFinder.internFinder.repository.PostAdvertRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@Slf4j
public class PostAdvertService {
    private final PostAdvertRepository postAdvertRepository;

    public PostAdvertService(PostAdvertRepository postAdvertRepository) {
        this.postAdvertRepository = postAdvertRepository;
    }

    public PostAdvert store(MultipartFile file, PostAdvert postAdvert) throws IOException {
        System.out.println("**************************Testing Servive************************");
        System.out.println("Receiving this advert " + file.getContentType());
        System.out.println("Receiving this advert details" + postAdvert);
        postAdvert.setCreatedOn(String.valueOf(LocalDate.now()));
        postAdvertRepository.save(postAdvert);
        Optional<PostAdvert> advert = postAdvertRepository.findById(postAdvert.getId());
        System.out.println("Search found" + advert);
        if(advert.isPresent()){
            PostAdvert fileDetails = advert.get();
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            fileDetails.setName(fileName);
            fileDetails.setType(file.getContentType());
            fileDetails.setData(file.getBytes());
            return postAdvertRepository.save(fileDetails);
        }
        else {
            throw new UserNotFoundException("No advert found with id " + postAdvert.getId());
        }
    }

    public PostAdvert getAdvertById(Long id) {

        return postAdvertRepository.findById(id).get();
    }
    public PostAdvert downloadAdvertById(Long id) {

        return postAdvertRepository.findById(id).get();
    }

    public PostAdvert updateAdvert(MultipartFile file, PostAdvert postAdvert) throws IOException{
        log.debug("Request to update internship : {} and {}", file, postAdvert);
        Optional<PostAdvert> postAdvertOptional = this.postAdvertRepository.findById(postAdvert.getId());
        if(postAdvertOptional.isPresent()){
            PostAdvert fileDetails = postAdvertOptional.get();
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            fileDetails.setName(fileName);
            fileDetails.setType(file.getContentType());
            fileDetails.setData(file.getBytes());
            fileDetails.setInternshipTitle(postAdvert.getInternshipTitle());
            fileDetails.setCompanyName(postAdvert.getCompanyName());
            fileDetails.setCompanyEmail(postAdvert.getCompanyEmail());
            fileDetails.setCompanyLogo(postAdvert.getCompanyLogo());
            fileDetails.setDomain(postAdvert.getDomain());
            fileDetails.setPeriod(postAdvert.getPeriod());
            fileDetails.setInternshipStatus(postAdvert.getInternshipStatus());
            fileDetails.setCreatedOn(String.valueOf(LocalDate.now()));
            fileDetails.setReportingDate(postAdvert.getReportingDate());
            log.debug("About to update internship to : {} ", fileDetails);
            return postAdvertRepository.save(fileDetails);
        }else {
            throw new UserNotFoundException("No internship found with id " + postAdvert.getId());
        }

    }
    public PostAdvert updateAdvertDetails(Long id, PostAdvert postAdvert) throws IOException {
        Optional<PostAdvert> optionalPostAdvert = postAdvertRepository.findById(id);
        System.out.println("Search found" + optionalPostAdvert);
        if (optionalPostAdvert.isPresent()){
            PostAdvert fileDetails = optionalPostAdvert.get();
            fileDetails.setInternshipTitle(postAdvert.getInternshipTitle());
            fileDetails.setCompanyName(postAdvert.getCompanyName());
            fileDetails.setCompanyEmail(postAdvert.getCompanyEmail());
            fileDetails.setCompanyLogo(postAdvert.getCompanyLogo());
            fileDetails.setDomain(postAdvert.getDomain());
            fileDetails.setPeriod(postAdvert.getPeriod());
            fileDetails.setInternshipStatus(postAdvert.getInternshipStatus());
            fileDetails.setCreatedOn(String.valueOf(LocalDate.now()));
            fileDetails.setReportingDate(postAdvert.getReportingDate());
            fileDetails.setInternshipStatus(postAdvert.getInternshipStatus());
            return postAdvertRepository.save(fileDetails);
        }
        else {
            throw  new UserNotFoundException("No advert found with id " + id);
        }
    }

    public Stream<PostAdvert> searchAdvert(String text) {
        log.debug("Request to search internship with text : {}", text);

        List<PostAdvert> adverts = postAdvertRepository.findByInternshipTitleContainingOrCompanyNameContainingOrCompanyEmailContainingOrDomainContainingOrPeriodContainingOrNameContaining(text, text, text, text, text, text);
        adverts.removeIf(advert -> Objects.equals(advert.getInternshipStatus(), "CLOSED"));
        return adverts.stream();
    }

    public void deleteAdvert(Long id){
        log.debug("Request to delete posted internship {}", id);
        postAdvertRepository.deleteById(id);
    }
    public Optional<Byte> getFileData(byte[] data) {
        return Optional.of(postAdvertRepository.findByData(data));
    }

    public Stream<PostAdvert> getAllFiles() {
        return postAdvertRepository.findAll().stream();
    }
}

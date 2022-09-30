package internFinder.internFinder.service;

import internFinder.internFinder.Security.UserNotFoundException;
import internFinder.internFinder.domain.PostAdvert;
import internFinder.internFinder.message.ResponseFile;
import internFinder.internFinder.repository.PostAdvertRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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
    public Optional<Byte> getFileData(byte[] data) {
        return Optional.of(postAdvertRepository.findByData(data));
    }

    public Stream<PostAdvert> getAllFiles() {
        return postAdvertRepository.findAll().stream();
    }
}

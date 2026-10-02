package com.rishubarman.portfoliocms.about;

import org.springframework.stereotype.Service;

@Service
public class AboutService {

    private final AboutRepository aboutRepository;

    public AboutService(AboutRepository aboutRepository) {
        this.aboutRepository = aboutRepository;
    }

    public About getAbout() {
        return aboutRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public About createAbout(About about) {

        if (aboutRepository.count() > 0) {
            throw new RuntimeException(
                    "About information already exists"
            );
        }

        return aboutRepository.save(about);
    }

    public About updateAbout(Long id, About updatedAbout) {

        About existingAbout = aboutRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "About information not found with id: " + id
                        )
                );

        existingAbout.setName(updatedAbout.getName());
        existingAbout.setHeadline(updatedAbout.getHeadline());
        existingAbout.setBio(updatedAbout.getBio());
        existingAbout.setLocation(updatedAbout.getLocation());
        existingAbout.setProfileImageUrl(
                updatedAbout.getProfileImageUrl()
        );

        return aboutRepository.save(existingAbout);
    }

    public void deleteAbout(Long id) {

        About about = aboutRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "About information not found with id: " + id
                        )
                );

        aboutRepository.delete(about);
    }
}
package com.rishubarman.portfoliocms.experience;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll();
    }

    public List<Experience> getPublishedExperiences() {
        return experienceRepository.findAll()
                .stream()
                .filter(experience ->
                        Boolean.TRUE.equals(experience.getPublished())
                )
                .toList();
    }

    public Experience getExperienceById(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Experience not found with id: " + id
                        )
                );
    }

    public Experience createExperience(Experience experience) {
        return experienceRepository.save(experience);
    }

    public Experience updateExperience(
            Long id,
            Experience updatedExperience
    ) {
        Experience existingExperience =
                getExperienceById(id);

        existingExperience.setCompany(
                updatedExperience.getCompany()
        );
        existingExperience.setRole(
                updatedExperience.getRole()
        );
        existingExperience.setLocation(
                updatedExperience.getLocation()
        );
        existingExperience.setStartDate(
                updatedExperience.getStartDate()
        );
        existingExperience.setEndDate(
                updatedExperience.getEndDate()
        );
        existingExperience.setCurrent(
                updatedExperience.getCurrent()
        );
        existingExperience.setDescription(
                updatedExperience.getDescription()
        );
        existingExperience.setDisplayOrder(
                updatedExperience.getDisplayOrder()
        );
        existingExperience.setPublished(
                updatedExperience.getPublished()
        );

        return experienceRepository.save(existingExperience);
    }

    public void deleteExperience(Long id) {
        Experience experience = getExperienceById(id);
        experienceRepository.delete(experience);
    }
}
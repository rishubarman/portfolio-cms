package com.rishubarman.portfoliocms.experience;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experience")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(
            ExperienceService experienceService
    ) {
        this.experienceService = experienceService;
    }

    @GetMapping
    public List<Experience> getPublishedExperiences() {
        return experienceService.getPublishedExperiences();
    }

    @GetMapping("/admin")
    public List<Experience> getAllExperiences() {
        return experienceService.getAllExperiences();
    }

    @GetMapping("/{id}")
    public Experience getExperienceById(
            @PathVariable Long id
    ) {
        return experienceService.getExperienceById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Experience createExperience(
            @Valid @RequestBody Experience experience
    ) {
        return experienceService.createExperience(experience);
    }

    @PutMapping("/{id}")
    public Experience updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody Experience experience
    ) {
        return experienceService.updateExperience(
                id,
                experience
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(
            @PathVariable Long id
    ) {
        experienceService.deleteExperience(id);
    }
}
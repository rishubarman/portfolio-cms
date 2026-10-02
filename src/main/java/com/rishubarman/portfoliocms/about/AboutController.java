package com.rishubarman.portfoliocms.about;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/about")
public class AboutController {

    private final AboutService aboutService;

    public AboutController(AboutService aboutService) {
        this.aboutService = aboutService;
    }

    @GetMapping
    public About getAbout() {
        return aboutService.getAbout();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public About createAbout(@Valid @RequestBody About about) {
        return aboutService.createAbout(about);
    }

    @PutMapping("/{id}")
    public About updateAbout(
            @PathVariable Long id,
            @Valid @RequestBody About about
    ) {
        return aboutService.updateAbout(id, about);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAbout(@PathVariable Long id) {
        aboutService.deleteAbout(id);
    }
}
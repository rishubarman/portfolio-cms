package com.rishubarman.portfoliocms.testimonial;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @GetMapping
    public List<Testimonial> getPublishedTestimonials() {
        return testimonialService.getPublishedTestimonials();
    }

    @GetMapping("/admin")
    public List<Testimonial> getAllTestimonials() {
        return testimonialService.getAllTestimonials();
    }

    @GetMapping("/{id}")
    public Testimonial getTestimonialById(@PathVariable Long id) {
        return testimonialService.getTestimonialById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Testimonial createTestimonial(
            @RequestBody Testimonial testimonial
    ) {
        return testimonialService.createTestimonial(testimonial);
    }

    @PutMapping("/{id}")
    public Testimonial updateTestimonial(
            @PathVariable Long id,
            @RequestBody Testimonial testimonial
    ) {
        return testimonialService.updateTestimonial(id, testimonial);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTestimonial(@PathVariable Long id) {
        testimonialService.deleteTestimonial(id);
    }
}
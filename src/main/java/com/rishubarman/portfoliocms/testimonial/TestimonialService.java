package com.rishubarman.portfoliocms.testimonial;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;

    public TestimonialService(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    public List<Testimonial> getPublishedTestimonials() {
        return testimonialRepository.findByPublishedTrueOrderByDisplayOrderAsc();
    }

    public Testimonial getTestimonialById(Long id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonial not found"));
    }

    public Testimonial createTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    public Testimonial updateTestimonial(Long id, Testimonial updatedTestimonial) {

        Testimonial existing = getTestimonialById(id);

        existing.setName(updatedTestimonial.getName());
        existing.setRole(updatedTestimonial.getRole());
        existing.setCompany(updatedTestimonial.getCompany());
        existing.setContent(updatedTestimonial.getContent());
        existing.setImageUrl(updatedTestimonial.getImageUrl());
        existing.setDisplayOrder(updatedTestimonial.getDisplayOrder());
        existing.setPublished(updatedTestimonial.isPublished());

        return testimonialRepository.save(existing);
    }

    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }
}
package com.rishubarman.portfoliocms.testimonial;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    List<Testimonial> findByPublishedTrueOrderByDisplayOrderAsc();
}
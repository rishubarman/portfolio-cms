package com.rishubarman.portfoliocms.project;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(nullable = false, length = 1000)
    private String description;

    @Size(max = 500, message = "Short description must not exceed 500 characters")
    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "image_url")
    @org.hibernate.validator.constraints.URL(
            message = "Image URL must be a valid URL"
    )
    private String imageUrl;

    @Column(name = "github_url")
    @org.hibernate.validator.constraints.URL(
            message = "GitHub URL must be a valid URL"
    )
    private String githubUrl;

    @Column(name = "live_url")
    @org.hibernate.validator.constraints.URL(
            message = "Live URL must be a valid URL"
    )
    private String liveUrl;

    @Size(max = 1000, message = "Tech stack must not exceed 1000 characters")
    @Column(name = "tech_stack", length = 1000)
    private String techStack;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(nullable = false)
    private Boolean published = true;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
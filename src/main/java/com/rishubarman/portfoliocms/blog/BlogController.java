package com.rishubarman.portfoliocms.blog;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public List<Blog> getBlogs() {
        return blogService.getPublishedBlogs();
    }

    @GetMapping("/admin")
    public List<Blog> getAllBlogsForAdmin() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/{id}")
    public Blog getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id);
    }

    @GetMapping("/slug/{slug}")
    public Blog getBlogBySlug(@PathVariable String slug) {
        return blogService.getBlogBySlug(slug);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Blog createBlog(@Valid @RequestBody Blog blog) {
        return blogService.createBlog(blog);
    }

    @PutMapping("/{id}")
    public Blog updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody Blog blog
    ) {
        return blogService.updateBlog(id, blog);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
    }
}
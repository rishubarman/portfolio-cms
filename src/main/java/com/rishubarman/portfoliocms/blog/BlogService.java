package com.rishubarman.portfoliocms.blog;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public List<Blog> getPublishedBlogs() {
        return blogRepository.findAll()
                .stream()
                .filter(blog -> Boolean.TRUE.equals(blog.getPublished()))
                .toList();
    }

    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Blog not found with id: " + id
                        )
                );
    }

    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Blog not found with slug: " + slug
                        )
                );
    }

    public Blog createBlog(Blog blog) {
        if (blogRepository.existsBySlug(blog.getSlug())) {
            throw new RuntimeException(
                    "A blog with this slug already exists."
            );
        }

        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, Blog updatedBlog) {
        Blog existingBlog = getBlogById(id);

        if (!existingBlog.getSlug().equals(updatedBlog.getSlug())
                && blogRepository.existsBySlug(updatedBlog.getSlug())) {
            throw new RuntimeException(
                    "A blog with this slug already exists."
            );
        }

        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setSlug(updatedBlog.getSlug());
        existingBlog.setExcerpt(updatedBlog.getExcerpt());
        existingBlog.setContent(updatedBlog.getContent());
        existingBlog.setCoverImageUrl(updatedBlog.getCoverImageUrl());
        existingBlog.setPublished(updatedBlog.getPublished());
        existingBlog.setFeatured(updatedBlog.getFeatured());

        return blogRepository.save(existingBlog);
    }

    public void deleteBlog(Long id) {
        Blog blog = getBlogById(id);
        blogRepository.delete(blog);
    }
}
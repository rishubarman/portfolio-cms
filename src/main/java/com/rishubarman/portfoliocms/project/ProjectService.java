package com.rishubarman.portfoliocms.project;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found with id: " + id)
                );
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {

        Project existingProject = getProjectById(id);

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setShortDescription(
                updatedProject.getShortDescription()
        );
        existingProject.setImageUrl(updatedProject.getImageUrl());
        existingProject.setGithubUrl(updatedProject.getGithubUrl());
        existingProject.setLiveUrl(updatedProject.getLiveUrl());
        existingProject.setTechStack(updatedProject.getTechStack());
        existingProject.setFeatured(updatedProject.getFeatured());
        existingProject.setPublished(updatedProject.getPublished());
        existingProject.setDisplayOrder(
                updatedProject.getDisplayOrder()
        );

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
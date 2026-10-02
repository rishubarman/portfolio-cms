package com.rishubarman.portfoliocms.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<com.rishubarman.portfoliocms.service.Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<com.rishubarman.portfoliocms.service.Service> getPublishedServices() {
        return serviceRepository.findAll()
                .stream()
                .filter(com.rishubarman.portfoliocms.service.Service::isPublished)
                .toList();
    }

    public com.rishubarman.portfoliocms.service.Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public com.rishubarman.portfoliocms.service.Service createService(
            com.rishubarman.portfoliocms.service.Service service
    ) {
        return serviceRepository.save(service);
    }

    public com.rishubarman.portfoliocms.service.Service updateService(
            Long id,
            com.rishubarman.portfoliocms.service.Service updatedService
    ) {
        com.rishubarman.portfoliocms.service.Service existingService =
                getServiceById(id);

        existingService.setTitle(updatedService.getTitle());
        existingService.setDescription(updatedService.getDescription());
        existingService.setIconUrl(updatedService.getIconUrl());
        existingService.setDisplayOrder(updatedService.getDisplayOrder());
        existingService.setPublished(updatedService.isPublished());

        return serviceRepository.save(existingService);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
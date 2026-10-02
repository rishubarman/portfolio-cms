package com.rishubarman.portfoliocms.media;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;

    private final Path uploadDirectory =
            Paths.get("uploads");

    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public Media uploadFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        Files.createDirectories(uploadDirectory);

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = "";

        int lastDot =
                originalFileName.lastIndexOf(".");

        if (lastDot >= 0) {
            extension =
                    originalFileName.substring(lastDot);
        }

        String storedFileName =
                UUID.randomUUID() + extension;

        Path targetPath =
                uploadDirectory.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Media media = new Media();

        media.setFileName(originalFileName);

        media.setFileUrl(
                "/uploads/" + storedFileName
        );

        media.setFileType(
                file.getContentType() != null
                        ? file.getContentType()
                        : "application/octet-stream"
        );

        media.setFileSize(file.getSize());

        return mediaRepository.save(media);
    }

    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    public void deleteMedia(Long id) throws IOException {

        Media media = mediaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Media not found")
                );

        String fileUrl = media.getFileUrl();

        if (fileUrl != null && fileUrl.startsWith("/uploads/")) {

            String fileName =
                    fileUrl.substring("/uploads/".length());

            Path filePath =
                    uploadDirectory.resolve(fileName);

            Files.deleteIfExists(filePath);
        }

        mediaRepository.delete(media);
    }
}
package com.rishubarman.portfoliocms.media;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/upload")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping("/image")
    @ResponseStatus(HttpStatus.CREATED)
    public Media uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return mediaService.uploadFile(file);
    }

    @GetMapping("/media")
    public List<Media> getAllMedia() {

        return mediaService.getAllMedia();
    }

    @DeleteMapping("/media/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedia(
            @PathVariable Long id
    ) throws IOException {

        mediaService.deleteMedia(id);
    }
}
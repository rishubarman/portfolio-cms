package com.rishubarman.portfoliocms.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact createContact(
            @Valid @RequestBody Contact contact
    ) {
        return contactService.createContact(contact);
    }

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    @GetMapping("/{id}")
    public Contact getContactById(
            @PathVariable Long id
    ) {
        return contactService.getContactById(id);
    }

    @PutMapping("/{id}/read")
    public Contact markAsRead(
            @PathVariable Long id
    ) {
        return contactService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContact(
            @PathVariable Long id
    ) {
        contactService.deleteContact(id);
    }
}
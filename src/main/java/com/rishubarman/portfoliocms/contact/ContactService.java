package com.rishubarman.portfoliocms.contact;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    public ContactService(
            ContactRepository contactRepository,
            EmailService emailService
    ) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }

    public Contact createContact(Contact contact) {

        Contact savedContact =
                contactRepository.save(contact);

        emailService.sendContactNotification(savedContact);

        return savedContact;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contact message not found with id: " + id
                        )
                );
    }

    public Contact markAsRead(Long id) {
        Contact contact = getContactById(id);

        contact.setRead(true);

        return contactRepository.save(contact);
    }

    public void deleteContact(Long id) {
        Contact contact = getContactById(id);

        contactRepository.delete(contact);
    }
}
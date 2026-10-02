package com.rishubarman.portfoliocms.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactNotification(Contact contact) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(mailUsername);
        message.setTo(mailUsername);
        message.setReplyTo(contact.getEmail());

        message.setSubject(
                "New Portfolio Contact: " + contact.getSubject()
        );

        message.setText(
                "You received a new message from your portfolio website.\n\n" +
                        "Name: " + contact.getName() + "\n" +
                        "Email: " + contact.getEmail() + "\n" +
                        "Subject: " + contact.getSubject() + "\n\n" +
                        "Message:\n" +
                        contact.getMessage() + "\n\n" +
                        "Received at: " + contact.getCreatedAt()
        );

        mailSender.send(message);
    }
}
package com.rishubarman.portfoliocms.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${spring.mail.username}")
    private String mailUsername;

    public void sendContactNotification(Contact contact) {

        try {
            String text =
                    "You received a new message from your portfolio website.\n\n" +
                            "Name: " + contact.getName() + "\n" +
                            "Email: " + contact.getEmail() + "\n" +
                            "Subject: " + contact.getSubject() + "\n\n" +
                            "Message:\n" +
                            contact.getMessage() + "\n\n" +
                            "Received at: " + contact.getCreatedAt();

            String json = "{"
                    + "\"from\":\"onboarding@resend.dev\","
                    + "\"to\":[\"" + escapeJson(mailUsername) + "\"],"
                    + "\"reply_to\":\"" + escapeJson(contact.getEmail()) + "\","
                    + "\"subject\":\"" + escapeJson("New Portfolio Contact: " + contact.getSubject()) + "\","
                    + "\"text\":\"" + escapeJson(text) + "\""
                    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException(
                        "Resend email failed: "
                                + response.statusCode()
                                + " - "
                                + response.body()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send contact notification email",
                    e
            );
        }
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
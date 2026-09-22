package in.gov.abdm.medikiosk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> generateIntakeQuestion(String complaint, int turnCount, String language, String pastAnswers) {
        // If API key is not configured, fallback gracefully to adaptive clinical rules
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return getFallbackTurn(turnCount, language, pastAnswers);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            String prompt = String.format(
                "You are an empathetic OPD triage assistant in an Indian government hospital. Language: %s. " +
                "Patient Chief Complaint: '%s'. Turn count: %d. Previous context: '%s'. " +
                "Formulate ONE precise clinical clarifying question in %s with English medical terms in brackets if helpful. " +
                "Also provide 3 short clickable options.",
                language, complaint, turnCount, pastAnswers, language
            );

            Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return Map.of("status", "success", "geminiResponse", response.getBody());
        } catch (Exception e) {
            return getFallbackTurn(turnCount, language, pastAnswers);
        }
    }

    private Map<String, Object> getFallbackTurn(int turnCount, String language, String pastAnswers) {
        String question = "How many days have you been experiencing this discomfort, and is the severity getting worse?";
        if (turnCount == 2) {
            question = "Are you currently taking any regular medications for diabetes, high BP, thyroid, or asthma?";
        } else if (turnCount >= 3) {
            question = "Do you have any known allergies to medicines like Penicillin, Sulfa drugs, or Paracetamol?";
        }

        return Map.of(
            "question", question,
            "turnCount", turnCount,
            "options", List.of("Since 2-3 days", "More than 1-2 weeks", "Started today acutely"),
            "isEmergency", false
        );
    }
}

package com.doubt.platform.controller;

import com.doubt.platform.model.Answer;
import com.doubt.platform.model.Question;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.AnswerRepository;
import com.doubt.platform.repository.QuestionRepository;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "latest") String sort,
                                     @RequestParam(defaultValue = "") String tag) {
        List<Question> list;
        if (!tag.isEmpty()) {
            list = questionRepository.findByTag(tag);
        } else {
            list = switch (sort) {
                case "unanswered" -> questionRepository.findUnanswered();
                case "popular" -> questionRepository.findPopular();
                default -> questionRepository.findAllByOrderByCreatedAtDesc();
            };
        }
        return ResponseEntity.ok(list.stream().map(this::toMap).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(q -> ResponseEntity.ok(toMap(q)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Map<String, Object> req, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        Question q = new Question();
        q.setTitle((String) req.get("title"));
        q.setBody((String) req.get("body"));
        q.setAuthorId(userId);
        q.setAuthorName(user.getName());
        q.setAuthorRole(user.getRole());
        q.setAnonymous(Boolean.TRUE.equals(req.get("anonymous")));

        @SuppressWarnings("unchecked")
        List<String> tags = (List<String>) req.getOrDefault("tags", List.of());
        q.setTags(String.join(",", tags));

        return ResponseEntity.status(201).body(toMap(questionRepository.save(q)));
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<?> answer(@PathVariable Long id, @RequestBody Map<String, Object> req, Authentication auth) {
        Question q = questionRepository.findById(id).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();

        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        Answer a = new Answer();
        a.setQuestion(q);
        a.setBody((String) req.get("body"));
        a.setAuthorId(userId);
        a.setAuthorName(user.getName());
        a.setAuthorRole(user.getRole());
        a.setAnonymous(Boolean.TRUE.equals(req.get("anonymous")));
        answerRepository.save(a);

        return ResponseEntity.status(201).body(toMap(questionRepository.findById(id).orElseThrow()));
    }

    @PatchMapping("/{qId}/answers/{aId}/upvote")
    public ResponseEntity<?> upvote(@PathVariable Long qId, @PathVariable Long aId) {
        Answer a = answerRepository.findById(aId).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setUpvotes((a.getUpvotes() == null ? 0 : a.getUpvotes()) + 1);
        answerRepository.save(a);
        return ResponseEntity.ok(toMap(questionRepository.findById(qId).orElseThrow()));
    }

    @PatchMapping("/{qId}/answers/{aId}/accept")
    public ResponseEntity<?> accept(@PathVariable Long qId, @PathVariable Long aId, Authentication auth) {
        Question q = questionRepository.findById(qId).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();

        Long userId = (Long) auth.getPrincipal();
        if (!q.getAuthorId().equals(userId))
            return ResponseEntity.status(403).body(Map.of("message", "Only question author can accept"));

        // unaccept all, then accept selected
        q.getAnswers().forEach(a -> a.setAccepted(false));
        answerRepository.saveAll(q.getAnswers());

        Answer a = answerRepository.findById(aId).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setAccepted(true);
        answerRepository.save(a);

        return ResponseEntity.ok(toMap(questionRepository.findById(qId).orElseThrow()));
    }

    private Map<String, Object> toMap(Question q) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", q.getId());
        m.put("title", q.getTitle());
        m.put("body", q.getBody());
        m.put("authorId", q.getAuthorId());
        m.put("authorName", q.getAnonymous() ? "Anonymous" : q.getAuthorName());
        m.put("authorRole", q.getAuthorRole());
        m.put("anonymous", q.getAnonymous());
        m.put("tags", q.getTags() != null && !q.getTags().isEmpty() ? Arrays.asList(q.getTags().split(",")) : List.of());
        m.put("createdAt", q.getCreatedAt());
        m.put("answers", q.getAnswers().stream().map(this::answerToMap).toList());
        return m;
    }

    private Map<String, Object> answerToMap(Answer a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", a.getId());
        m.put("body", a.getBody());
        m.put("authorId", a.getAuthorId());
        m.put("authorName", a.getAnonymous() ? "Anonymous" : a.getAuthorName());
        m.put("authorRole", a.getAuthorRole());
        m.put("anonymous", a.getAnonymous());
        m.put("upvotes", a.getUpvotes());
        m.put("accepted", a.getAccepted());
        m.put("createdAt", a.getCreatedAt());
        return m;
    }
}

package com.doubt.platform.controller;

import com.doubt.platform.model.Message;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.MessageRepository;
import com.doubt.platform.repository.UserRepository;
import com.doubt.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /* ── Send a message ── */
    @PostMapping("/{receiverId}")
    public ResponseEntity<?> send(@PathVariable Long receiverId,
                                   @RequestBody Map<String, String> body,
                                   Authentication auth) {
        Long senderId = (Long) auth.getPrincipal();
        String content = body.get("content");
        if (content == null || content.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Content required"));

        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElse(null);
        if (receiver == null)
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));

        Message msg = new Message();
        msg.setSenderId(senderId);
        msg.setReceiverId(receiverId);
        msg.setSenderName(sender.getName());
        msg.setReceiverName(receiver.getName());
        msg.setContent(content.trim());

        Message saved = messageRepository.save(msg);

        // Notify receiver
        notificationService.send(receiverId, "NEW_MESSAGE",
            sender.getName() + ": " + (content.length() > 50 ? content.substring(0, 50) + "..." : content),
            null);

        return ResponseEntity.status(201).body(toMap(saved, senderId));
    }

    /* ── Get conversation with a specific user ── */
    @GetMapping("/{otherUserId}")
    @Transactional
    public ResponseEntity<?> getConversation(@PathVariable Long otherUserId, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        // Mark messages from other user as read
        messageRepository.markAsRead(otherUserId, userId);
        List<Map<String, Object>> messages = messageRepository.findConversation(userId, otherUserId)
            .stream().map(m -> toMap(m, userId)).toList();
        return ResponseEntity.ok(messages);
    }

    /* ── Get all conversations (sidebar) ── */
    @GetMapping
    public ResponseEntity<?> getConversations(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        // Get all users this person has chatted with
        List<Message> latest = messageRepository.findLatestPerConversation(userId);

        // Build conversation list
        List<Map<String, Object>> conversations = new ArrayList<>();
        Set<Long> seen = new HashSet<>();

        for (Message m : latest) {
            Long otherId = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();
            if (seen.contains(otherId)) continue;
            seen.add(otherId);

            long unread = messageRepository.countBySenderIdAndReceiverIdAndIsRead(otherId, userId, false);
            userRepository.findById(otherId).ifPresent(other -> {
                Map<String, Object> conv = new HashMap<>();
                conv.put("userId", other.getId());
                conv.put("name", other.getName());
                conv.put("role", other.getRole());
                conv.put("department", other.getDepartment() != null ? other.getDepartment() : "");
                conv.put("lastMessage", m.getContent());
                conv.put("lastMessageTime", m.getCreatedAt().toString());
                conv.put("unreadCount", unread);
                conv.put("isMine", m.getSenderId().equals(userId));
                conversations.add(conv);
            });
        }

        // Sort by latest message
        conversations.sort((a, b) -> ((String) b.get("lastMessageTime")).compareTo((String) a.get("lastMessageTime")));
        return ResponseEntity.ok(conversations);
    }

    /* ── Get all users to start new chat ── */
    @GetMapping("/users/available")
    public ResponseEntity<?> getAvailableUsers(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String role = (String) auth.getCredentials();

        List<Map<String, Object>> users = userRepository.findAll().stream()
            .filter(u -> !u.getId().equals(userId))
            .filter(u -> {
                // Students see faculty + admin, Faculty see students + admin, Admin sees all
                if ("student".equals(role)) return "faculty".equals(u.getRole()) || "admin".equals(u.getRole());
                if ("faculty".equals(role)) return "student".equals(u.getRole()) || "admin".equals(u.getRole());
                return true;
            })
            .map(u -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("name", u.getName());
                m.put("role", u.getRole());
                m.put("department", u.getDepartment() != null ? u.getDepartment() : "");
                return m;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    /* ── Total unread message count ── */
    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        long count = messageRepository.countByReceiverIdAndIsRead(userId, false);
        return ResponseEntity.ok(Map.of("count", count));
    }

    private Map<String, Object> toMap(Message m, Long currentUserId) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", m.getId());
        map.put("senderId", m.getSenderId());
        map.put("receiverId", m.getReceiverId());
        map.put("senderName", m.getSenderName());
        map.put("receiverName", m.getReceiverName());
        map.put("content", m.getContent());
        map.put("isRead", m.getIsRead());
        map.put("createdAt", m.getCreatedAt().toString());
        map.put("isMine", m.getSenderId().equals(currentUserId));
        return map;
    }
}

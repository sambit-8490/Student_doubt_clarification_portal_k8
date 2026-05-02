package com.doubt.platform.repository;

import com.doubt.platform.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Get all messages between two users
    @Query("SELECT m FROM Message m WHERE (m.senderId = :a AND m.receiverId = :b) OR (m.senderId = :b AND m.receiverId = :a) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("a") Long a, @Param("b") Long b);

    // Get latest message per conversation for sidebar
    @Query(value = """
        SELECT DISTINCT ON (other_id) * FROM (
            SELECT m.*, 
                CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END as other_id
            FROM messages m
            WHERE m.sender_id = :userId OR m.receiver_id = :userId
            ORDER BY m.created_at DESC
        ) sub ORDER BY other_id, created_at DESC
        """, nativeQuery = true)
    List<Message> findLatestPerConversation(@Param("userId") Long userId);

    // Unread count from a specific sender
    long countBySenderIdAndReceiverIdAndIsRead(Long senderId, Long receiverId, Boolean isRead);

    // Total unread for a user
    long countByReceiverIdAndIsRead(Long receiverId, Boolean isRead);

    // Mark all messages from sender to receiver as read
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.senderId = :senderId AND m.receiverId = :receiverId AND m.isRead = false")
    void markAsRead(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}

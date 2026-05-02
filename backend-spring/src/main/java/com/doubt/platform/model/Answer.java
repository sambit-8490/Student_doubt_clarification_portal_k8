package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "answers")
public class Answer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "author_role", length = 20)
    private String authorRole;

    private Boolean anonymous = false;

    private Integer upvotes = 0;

    private Boolean accepted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

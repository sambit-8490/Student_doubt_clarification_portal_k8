package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "questions")
public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "author_id")
    private Long authorId;

    @Column(name = "author_name", length = 100)
    private String authorName;

    @Column(name = "author_role", length = 20)
    private String authorRole;

    private Boolean anonymous = false;

    @Column(columnDefinition = "TEXT")
    private String tags; // comma-separated

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("upvotes DESC")
    private List<Answer> answers = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}

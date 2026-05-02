package com.doubt.platform.repository;

import com.doubt.platform.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByOrderByCreatedAtDesc();

    @Query("SELECT q FROM Question q WHERE SIZE(q.answers) = 0 ORDER BY q.createdAt DESC")
    List<Question> findUnanswered();

    @Query("SELECT q FROM Question q ORDER BY SIZE(q.answers) DESC")
    List<Question> findPopular();

    @Query("SELECT q FROM Question q WHERE q.tags LIKE %:tag% ORDER BY q.createdAt DESC")
    List<Question> findByTag(String tag);
}

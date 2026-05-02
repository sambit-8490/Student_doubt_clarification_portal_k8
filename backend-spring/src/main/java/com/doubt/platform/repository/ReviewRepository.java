package com.doubt.platform.repository;

import com.doubt.platform.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByAppointmentId(Long appointmentId);
    List<Review> findByFacultyIdOrderByCreatedAtDesc(Long facultyId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.facultyId = :facultyId")
    Double avgRatingByFacultyId(Long facultyId);
}

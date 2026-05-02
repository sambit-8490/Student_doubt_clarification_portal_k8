package com.doubt.platform.repository;

import com.doubt.platform.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentIdOrderByDateDesc(Long studentId);
    List<Appointment> findByFacultyIdOrderByDateDesc(Long facultyId);
    List<Appointment> findAllByOrderByDateDesc();

    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countByStatus();

    @Query("SELECT a.tag, COUNT(a) FROM Appointment a GROUP BY a.tag")
    List<Object[]> countByTag();

    @Query("SELECT a.facultyName, COUNT(a) FROM Appointment a GROUP BY a.facultyName ORDER BY COUNT(a) DESC")
    List<Object[]> countByFaculty();
}

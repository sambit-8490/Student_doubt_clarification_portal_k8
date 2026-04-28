package com.doubt.platform.repository;

import com.doubt.platform.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentIdOrderByDateDesc(Long studentId);
    List<Appointment> findByFacultyIdOrderByDateDesc(Long facultyId);
    List<Appointment> findAllByOrderByDateDesc();
}

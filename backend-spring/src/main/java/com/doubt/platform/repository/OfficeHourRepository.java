package com.doubt.platform.repository;

import com.doubt.platform.model.OfficeHour;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfficeHourRepository extends JpaRepository<OfficeHour, Long> {
    List<OfficeHour> findAllByOrderByDateAscTimeAsc();
}

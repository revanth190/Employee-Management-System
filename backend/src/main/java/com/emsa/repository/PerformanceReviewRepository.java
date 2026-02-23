package com.emsa.repository;

import com.emsa.entity.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
    List<PerformanceReview> findByEmployeeAccountId(Long employeeId);
    List<PerformanceReview> findByReviewerAccountId(Long reviewerId);
    List<PerformanceReview> findByStatus(String status);
}

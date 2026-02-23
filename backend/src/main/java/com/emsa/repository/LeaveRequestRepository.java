package com.emsa.repository;

import com.emsa.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByAccountAccountId(Long accountId);
    List<LeaveRequest> findByStatus(String status);
    List<LeaveRequest> findByAccountReportingManagerAccountId(Long managerId);
}

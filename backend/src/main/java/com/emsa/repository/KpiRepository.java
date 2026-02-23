package com.emsa.repository;

import com.emsa.entity.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KpiRepository extends JpaRepository<Kpi, Long> {
    List<Kpi> findByEmployeeAccountId(Long employeeId);
    List<Kpi> findByAssignedByAccountId(Long assignedById);
}

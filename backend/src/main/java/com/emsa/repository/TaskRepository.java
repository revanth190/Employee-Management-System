package com.emsa.repository;

import com.emsa.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToAccountId(Long accountId);
    List<Task> findByProjectProjectId(Long projectId);
    List<Task> findByAssignedByAccountId(Long assignedById);
}

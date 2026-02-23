package com.emsa.repository;

import com.emsa.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByManagerAccountId(Long managerId);
    List<Project> findByStatus(String status);
}

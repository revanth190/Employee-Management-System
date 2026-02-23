package com.emsa.repository;

import com.emsa.entity.Account;
import com.emsa.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);
    Optional<Account> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<Account> findByRole(RoleName role);
    List<Account> findByRoleIn(List<RoleName> roles);
    List<Account> findByDepartmentDepartmentId(Long departmentId);
    List<Account> findByReportingManagerAccountId(Long managerId);
    List<Account> findByIsActive(Boolean isActive);

    @Query("SELECT a FROM Account a WHERE a.role IN :roles AND a.isActive = true ORDER BY a.role, a.department.departmentName")
    List<Account> findByRolesAndActive(@Param("roles") List<RoleName> roles);
}

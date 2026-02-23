package com.emsa.config;

import com.emsa.entity.*;
import com.emsa.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private KpiRepository kpiRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PerformanceReviewRepository performanceReviewRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no accounts exist
        if (accountRepository.count() > 0) {
            return;
        }

        // Create Departments
        Department engineering = departmentRepository.save(Department.builder()
                .departmentName("Engineering").description("Software development and architecture").build());
        Department hr = departmentRepository.save(Department.builder()
                .departmentName("Human Resources").description("HR operations and employee relations").build());
        Department finance = departmentRepository.save(Department.builder()
                .departmentName("Finance").description("Financial planning and accounting").build());
        departmentRepository.save(Department.builder()
                .departmentName("Marketing").description("Marketing, branding and campaigns").build());
        departmentRepository.save(Department.builder()
                .departmentName("Operations").description("Day-to-day operational management").build());

        // Admin account
        Account admin = accountRepository.save(Account.builder()
                .username("admin")
                .email("admin@emsa.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(RoleName.ADMIN)
                .firstName("System")
                .lastName("Administrator")
                .designation("System Administrator")
                .department(engineering)
                .hireDate(LocalDate.of(2020, 1, 1))
                .isActive(true)
                .build());

        // Manager accounts
        Account manager1 = accountRepository.save(Account.builder()
                .username("manager1")
                .email("manager1@emsa.com")
                .passwordHash(passwordEncoder.encode("manager123"))
                .role(RoleName.MANAGER)
                .firstName("Alice")
                .lastName("Johnson")
                .designation("Engineering Manager")
                .department(engineering)
                .hireDate(LocalDate.of(2021, 3, 15))
                .isActive(true)
                .build());

        Account manager2 = accountRepository.save(Account.builder()
                .username("manager2")
                .email("manager2@emsa.com")
                .passwordHash(passwordEncoder.encode("manager123"))
                .role(RoleName.MANAGER)
                .firstName("Bob")
                .lastName("Williams")
                .designation("HR Manager")
                .department(hr)
                .hireDate(LocalDate.of(2021, 6, 1))
                .isActive(true)
                .build());

        // Employee accounts
        Account emp1 = accountRepository.save(Account.builder()
                .username("emp1")
                .email("emp1@emsa.com")
                .passwordHash(passwordEncoder.encode("emp123"))
                .role(RoleName.EMPLOYEE)
                .firstName("Charlie")
                .lastName("Brown")
                .designation("Senior Developer")
                .department(engineering)
                .reportingManager(manager1)
                .hireDate(LocalDate.of(2022, 1, 10))
                .isActive(true)
                .build());

        Account emp2 = accountRepository.save(Account.builder()
                .username("emp2")
                .email("emp2@emsa.com")
                .passwordHash(passwordEncoder.encode("emp123"))
                .role(RoleName.EMPLOYEE)
                .firstName("Diana")
                .lastName("Davis")
                .designation("Junior Developer")
                .department(engineering)
                .reportingManager(manager1)
                .hireDate(LocalDate.of(2022, 7, 20))
                .isActive(true)
                .build());

        Account emp3 = accountRepository.save(Account.builder()
                .username("emp3")
                .email("emp3@emsa.com")
                .passwordHash(passwordEncoder.encode("emp123"))
                .role(RoleName.EMPLOYEE)
                .firstName("Eve")
                .lastName("Martinez")
                .designation("HR Specialist")
                .department(hr)
                .reportingManager(manager2)
                .hireDate(LocalDate.of(2023, 1, 5))
                .isActive(true)
                .build());

        // User account
        accountRepository.save(Account.builder()
                .username("user1")
                .email("user1@emsa.com")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(RoleName.USER)
                .firstName("Frank")
                .lastName("Wilson")
                .designation("Contractor")
                .department(finance)
                .hireDate(LocalDate.of(2023, 6, 1))
                .isActive(true)
                .build());

        // Create Projects
        Project proj1 = projectRepository.save(Project.builder()
                .projectName("EMSA Platform v2.0")
                .description("Upgrade and enhance the Employee Management System")
                .manager(manager1)
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2024, 12, 31))
                .status("ACTIVE")
                .build());

        Project proj2 = projectRepository.save(Project.builder()
                .projectName("HR Automation")
                .description("Automate HR workflows and onboarding")
                .manager(manager2)
                .startDate(LocalDate.of(2024, 3, 1))
                .endDate(LocalDate.of(2024, 9, 30))
                .status("ACTIVE")
                .build());

        // Create Tasks
        taskRepository.save(Task.builder()
                .project(proj1)
                .assignedTo(emp1)
                .assignedBy(manager1)
                .title("Design new dashboard UI")
                .description("Create wireframes and mockups for the new dashboard")
                .status("IN_PROGRESS")
                .priority("HIGH")
                .dueDate(LocalDate.of(2024, 4, 30))
                .hoursLogged(12.5)
                .build());

        taskRepository.save(Task.builder()
                .project(proj1)
                .assignedTo(emp2)
                .assignedBy(manager1)
                .title("Implement REST APIs")
                .description("Develop backend REST endpoints for the new features")
                .status("TODO")
                .priority("HIGH")
                .dueDate(LocalDate.of(2024, 5, 15))
                .hoursLogged(0.0)
                .build());

        taskRepository.save(Task.builder()
                .project(proj2)
                .assignedTo(emp3)
                .assignedBy(manager2)
                .title("Create onboarding checklist")
                .description("Draft a comprehensive employee onboarding checklist")
                .status("DONE")
                .priority("MEDIUM")
                .dueDate(LocalDate.of(2024, 3, 31))
                .hoursLogged(8.0)
                .build());

        // Create KPIs
        kpiRepository.save(Kpi.builder()
                .employee(emp1)
                .assignedBy(manager1)
                .title("Complete 3 feature releases")
                .description("Deliver 3 major features in Q1")
                .targetValue("3 releases")
                .achievedValue("2 releases")
                .status("IN_PROGRESS")
                .dueDate(LocalDateTime.of(2024, 3, 31, 23, 59, 59))
                .build());

        kpiRepository.save(Kpi.builder()
                .employee(emp2)
                .assignedBy(manager1)
                .title("Reduce bug count by 30%")
                .description("Improve code quality and reduce production bugs")
                .targetValue("30% reduction")
                .achievedValue(null)
                .status("PENDING")
                .dueDate(LocalDateTime.of(2024, 6, 30, 23, 59, 59))
                .build());

        kpiRepository.save(Kpi.builder()
                .employee(emp3)
                .assignedBy(manager2)
                .title("Process 100% new hires on time")
                .description("Ensure all onboarding is completed within 5 days")
                .targetValue("100%")
                .achievedValue("95%")
                .status("IN_PROGRESS")
                .dueDate(LocalDateTime.of(2024, 12, 31, 23, 59, 59))
                .build());

        // Create Leave Requests
        leaveRequestRepository.save(LeaveRequest.builder()
                .account(emp1)
                .requestType("LEAVE")
                .description("Annual vacation leave")
                .startDate(LocalDate.of(2024, 5, 1))
                .endDate(LocalDate.of(2024, 5, 5))
                .status("PENDING")
                .build());

        leaveRequestRepository.save(LeaveRequest.builder()
                .account(emp2)
                .requestType("WFH")
                .description("Working from home due to home renovations")
                .startDate(LocalDate.of(2024, 4, 10))
                .endDate(LocalDate.of(2024, 4, 12))
                .status("APPROVED")
                .reviewedBy(manager1)
                .reviewComment("Approved. Enjoy your time off!")
                .build());

        leaveRequestRepository.save(LeaveRequest.builder()
                .account(emp3)
                .requestType("REIMBURSEMENT")
                .description("Training course reimbursement - $250")
                .status("PENDING")
                .build());

        // Create Performance Reviews
        performanceReviewRepository.save(PerformanceReview.builder()
                .employee(emp1)
                .reviewer(manager1)
                .cycleName("Q4 2023 Annual Review")
                .selfAppraisal("I have successfully delivered 2 major features and mentored junior developers.")
                .managerFeedback("Charlie has shown excellent technical skills and leadership.")
                .rating(4)
                .status("APPROVED")
                .incrementRecommended(10.0)
                .build());

        performanceReviewRepository.save(PerformanceReview.builder()
                .employee(emp2)
                .reviewer(manager1)
                .cycleName("Q4 2023 Annual Review")
                .status("DRAFT")
                .build());

        // Create Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .account(admin)
                .action("LOGIN")
                .entityName("Account")
                .entityId(admin.getAccountId())
                .details("Admin logged in")
                .build());

        auditLogRepository.save(AuditLog.builder()
                .account(admin)
                .action("CREATE")
                .entityName("Account")
                .entityId(emp1.getAccountId())
                .details("Created employee account: emp1")
                .build());

        System.out.println("✅ EMSA: Default seed data loaded successfully.");
        System.out.println("   admin / admin123");
        System.out.println("   manager1 / manager123");
        System.out.println("   emp1 / emp123");
        System.out.println("   user1 / user123");
        System.out.println("   Projects, Tasks, KPIs, Leave Requests, Reviews, Audit Logs created");
    }
}

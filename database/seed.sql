-- EMSA Seed Data (REFERENCE ONLY)
-- NOTE: The Spring Boot DataLoader (DataLoader.java) automatically seeds default data
-- on first startup using BCryptPasswordEncoder. You do NOT need to run this file manually.
-- This file is provided as a reference for the data structure.
-- 
-- Default accounts created by DataLoader:
--   admin      / admin123    (ADMIN)
--   manager1   / manager123  (MANAGER)
--   manager2   / manager123  (MANAGER)
--   emp1       / emp123      (EMPLOYEE)
--   emp2       / emp123      (EMPLOYEE)
--   emp3       / emp123      (EMPLOYEE)
--   user1      / user123     (USER)
--
-- If you want to reset data, truncate all tables and restart the backend.

USE emsa_db;

-- Departments
INSERT INTO departments (department_name, description) VALUES
('Engineering', 'Software development and architecture'),
('Human Resources', 'HR operations and employee relations'),
('Finance', 'Financial planning and accounting'),
('Marketing', 'Marketing, branding and campaigns'),
('Operations', 'Day-to-day operational management');

-- Accounts
-- Admin: username=admin, password=admin123
-- Manager: username=manager1, password=manager123
-- BCrypt hash for "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- BCrypt hash for "manager123": $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi

INSERT INTO accounts (username, email, password_hash, role, first_name, last_name, designation, department_id, hire_date, is_active) VALUES
('admin', 'admin@emsa.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'System', 'Administrator', 'System Administrator', 1, '2020-01-01', 1),
('manager1', 'manager1@emsa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'MANAGER', 'Alice', 'Johnson', 'Engineering Manager', 1, '2021-03-15', 1),
('manager2', 'manager2@emsa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'MANAGER', 'Bob', 'Williams', 'HR Manager', 2, '2021-06-01', 1),
('emp1', 'emp1@emsa.com', '$2a$10$6BB8TuqRPSJmrxXqsPiGTuQN8VgLipfE7DFpbCKwfQy/pMFc0S5Wi', 'EMPLOYEE', 'Charlie', 'Brown', 'Senior Developer', 1, '2022-01-10', 1),
('emp2', 'emp2@emsa.com', '$2a$10$6BB8TuqRPSJmrxXqsPiGTuQN8VgLipfE7DFpbCKwfQy/pMFc0S5Wi', 'EMPLOYEE', 'Diana', 'Davis', 'Junior Developer', 1, '2022-07-20', 1),
('emp3', 'emp3@emsa.com', '$2a$10$6BB8TuqRPSJmrxXqsPiGTuQN8VgLipfE7DFpbCKwfQy/pMFc0S5Wi', 'EMPLOYEE', 'Eve', 'Martinez', 'HR Specialist', 2, '2023-01-05', 1),
('user1', 'user1@emsa.com', '$2a$10$8K1p/a0dclxGQW.vTkqxguJcPTL6gYxM3.kxRiQ3lFbMNgk0rN.Nm', 'USER', 'Frank', 'Wilson', 'Contractor', 3, '2023-06-01', 1);

-- Set reporting managers
UPDATE accounts SET reporting_manager_id = 2 WHERE username IN ('emp1', 'emp2');
UPDATE accounts SET reporting_manager_id = 3 WHERE username = 'emp3';

-- Projects
INSERT INTO projects (project_name, description, manager_id, start_date, end_date, status) VALUES
('EMSA Platform v2.0', 'Upgrade and enhance the Employee Management System', 2, '2024-01-01', '2024-12-31', 'ACTIVE'),
('HR Automation', 'Automate HR workflows and onboarding', 3, '2024-03-01', '2024-09-30', 'ACTIVE');

-- Tasks
INSERT INTO tasks (project_id, assigned_to_id, assigned_by_id, title, description, status, priority, due_date, hours_logged) VALUES
(1, 4, 2, 'Design new dashboard UI', 'Create wireframes and mockups for the new dashboard', 'IN_PROGRESS', 'HIGH', '2024-04-30', 12.5),
(1, 5, 2, 'Implement REST APIs', 'Develop backend REST endpoints for the new features', 'TODO', 'HIGH', '2024-05-15', 0.0),
(2, 6, 3, 'Create onboarding checklist', 'Draft a comprehensive employee onboarding checklist', 'DONE', 'MEDIUM', '2024-03-31', 8.0);

-- KPIs
INSERT INTO kpis (employee_id, assigned_by_id, title, description, target_value, achieved_value, status, due_date) VALUES
(4, 2, 'Complete 3 feature releases', 'Deliver 3 major features in Q1', '3 releases', '2 releases', 'IN_PROGRESS', '2024-03-31 23:59:59'),
(5, 2, 'Reduce bug count by 30%', 'Improve code quality and reduce production bugs', '30% reduction', NULL, 'PENDING', '2024-06-30 23:59:59'),
(6, 3, 'Process 100% new hires on time', 'Ensure all onboarding is completed within 5 days', '100%', '95%', 'IN_PROGRESS', '2024-12-31 23:59:59');

-- Leave Requests
INSERT INTO leave_requests (account_id, request_type, description, start_date, end_date, status) VALUES
(4, 'LEAVE', 'Annual vacation leave', '2024-05-01', '2024-05-05', 'PENDING'),
(5, 'WFH', 'Working from home due to home renovations', '2024-04-10', '2024-04-12', 'APPROVED'),
(6, 'REIMBURSEMENT', 'Training course reimbursement - $250', NULL, NULL, 'PENDING');

-- Performance Reviews
INSERT INTO performance_reviews (employee_id, reviewer_id, cycle_name, self_appraisal, manager_feedback, rating, status, increment_recommended) VALUES
(4, 2, 'Q4 2023 Annual Review', 'I have successfully delivered 2 major features and mentored junior developers.', 'Charlie has shown excellent technical skills and leadership.', 4, 'APPROVED', 10.0),
(5, 2, 'Q4 2023 Annual Review', NULL, NULL, NULL, 'DRAFT', NULL);

-- Update leave reviewed_by for approved one
UPDATE leave_requests SET reviewed_by_id = 2, review_comment = 'Approved. Enjoy your time off!' WHERE account_id = 5 AND request_type = 'WFH';

-- Audit Logs
INSERT INTO audit_logs (account_id, action, entity_name, entity_id, details) VALUES
(1, 'LOGIN', 'Account', 1, 'Admin logged in'),
(1, 'CREATE', 'Account', 4, 'Created employee account: emp1'),
(2, 'CREATE', 'Project', 1, 'Created project: EMSA Platform v2.0'),
(2, 'CREATE', 'Task', 1, 'Created task: Design new dashboard UI');

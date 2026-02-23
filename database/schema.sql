-- EMSA Database Schema
-- STEP 1: Run this file to create the database ONLY.
-- The tables are created automatically by Spring Boot (JPA ddl-auto=update).
-- After running this, start the backend - it will create all tables and seed default users.
--
-- To run: mysql -u root -p < schema.sql
-- OR in MySQL Workbench: File > Open SQL Script > schema.sql > Execute

CREATE DATABASE IF NOT EXISTS emsa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE emsa_db;

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    department_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description     VARCHAR(255),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Accounts Table (Users, Employees, Managers, Admins)
CREATE TABLE IF NOT EXISTS accounts (
    account_id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    username                VARCHAR(50) NOT NULL UNIQUE,
    email                   VARCHAR(100) NOT NULL UNIQUE,
    password_hash           VARCHAR(255) NOT NULL,
    role                    ENUM('ADMIN', 'MANAGER', 'EMPLOYEE', 'USER') NOT NULL,
    first_name              VARCHAR(50) NOT NULL,
    last_name               VARCHAR(50) NOT NULL,
    phone_number            VARCHAR(20),
    address                 VARCHAR(255),
    date_of_birth           DATE,
    hire_date               DATE,
    designation             VARCHAR(100),
    department_id           BIGINT,
    reporting_manager_id    BIGINT,
    emergency_contact_name  VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    is_active               TINYINT(1) NOT NULL DEFAULT 1,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    CONSTRAINT fk_account_manager FOREIGN KEY (reporting_manager_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- KPIs Table
CREATE TABLE IF NOT EXISTS kpis (
    kpi_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id     BIGINT NOT NULL,
    assigned_by_id  BIGINT NOT NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    target_value    VARCHAR(100),
    achieved_value  VARCHAR(100),
    status          VARCHAR(30) DEFAULT 'PENDING',
    due_date        DATETIME,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_kpi_employee FOREIGN KEY (employee_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_kpi_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name    VARCHAR(150) NOT NULL,
    description     TEXT,
    manager_id      BIGINT,
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(30) DEFAULT 'ACTIVE',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_manager FOREIGN KEY (manager_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    task_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id      BIGINT NOT NULL,
    assigned_to_id  BIGINT,
    assigned_by_id  BIGINT,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    status          VARCHAR(30) DEFAULT 'TODO',
    priority        VARCHAR(20) DEFAULT 'MEDIUM',
    due_date        DATE,
    hours_logged    DOUBLE DEFAULT 0.0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    CONSTRAINT fk_task_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    request_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id      BIGINT NOT NULL,
    request_type    VARCHAR(50) NOT NULL,
    description     TEXT,
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20) DEFAULT 'PENDING',
    reviewed_by_id  BIGINT,
    review_comment  VARCHAR(255),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

-- Performance Reviews Table
CREATE TABLE IF NOT EXISTS performance_reviews (
    review_id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id             BIGINT NOT NULL,
    reviewer_id             BIGINT NOT NULL,
    cycle_name              VARCHAR(100),
    self_appraisal          TEXT,
    manager_feedback        TEXT,
    rating                  INT,
    status                  VARCHAR(30) DEFAULT 'DRAFT',
    increment_recommended   DOUBLE,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_employee FOREIGN KEY (employee_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES accounts(account_id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id  BIGINT,
    action      VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id   BIGINT,
    details     TEXT,
    ip_address  VARCHAR(50),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE SET NULL
);

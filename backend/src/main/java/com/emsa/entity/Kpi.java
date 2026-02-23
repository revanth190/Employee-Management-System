package com.emsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Kpi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kpi_id")
    private Long kpiId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Account employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_id", nullable = false)
    private Account assignedBy;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_value", length = 100)
    private String targetValue;

    @Column(name = "achieved_value", length = 100)
    private String achievedValue;

    @Column(name = "status", length = 30)
    private String status; // PENDING, IN_PROGRESS, ACHIEVED, NOT_ACHIEVED

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

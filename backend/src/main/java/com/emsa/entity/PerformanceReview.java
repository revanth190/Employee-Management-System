package com.emsa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Account employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private Account reviewer;

    @Column(name = "cycle_name", length = 100)
    private String cycleName;

    @Column(name = "self_appraisal", columnDefinition = "TEXT")
    private String selfAppraisal;

    @Column(name = "manager_feedback", columnDefinition = "TEXT")
    private String managerFeedback;

    @Column(name = "rating")
    private Integer rating; // 1-5

    @Column(name = "status", length = 30)
    private String status; // DRAFT, SUBMITTED, REVIEWED, APPROVED

    @Column(name = "increment_recommended")
    private Double incrementRecommended;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "DRAFT";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

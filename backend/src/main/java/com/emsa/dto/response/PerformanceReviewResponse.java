package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PerformanceReviewResponse {
    private Long reviewId;
    private Long employeeId;
    private String employeeName;
    private Long reviewerId;
    private String reviewerName;
    private String cycleName;
    private String selfAppraisal;
    private String managerFeedback;
    private Integer rating;
    private String status;
    private Double incrementRecommended;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

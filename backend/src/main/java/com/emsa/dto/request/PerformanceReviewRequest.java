package com.emsa.dto.request;

import lombok.Data;

@Data
public class PerformanceReviewRequest {
    private Long employeeId;
    private String cycleName;
    private String selfAppraisal;
    private String managerFeedback;
    private Integer rating;
    private String status;
    private Double incrementRecommended;
}

package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewLeaveRequest {
    @NotBlank(message = "Status is required")
    private String status; // APPROVED or REJECTED
    private String reviewComment;
}

package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LeaveRequestResponse {
    private Long requestId;
    private Long accountId;
    private String accountName;
    private String requestType;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long reviewedById;
    private String reviewedByName;
    private String reviewComment;
    private LocalDateTime createdAt;
}
